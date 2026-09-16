import mongoose from "mongoose";

import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Check whether MongoDB ObjectId is valid.
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Convert any value into a trimmed string.
 * Undefined / null become empty string.
 */
const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

/* =========================================================
   GET CURRENT ELECTION STATE
========================================================= */

const getElectionState = (election) => {
  if (!election) {
    return null;
  }

  /* Cancelled election always remains cancelled. */
  if (election.status === "CANCELLED") {
    return "CANCELLED";
  }

  /* Unpublished election is treated as draft. */
  if (!election.isPublished) {
    return "DRAFT";
  }

  const now = new Date();

  /* Before start date. */
  if (now < election.startDate) {
    return "UPCOMING";
  }

  /* During election. */
  if (
    now >= election.startDate &&
    now < election.endDate
  ) {
    return "LIVE";
  }

  /* After end date. */
  if (now >= election.endDate) {
    return "COMPLETED";
  }

  return election.status;
};

/* =========================================================
   SAFE CANDIDATE RESPONSE
========================================================= */

const getSafeCandidateData = (candidate) => {
  return {
    _id: candidate._id,

    election: candidate.election,

    name: candidate.name,

    party: candidate.party || "",

    symbol: candidate.symbol || "",

    photo: candidate.photo || "",

    manifesto: candidate.manifesto || "",

    biography: candidate.biography || "",

    experience: candidate.experience || "",

    position: candidate.position || "",

    /*
      voteCount is returned only as cached/compatibility data.
      Actual election results come from Vote collection.
    */
    voteCount: candidate.voteCount || 0,

    isActive: candidate.isActive,

    createdAt: candidate.createdAt,

    updatedAt: candidate.updatedAt,
  };
};

/* =========================================================
   CREATE CANDIDATE / VOTING OPTION
========================================================= */

export const createCandidate = async (req, res) => {
  try {
    const {
      election,
      name,
      party,
      symbol,
      photo,
      manifesto,
      biography,
      experience,
      position,
    } = req.body;

    /* =====================================================
       REQUIRED FIELDS
    ===================================================== */

    if (!election || !name) {
      return res.status(400).json({
        success: false,
        message:
          "Election and candidate name are required.",
      });
    }

    /* =====================================================
       VALIDATE ELECTION ID
    ===================================================== */

    if (!isValidObjectId(election)) {
      return res.status(400).json({
        success: false,
        message: "Invalid election ID.",
      });
    }

    /* =====================================================
       FIND ELECTION
    ===================================================== */

    const electionData =
      await Election.findById(election);

    if (!electionData) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    /* =====================================================
       CHECK ELECTION STATE
    ===================================================== */

    const electionState =
      getElectionState(electionData);

    /*
      New voting options cannot be added once voting
      has started.
    */

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added while the election is live.",
      });
    }

    if (electionState === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added to a completed election.",
      });
    }

    if (electionState === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message:
          "Candidates cannot be added to a cancelled election.",
      });
    }

    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const candidateName =
      normalizeString(name);

    const candidateParty =
      normalizeString(party);

    const candidateSymbol =
      normalizeString(symbol);

    const candidatePhoto =
      normalizeString(photo);

    const candidateManifesto =
      normalizeString(manifesto);

    const candidateBiography =
      normalizeString(biography);

    const candidateExperience =
      normalizeString(experience);

    const candidatePosition =
      normalizeString(position);

    /* =====================================================
       VALIDATE NAME
    ===================================================== */

    if (candidateName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate name must contain at least 2 characters.",
      });
    }

    if (candidateName.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate name cannot exceed 100 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL PARTY
    ===================================================== */

    if (candidateParty.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate party cannot exceed 100 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL SYMBOL
    ===================================================== */

    if (candidateSymbol.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate symbol cannot exceed 100 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL MANIFESTO
    ===================================================== */

    if (candidateManifesto.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate manifesto cannot exceed 5000 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL BIOGRAPHY
    ===================================================== */

    if (candidateBiography.length > 5000) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate biography cannot exceed 5000 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL EXPERIENCE
    ===================================================== */

    if (candidateExperience.length > 3000) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate experience cannot exceed 3000 characters.",
      });
    }

    /* =====================================================
       VALIDATE OPTIONAL POSITION
    ===================================================== */

    if (candidatePosition.length > 150) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate position cannot exceed 150 characters.",
      });
    }

    /* =====================================================
       DUPLICATE NAME CHECK
    ===================================================== */

    const existingCandidate =
      await Candidate.findOne({
        election: electionData._id,
        name: candidateName,
      });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    /* =====================================================
       CREATE CANDIDATE
    ===================================================== */

    const candidate =
      await Candidate.create({
        election: electionData._id,

        name: candidateName,

        party: candidateParty,

        symbol: candidateSymbol,

        photo: candidatePhoto,

        manifesto: candidateManifesto,

        biography: candidateBiography,

        experience: candidateExperience,

        position: candidatePosition,

        voteCount: 0,

        isActive: true,
      });

    /* =====================================================
       ADD CANDIDATE REFERENCE TO ELECTION
    ===================================================== */

    await Election.updateOne(
      {
        _id: electionData._id,
      },
      {
        $addToSet: {
          candidates: candidate._id,
        },
      }
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message:
        "Candidate created successfully.",
      candidate:
        getSafeCandidateData(candidate),
    });
  } catch (error) {
    console.error(
      "CREATE CANDIDATE ERROR:",
      error
    );

    /* =====================================================
       MONGO DUPLICATE KEY
    ===================================================== */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    /* =====================================================
       MONGOOSE VALIDATION
    ===================================================== */

    if (
      error.name === "ValidationError"
    ) {
      const messages =
        Object.values(error.errors).map(
          (err) => err.message
        );

      return res.status(400).json({
        success: false,
        message:
          "Candidate validation failed.",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create candidate.",
    });
  }
};

/* =========================================================
   GET ALL CANDIDATES / VOTING OPTIONS
========================================================= */

export const getCandidates = async (
  req,
  res
) => {
  try {
    const filter = {};

    /* =====================================================
       ELECTION FILTER
       
       Example:
       GET /api/candidates?election=ID
    ===================================================== */

    if (req.query.election) {
      if (
        !isValidObjectId(
          req.query.election
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid election ID.",
        });
      }

      filter.election =
        req.query.election;
    }

    /* =====================================================
       ACTIVE FILTER
       
       Example:
       ?active=true
       ?active=false
    ===================================================== */

    if (
      req.query.active !== undefined
    ) {
      if (
        req.query.active !== "true" &&
        req.query.active !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The active query parameter must be true or false.",
        });
      }

      filter.isActive =
        req.query.active === "true";
    }

    /* =====================================================
       FETCH CANDIDATES
    ===================================================== */

    const candidates =
      await Candidate.find(filter)
        .populate(
          "election",
          "title description electionType status startDate endDate isPublished isResultsPublished"
        )
        .sort({
          createdAt: 1,
        })
        .lean();

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error(
      "GET CANDIDATES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch candidates.",
    });
  }
};

/* =========================================================
   GET SINGLE CANDIDATE
========================================================= */

export const getCandidateById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid candidate ID.",
      });
    }

    /* =====================================================
       FIND CANDIDATE
    ===================================================== */

    const candidate =
      await Candidate.findById(id)
        .populate(
          "election",
          "title description electionType status startDate endDate isPublished isResultsPublished"
        )
        .lean();

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found.",
      });
    }

    /* =====================================================
       PUBLIC ACCESS ONLY FOR PUBLISHED ELECTION
    ===================================================== */

    if (
      !candidate.election ||
      candidate.election.isPublished !== true
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found.",
      });
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error(
      "GET CANDIDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch candidate.",
    });
  }
};

/* =========================================================
   UPDATE CANDIDATE
========================================================= */

export const updateCandidate = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid candidate ID.",
      });
    }

    /* =====================================================
       FIND CANDIDATE
    ===================================================== */

    const candidate =
      await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found.",
      });
    }

    /* =====================================================
       FIND ELECTION
    ===================================================== */

    const election =
      await Election.findById(
        candidate.election
      );

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /* =====================================================
       CHECK ELECTION STATE
    ===================================================== */

    const electionState =
      getElectionState(election);

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed while voting is live.",
      });
    }

    if (
      electionState === "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed after the election is completed.",
      });
    }

    if (
      electionState === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate details cannot be changed for a cancelled election.",
      });
    }

    /* =====================================================
       UPDATE NAME
    ===================================================== */

    if (req.body.name !== undefined) {
      const newName =
        normalizeString(
          req.body.name
        );

      if (newName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate name must contain at least 2 characters.",
        });
      }

      if (newName.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate name cannot exceed 100 characters.",
        });
      }

      candidate.name = newName;
    }

    /* =====================================================
       UPDATE PARTY
       
       Optional for all election types.
    ===================================================== */

    if (req.body.party !== undefined) {
      const newParty =
        normalizeString(
          req.body.party
        );

      if (newParty.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate party cannot exceed 100 characters.",
        });
      }

      candidate.party = newParty;
    }

    /* =====================================================
       UPDATE SYMBOL
    ===================================================== */

    if (req.body.symbol !== undefined) {
      const newSymbol =
        normalizeString(
          req.body.symbol
        );

      if (newSymbol.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate symbol cannot exceed 100 characters.",
        });
      }

      candidate.symbol = newSymbol;
    }

    /* =====================================================
       UPDATE PHOTO
    ===================================================== */

    if (req.body.photo !== undefined) {
      candidate.photo =
        normalizeString(
          req.body.photo
        );
    }

    /* =====================================================
       UPDATE MANIFESTO
    ===================================================== */

    if (
      req.body.manifesto !== undefined
    ) {
      const newManifesto =
        normalizeString(
          req.body.manifesto
        );

      if (newManifesto.length > 5000) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate manifesto cannot exceed 5000 characters.",
        });
      }

      candidate.manifesto =
        newManifesto;
    }

    /* =====================================================
       UPDATE BIOGRAPHY
    ===================================================== */

    if (
      req.body.biography !== undefined
    ) {
      const newBiography =
        normalizeString(
          req.body.biography
        );

      if (newBiography.length > 5000) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate biography cannot exceed 5000 characters.",
        });
      }

      candidate.biography =
        newBiography;
    }

    /* =====================================================
       UPDATE EXPERIENCE
    ===================================================== */

    if (
      req.body.experience !== undefined
    ) {
      const newExperience =
        normalizeString(
          req.body.experience
        );

      if (newExperience.length > 3000) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate experience cannot exceed 3000 characters.",
        });
      }

      candidate.experience =
        newExperience;
    }

    /* =====================================================
       UPDATE POSITION
    ===================================================== */

    if (
      req.body.position !== undefined
    ) {
      const newPosition =
        normalizeString(
          req.body.position
        );

      if (newPosition.length > 150) {
        return res.status(400).json({
          success: false,
          message:
            "Candidate position cannot exceed 150 characters.",
        });
      }

      candidate.position =
        newPosition;
    }

    /* =====================================================
       UPDATE ACTIVE STATUS
    ===================================================== */

    if (
      req.body.isActive !== undefined
    ) {
      if (
        typeof req.body.isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean.",
        });
      }

      candidate.isActive =
        req.body.isActive;
    }

    /* =====================================================
       DUPLICATE NAME CHECK
    ===================================================== */

    const duplicateCandidate =
      await Candidate.findOne({
        _id: {
          $ne: candidate._id,
        },

        election: candidate.election,

        name: candidate.name,
      });

    if (duplicateCandidate) {
      return res.status(409).json({
        success: false,
        message:
          "Another candidate with this name already exists in this election.",
      });
    }

    /* =====================================================
       SAVE
    ===================================================== */

    await candidate.save();

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      message:
        "Candidate updated successfully.",
      candidate:
        getSafeCandidateData(
          candidate
        ),
    });
  } catch (error) {
    console.error(
      "UPDATE CANDIDATE ERROR:",
      error
    );

    /* =====================================================
       MONGO DUPLICATE KEY
    ===================================================== */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A candidate with this name already exists in this election.",
      });
    }

    /* =====================================================
       MONGOOSE VALIDATION
    ===================================================== */

    if (
      error.name === "ValidationError"
    ) {
      const messages =
        Object.values(error.errors).map(
          (err) => err.message
        );

      return res.status(400).json({
        success: false,
        message:
          "Candidate validation failed.",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update candidate.",
    });
  }
};

/* =========================================================
   DELETE CANDIDATE
========================================================= */

export const deleteCandidate = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid candidate ID.",
      });
    }

    /* =====================================================
       FIND CANDIDATE
    ===================================================== */

    const candidate =
      await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message:
          "Candidate not found.",
      });
    }

    /* =====================================================
       FIND ELECTION
    ===================================================== */

    const election =
      await Election.findById(
        candidate.election
      );

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    /* =====================================================
       CHECK ELECTION STATE
    ===================================================== */

    const electionState =
      getElectionState(election);

    if (electionState === "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted while the election is live.",
      });
    }

    if (
      electionState === "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted after the election is completed.",
      });
    }

    if (
      electionState === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate cannot be deleted from a cancelled election.",
      });
    }

    /* =====================================================
       CHECK EXISTING VOTES
       
       A candidate with votes must not be physically
       deleted.
    ===================================================== */

    const voteCount =
      await Vote.countDocuments({
        candidate: candidate._id,
        election: election._id,
      });

    if (voteCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This candidate cannot be deleted because votes already exist. Deactivate the candidate instead.",
        voteCount,
      });
    }

    /* =====================================================
       DELETE CANDIDATE
    ===================================================== */

    await Candidate.deleteOne({
      _id: candidate._id,
    });

    /* =====================================================
       REMOVE CANDIDATE REFERENCE FROM ELECTION
    ===================================================== */

    await Election.updateOne(
      {
        _id: election._id,
      },
      {
        $pull: {
          candidates: candidate._id,
        },
      }
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      message:
        "Candidate deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CANDIDATE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete candidate.",
    });
  }
};