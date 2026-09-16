import mongoose from "mongoose";

import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/* ======================================================
   HELPERS
====================================================== */

const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
};

const isValidObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

const allowedElectionTypes = [
  "PRESIDENTIAL",
  "PARLIAMENTARY",
  "ASSEMBLY",
  "LOCAL",
  "COLLEGE",
  "ORGANIZATION",
  "OTHER",
];

const allowedStatuses = [
  "DRAFT",
  "UPCOMING",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
];

/*
 * Dynamically calculate election state.
 */
const getElectionStatus = (election) => {
  if (election.status === "CANCELLED") {
    return "CANCELLED";
  }

  if (!election.isPublished) {
    return "DRAFT";
  }

  const now = new Date();

  if (now < election.startDate) {
    return "UPCOMING";
  }

  if (
    now >= election.startDate &&
    now < election.endDate
  ) {
    return "LIVE";
  }

  return "COMPLETED";
};

const normalizeString = (value) => {
  return typeof value === "string"
    ? value.trim()
    : "";
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return false;
};

const normalizeInstructions = (instructions) => {
  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions
    .filter(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0
    )
    .map((item) => item.trim())
    .slice(0, 100);
};

/*
 * Make sure old elections created before the current
 * schema still have createdBy before calling save().
 *
 * This fixes:
 * Election validation failed:
 * createdBy: Path `createdBy` is required.
 */
const ensureCreatedBy = (election, req) => {
  if (
    !election.createdBy ||
    !isValidObjectId(election.createdBy)
  ) {
    const userId = getUserId(req);

    if (
      userId &&
      isValidObjectId(userId)
    ) {
      election.createdBy = userId;
      return true;
    }

    return false;
  }

  return true;
};

/* ======================================================
   NOTIFICATION HELPER
====================================================== */

const notifyUsers = async ({
  title,
  message,
  type,
  relatedElection = null,
  actionUrl = "",
  priority = "NORMAL",
}) => {
  try {
    const users = await User.find({
      role: "user",
      isActive: true,
      isBlocked: false,
      isVerified: true,
    })
      .select("_id")
      .lean();

    if (!users.length) {
      return;
    }

    const notifications = users.map((user) => ({
      user: user._id,
      title,
      message,
      type,
      relatedElection,
      actionUrl,
      priority,
    }));

    await Notification.insertMany(
      notifications,
      {
        ordered: false,
      }
    );
  } catch (error) {
    /*
     * Notification failure must never break
     * the election operation.
     */
    console.error(
      "ELECTION NOTIFICATION ERROR:",
      error.message
    );
  }
};

/* ======================================================
   CREATE ELECTION
   POST /api/elections
====================================================== */

export const createElection = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (
      !userId ||
      !isValidObjectId(userId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      title,
      description,
      electionType,
      startDate,
      endDate,
      bannerImage,
      instructions,
      allowResultsBeforeEnd,
    } = req.body || {};

    /* --------------------------------------------------
       TITLE
    -------------------------------------------------- */

    const cleanTitle = normalizeString(title);

    if (cleanTitle.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Election title must contain at least 3 characters.",
      });
    }

    if (cleanTitle.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          "Election title cannot exceed 200 characters.",
      });
    }

    /* --------------------------------------------------
       DATES
    -------------------------------------------------- */

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Start date and end date are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid election dates.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message:
          "End date must be after start date.",
      });
    }

    /* --------------------------------------------------
       ELECTION TYPE
    -------------------------------------------------- */

    const cleanElectionType =
      electionType || "OTHER";

    if (
      !allowedElectionTypes.includes(
        cleanElectionType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid election type.",
      });
    }

    /* --------------------------------------------------
       CREATE
    -------------------------------------------------- */

    const election =
      await Election.create({
        title: cleanTitle,

        description:
          normalizeString(description),

        electionType:
          cleanElectionType,

        startDate: start,
        endDate: end,

        createdBy: userId,

        candidates: [],

        totalVotes: 0,
        totalEligibleVoters: 0,

        isPublished: false,
        isResultsPublished: false,

        allowResultsBeforeEnd:
          normalizeBoolean(
            allowResultsBeforeEnd
          ),

        bannerImage:
          normalizeString(bannerImage),

        instructions:
          normalizeInstructions(
            instructions
          ),

        status: "DRAFT",
      });

    return res.status(201).json({
      success: true,
      message:
        "Election created successfully.",
      election,
    });
  } catch (error) {
    console.error(
      "CREATE ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create election.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ======================================================
   GET ALL ELECTIONS
   GET /api/elections
====================================================== */

export const getAllElections = async (
  req,
  res
) => {
  try {
    const filter = {};

    /* --------------------------------------------------
       STATUS FILTER
    -------------------------------------------------- */

    if (req.query.status) {
      const status =
        String(
          req.query.status
        ).toUpperCase();

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid election status.",
        });
      }

      filter.status = status;
    }

    /* --------------------------------------------------
       PUBLISHED FILTER
    -------------------------------------------------- */

    if (
      req.query.published !== undefined
    ) {
      const published =
        String(
          req.query.published
        ).toLowerCase();

      if (
        published !== "true" &&
        published !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Published filter must be true or false.",
        });
      }

      filter.isPublished =
        published === "true";
    }

    /* --------------------------------------------------
       FETCH
    -------------------------------------------------- */

    const elections =
      await Election.find(filter)
        .populate(
          "candidates",
          "name party symbol photo manifesto biography experience position isActive"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    const formattedElections =
      elections.map((election) => {
        const item =
          election.toObject({
            virtuals: true,
          });

        item.currentState =
          getElectionStatus(
            election
          );

        return item;
      });

    return res.status(200).json({
      success: true,
      count:
        formattedElections.length,
      elections:
        formattedElections,
    });
  } catch (error) {
    console.error(
      "GET ELECTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch elections.",
    });
  }
};

/* ======================================================
   GET PUBLIC ELECTIONS
   GET /api/elections/public
====================================================== */

export const getPublicElections = async (
  req,
  res
) => {
  try {
    const elections =
      await Election.find({
        isPublished: true,
        status: {
          $in: [
            "UPCOMING",
            "LIVE",
            "COMPLETED",
          ],
        },
      })
        .populate(
          "candidates",
          "name party symbol photo biography manifesto experience position isActive"
        )
        .select(
          "-metadata -createdBy -totalVotes"
        )
        .sort({
          startDate: 1,
        });

    const formattedElections =
      elections.map((election) => {
        const item =
          election.toObject({
            virtuals: true,
          });

        item.currentState =
          getElectionStatus(
            election
          );

        return item;
      });

    return res.status(200).json({
      success: true,
      count:
        formattedElections.length,
      elections:
        formattedElections,
    });
  } catch (error) {
    console.error(
      "GET PUBLIC ELECTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch public elections.",
    });
  }
};

/* ======================================================
   GET SINGLE ELECTION
   GET /api/elections/:id
====================================================== */

export const getElectionById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const election =
      await Election.findById(id)
        .populate(
          "candidates",
          "name party symbol photo manifesto biography experience position isActive"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /*
     * Public endpoint does not expose
     * unpublished drafts.
     */
    if (
      !election.isPublished ||
      election.status === "DRAFT"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    const electionData =
      election.toObject({
        virtuals: true,
      });

    electionData.currentState =
      getElectionStatus(
        election
      );

    return res.status(200).json({
      success: true,
      election:
        electionData,
    });
  } catch (error) {
    console.error(
      "GET ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch election.",
    });
  }
};

/* ======================================================
   UPDATE ELECTION
   PUT /api/elections/:id
====================================================== */

export const updateElection = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (
      !userId ||
      !isValidObjectId(userId)
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const election =
      await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /*
     * Repair old elections that do not have
     * createdBy.
     *
     * This is the exact fix for:
     * "createdBy: Path `createdBy` is required."
     */
    if (!election.createdBy) {
      election.createdBy = userId;
    }

    const currentStatus =
      getElectionStatus(
        election
      );

    /* --------------------------------------------------
       LOCK LIVE / COMPLETED / CANCELLED
    -------------------------------------------------- */

    if (
      [
        "LIVE",
        "COMPLETED",
        "CANCELLED",
      ].includes(currentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Live, completed or cancelled elections cannot be edited.",
      });
    }

    /* --------------------------------------------------
       OLD VALUES
    -------------------------------------------------- */

    const oldTitle =
      election.title;

    const oldStartDate =
      new Date(
        election.startDate
      );

    const oldEndDate =
      new Date(
        election.endDate
      );

    /* --------------------------------------------------
       TITLE
    -------------------------------------------------- */

    if (
      req.body?.title !== undefined
    ) {
      const cleanTitle =
        normalizeString(
          req.body.title
        );

      if (cleanTitle.length < 3) {
        return res.status(400).json({
          success: false,
          message:
            "Election title must contain at least 3 characters.",
        });
      }

      if (cleanTitle.length > 200) {
        return res.status(400).json({
          success: false,
          message:
            "Election title cannot exceed 200 characters.",
        });
      }

      election.title =
        cleanTitle;
    }

    /* --------------------------------------------------
       DESCRIPTION
    -------------------------------------------------- */

    if (
      req.body?.description !== undefined
    ) {
      election.description =
        normalizeString(
          req.body.description
        );
    }

    /* --------------------------------------------------
       ELECTION TYPE
    -------------------------------------------------- */

    if (
      req.body?.electionType !== undefined
    ) {
      const type =
        String(
          req.body.electionType
        ).toUpperCase();

      if (
        !allowedElectionTypes.includes(
          type
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid election type.",
        });
      }

      election.electionType =
        type;
    }

    /* --------------------------------------------------
       START DATE
    -------------------------------------------------- */

    if (
      req.body?.startDate !== undefined
    ) {
      const start =
        new Date(
          req.body.startDate
        );

      if (
        Number.isNaN(
          start.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid start date.",
        });
      }

      election.startDate =
        start;
    }

    /* --------------------------------------------------
       END DATE
    -------------------------------------------------- */

    if (
      req.body?.endDate !== undefined
    ) {
      const end =
        new Date(
          req.body.endDate
        );

      if (
        Number.isNaN(
          end.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid end date.",
        });
      }

      election.endDate =
        end;
    }

    /* --------------------------------------------------
       BANNER IMAGE
    -------------------------------------------------- */

    if (
      req.body?.bannerImage !== undefined
    ) {
      election.bannerImage =
        normalizeString(
          req.body.bannerImage
        );
    }

    /* --------------------------------------------------
       INSTRUCTIONS
    -------------------------------------------------- */

    if (
      req.body?.instructions !== undefined
    ) {
      election.instructions =
        normalizeInstructions(
          req.body.instructions
        );
    }

    /* --------------------------------------------------
       RESULTS BEFORE END
    -------------------------------------------------- */

    if (
      req.body?.allowResultsBeforeEnd !==
      undefined
    ) {
      election.allowResultsBeforeEnd =
        normalizeBoolean(
          req.body
            .allowResultsBeforeEnd
        );
    }

    /* --------------------------------------------------
       FINAL VALIDATION
    -------------------------------------------------- */

    if (
      !election.title ||
      election.title.length < 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Election title must contain at least 3 characters.",
      });
    }

    if (
      !election.startDate ||
      !election.endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Start date and end date are required.",
      });
    }

    if (
      election.endDate <=
      election.startDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "End date must be after start date.",
      });
    }

    /*
     * A published election cannot be moved
     * into a state where its start date is
     * already in the past.
     */
    if (
      election.isPublished &&
      election.startDate < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A published election cannot have its start date moved into the past.",
      });
    }

    /* --------------------------------------------------
       CREATED BY SAFETY
    -------------------------------------------------- */

    if (
      !election.createdBy &&
      userId
    ) {
      election.createdBy =
        userId;
    }

    /* --------------------------------------------------
       STATUS
    -------------------------------------------------- */

    if (election.isPublished) {
      /*
       * Calculate current state based on
       * the new dates.
       */
      const calculatedStatus =
        getElectionStatus(
          election
        );

      if (
        calculatedStatus ===
        "CANCELLED"
      ) {
        election.status =
          "CANCELLED";
      } else {
        election.status =
          calculatedStatus;
      }
    } else {
      election.status =
        "DRAFT";
    }

    /* --------------------------------------------------
       SAVE
    -------------------------------------------------- */

    await election.save();

    /* --------------------------------------------------
       CHECK CHANGES
    -------------------------------------------------- */

    const changed =
      oldTitle !== election.title ||
      oldStartDate.getTime() !==
        new Date(
          election.startDate
        ).getTime() ||
      oldEndDate.getTime() !==
        new Date(
          election.endDate
        ).getTime();

    /* --------------------------------------------------
       NOTIFY
    -------------------------------------------------- */

    if (
      changed &&
      election.isPublished
    ) {
      await notifyUsers({
        title:
          "Election Updated",
        message:
          `"${election.title}" has been updated. Please review the latest election details.`,
        type:
          "ELECTION_UPDATED",
        relatedElection:
          election._id,
        actionUrl:
          `/elections/${election._id}`,
        priority:
          "NORMAL",
      });
    }

    const electionData =
      election.toObject({
        virtuals: true,
      });

    electionData.currentState =
      getElectionStatus(
        election
      );

    return res.status(200).json({
      success: true,
      message:
        "Election updated successfully.",
      election:
        electionData,
    });
  } catch (error) {
    console.error(
      "UPDATE ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update election.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ======================================================
   PUBLISH ELECTION
   PATCH /api/elections/:id/publish
====================================================== */

export const publishElection = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (
      !userId ||
      !isValidObjectId(userId)
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const election =
      await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /* --------------------------------------------------
       REPAIR OLD ELECTION
    -------------------------------------------------- */

    if (!election.createdBy) {
      election.createdBy =
        userId;
    }

    /* --------------------------------------------------
       CHECK STATUS
    -------------------------------------------------- */

    const currentStatus =
      getElectionStatus(
        election
      );

    if (
      currentStatus ===
      "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A completed election cannot be published.",
      });
    }

    if (
      currentStatus ===
      "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A cancelled election cannot be published.",
      });
    }

    if (election.isPublished) {
      return res.status(400).json({
        success: false,
        message:
          "Election is already published.",
      });
    }

    /* --------------------------------------------------
       NO CANDIDATE REQUIREMENT
    -------------------------------------------------- */

    /*
     * IMPORTANT:
     *
     * There is intentionally NO candidate-count
     * validation here.
     *
     * Election can be published with:
     * - 0 candidates
     * - 1 candidate
     * - multiple candidates
     *
     * Candidates can be added separately.
     */

    election.isPublished =
      true;

    /*
     * Calculate state after publishing.
     */
    election.status =
      getElectionStatus(
        election
      );

    await election.save();

    /* --------------------------------------------------
       NOTIFY USERS
    -------------------------------------------------- */

    await notifyUsers({
      title:
        "New Election Available",
      message:
        `"${election.title}" is now published. Please review the election details and voting schedule.`,
      type:
        "NEW_ELECTION",
      relatedElection:
        election._id,
      actionUrl:
        `/elections/${election._id}`,
      priority:
        "HIGH",
    });

    const electionData =
      election.toObject({
        virtuals: true,
      });

    electionData.currentState =
      getElectionStatus(
        election
      );

    return res.status(200).json({
      success: true,
      message:
        "Election published successfully.",
      election:
        electionData,
    });
  } catch (error) {
    console.error(
      "PUBLISH ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to publish election.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ======================================================
   CANCEL ELECTION
   PATCH /api/elections/:id/cancel
====================================================== */

export const cancelElection = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = getUserId(req);

    if (
      !userId ||
      !isValidObjectId(userId)
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const election =
      await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /*
     * Repair old elections that don't have
     * createdBy before save().
     */
    if (!election.createdBy) {
      election.createdBy =
        userId;
    }

    const currentStatus =
      getElectionStatus(
        election
      );

    /* --------------------------------------------------
       COMPLETED
    -------------------------------------------------- */

    if (
      currentStatus ===
      "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed elections cannot be cancelled.",
      });
    }

    /* --------------------------------------------------
       ALREADY CANCELLED
    -------------------------------------------------- */

    if (
      currentStatus ===
      "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Election is already cancelled.",
      });
    }

    /* --------------------------------------------------
       CANCEL
    -------------------------------------------------- */

    election.status =
      "CANCELLED";

    election.isPublished =
      false;

    await election.save();

    /* --------------------------------------------------
       NOTIFY
    -------------------------------------------------- */

    await notifyUsers({
      title:
        "Election Cancelled",
      message:
        `"${election.title}" has been cancelled. Voting for this election is no longer available.`,
      type:
        "ELECTION_CANCELLED",
      relatedElection:
        election._id,
      actionUrl:
        `/elections/${election._id}`,
      priority:
        "URGENT",
    });

    const electionData =
      election.toObject({
        virtuals: true,
      });

    electionData.currentState =
      "CANCELLED";

    return res.status(200).json({
      success: true,
      message:
        "Election cancelled successfully.",
      election:
        electionData,
    });
  } catch (error) {
    console.error(
      "CANCEL ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel election.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ======================================================
   DELETE ELECTION
   DELETE /api/elections/:id
====================================================== */

export const deleteElection = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const election =
      await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    const currentStatus =
      getElectionStatus(
        election
      );

    /* --------------------------------------------------
       LIVE ELECTION
    -------------------------------------------------- */

    if (
      currentStatus === "LIVE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Live elections cannot be deleted.",
      });
    }

    /* --------------------------------------------------
       CHECK RECORDED VOTES
    -------------------------------------------------- */

    const voteCount =
      await Vote.countDocuments({
        election:
          election._id,
      });

    /*
     * Never remove an election that already
     * has real voting records.
     *
     * This protects election history and
     * prevents broken vote references.
     */
    if (voteCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "An election with recorded votes cannot be deleted.",
        voteCount,
      });
    }

    /* --------------------------------------------------
       DELETE CANDIDATES
    -------------------------------------------------- */

    await Candidate.deleteMany({
      election:
        election._id,
    });

    /* --------------------------------------------------
       DELETE NOTIFICATIONS
    -------------------------------------------------- */

    await Notification.deleteMany({
      relatedElection:
        election._id,
    });

    /* --------------------------------------------------
       DELETE ELECTION
    -------------------------------------------------- */

    await Election.deleteOne({
      _id: election._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Election deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE ELECTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete election.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};