import mongoose from "mongoose";

import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import VoterProfile from "../models/VoterProfile.js";

// ======================================================
// HELPERS
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getElectionState = (election) => {
  if (!election) return null;

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

  if (now >= election.endDate) {
    return "COMPLETED";
  }

  return election.status;
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (forwardedFor) {
    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0];
    }

    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "";
};

// ======================================================
// CAST VOTE
// ======================================================

export const castVote = async (req, res) => {
  try {
    const {
      electionId,
      candidateId,
    } = req.body;

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!electionId || !candidateId) {
      return res.status(400).json({
        success: false,
        message:
          "Election and candidate are required.",
      });
    }

    // ==================================================
    // OBJECT ID VALIDATION
    // ==================================================

    if (
      !isValidObjectId(electionId) ||
      !isValidObjectId(candidateId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election or candidate ID.",
      });
    }

    // ==================================================
    // AUTHENTICATED USER CHECK
    // ==================================================

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const voterId = req.user._id;

    // ==================================================
    // VOTING PASSWORD CHECK
    // ==================================================
    // mfaMiddleware verifies the separate voting
    // password before this controller runs.

    if (req.votingPasswordVerified !== true) {
      return res.status(403).json({
        success: false,
        message:
          "Voting password verification required.",
      });
    }

    // ==================================================
    // VOTER PROFILE CHECK
    // ==================================================

    const profile =
      await VoterProfile.findOne({
        user: voterId,
      });

    if (!profile) {
      return res.status(403).json({
        success: false,
        message:
          "Please complete your voter profile before voting.",
        profileRequired: true,
      });
    }

    if (profile.isComplete !== true) {
      return res.status(403).json({
        success: false,
        message:
          "Your voter profile is incomplete.",
        profileRequired: true,
      });
    }

    // ==================================================
    // ELIGIBILITY CHECK
    // ==================================================

    if (profile.isEligible !== true) {
      return res.status(403).json({
        success: false,
        message:
          "You are not eligible to vote.",
      });
    }

    // ==================================================
    // VERIFICATION STATUS
    // ==================================================

    if (
      profile.verificationStatus !==
      "VERIFIED"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your voter profile has not been verified yet.",
      });
    }

    // ==================================================
    // LOCATION CHECK
    // ==================================================
    // locationMiddleware already validates the values.

    if (
      !req.location ||
      !Number.isFinite(
        req.location.latitude
      ) ||
      !Number.isFinite(
        req.location.longitude
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid voting location is required.",
      });
    }

    // ==================================================
    // FIND ELECTION
    // ==================================================

    const election =
      await Election.findById(
        electionId
      );

    if (!election) {
      return res.status(404).json({
        success: false,
        message:
          "Election not found.",
      });
    }

    // ==================================================
    // ELECTION STATE
    // ==================================================

    const electionState =
      getElectionState(election);

    if (electionState === "DRAFT") {
      return res.status(400).json({
        success: false,
        message:
          "This election is not available for voting.",
      });
    }

    if (electionState === "UPCOMING") {
      return res.status(400).json({
        success: false,
        message:
          "Voting has not started yet.",
      });
    }

    if (electionState === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Voting for this election has ended.",
      });
    }

    if (electionState === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message:
          "This election has been cancelled.",
      });
    }

    if (electionState !== "LIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Voting is currently unavailable.",
      });
    }

    // ==================================================
    // EXTRA DATE CHECK
    // ==================================================

    const now = new Date();

    if (now < election.startDate) {
      return res.status(400).json({
        success: false,
        message:
          "Voting has not started yet.",
      });
    }

    if (now >= election.endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Voting for this election has ended.",
      });
    }

    // ==================================================
    // FIND CANDIDATE
    // ==================================================

    const candidate =
      await Candidate.findOne({
        _id: candidateId,
        election: electionId,
        isActive: true,
      });

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message:
          "Selected candidate does not belong to this election or is unavailable.",
      });
    }

    // ==================================================
    // CHECK EXISTING VOTE
    // ==================================================

    const existingVote =
      await Vote.findOne({
        voter: voterId,
        election: electionId,
      }).select("_id");

    if (existingVote) {
      return res.status(409).json({
        success: false,
        message:
          "You have already voted in this election.",
        alreadyVoted: true,
      });
    }

    // ==================================================
    // CREATE VOTE
    // ==================================================

    const vote =
      await Vote.create({
        voter: voterId,

        election: electionId,

        candidate: candidateId,

        castAt: new Date(),

        latitude:
          req.location.latitude,

        longitude:
          req.location.longitude,

        ipAddress:
          getClientIp(req),

        deviceInfo:
          req.headers["user-agent"] ||
          "",
      });

    // ==================================================
    // IMPORTANT
    // ==================================================
    // We intentionally DO NOT update:
    //
    // Candidate.voteCount
    // Election.totalVotes
    //
    // Vote collection is the source of truth.
    //
    // This prevents counters from becoming inconsistent
    // with the actual votes.

    return res.status(201).json({
      success: true,
      message:
        "Your vote has been recorded successfully.",

      vote: {
        id: vote._id,
        election: electionId,
        candidate: candidateId,
        castAt: vote.castAt,
      },
    });
  } catch (error) {
    console.error(
      "CAST VOTE ERROR:",
      error
    );

    // ==================================================
    // DUPLICATE VOTE
    // ==================================================
    // Protected by unique index:
    // { voter: 1, election: 1 }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already voted in this election.",
        alreadyVoted: true,
      });
    }

    // ==================================================
    // MONGOOSE VALIDATION ERROR
    // ==================================================

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid vote information.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to cast your vote. Please try again.",
    });
  }
};

// ======================================================
// GET VOTE STATUS / VOTING HISTORY
// ======================================================

export const getVoteStatus = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const votes =
      await Vote.find({
        voter: req.user._id,
      })
        .populate(
          "election",
          "title electionType status startDate endDate"
        )
        .populate(
          "candidate",
          "name party photo symbol"
        )
        .sort({
          castAt: -1,
        });

    return res.status(200).json({
      success: true,

      totalVotes:
        votes.length,

      votes: votes.map(
        (vote) => ({
          id: vote._id,

          election:
            vote.election,

          candidate:
            vote.candidate,

          castAt:
            vote.castAt ||
            vote.createdAt,
        })
      ),
    });
  } catch (error) {
    console.error(
      "GET VOTE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch voting history.",
    });
  }
};

// ======================================================
// CHECK SPECIFIC ELECTION VOTE STATUS
// ======================================================

export const checkVoteStatus = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const {
      electionId,
    } = req.params;

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message:
          "Election ID is required.",
      });
    }

    if (!isValidObjectId(electionId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election ID.",
      });
    }

    const vote =
      await Vote.findOne({
        voter: req.user._id,
        election: electionId,
      }).select(
        "_id castAt createdAt"
      );

    return res.status(200).json({
      success: true,

      hasVoted:
        Boolean(vote),

      votedAt:
        vote?.castAt ||
        vote?.createdAt ||
        null,
    });
  } catch (error) {
    console.error(
      "CHECK VOTE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check vote status.",
    });
  }
};

// ======================================================
// ELECTION RESULTS
// ======================================================

export const getElectionResults =
  async (req, res) => {
    try {
      const {
        id: electionId,
      } = req.params;

      // ==================================================
      // VALIDATE ELECTION ID
      // ==================================================

      if (!isValidObjectId(electionId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid election ID.",
        });
      }

      // ==================================================
      // FIND ELECTION
      // ==================================================

      const election =
        await Election.findById(
          electionId
        );

      if (!election) {
        return res.status(404).json({
          success: false,
          message:
            "Election not found.",
        });
      }

      // ==================================================
      // CHECK RESULTS AVAILABILITY
      // ==================================================

      const electionState =
        getElectionState(election);

      const isCompleted =
        electionState ===
        "COMPLETED";

      const resultsPublished =
        election.isResultsPublished ===
        true;

      const resultsAllowedEarly =
        election.allowResultsBeforeEnd ===
        true;

      if (
        !isCompleted &&
        !resultsPublished &&
        !resultsAllowedEarly
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Election results are not available yet.",
        });
      }

      // ==================================================
      // GET CANDIDATES
      // ==================================================

      const candidates =
        await Candidate.find({
          election: electionId,
          isActive: true,
        }).select(
          "name party photo symbol"
        );

      // ==================================================
      // COUNT VOTES
      // ==================================================

      const voteCounts =
        await Vote.aggregate([
          {
            $match: {
              election:
                new mongoose.Types.ObjectId(
                  electionId
                ),
            },
          },

          {
            $group: {
              _id: "$candidate",

              votes: {
                $sum: 1,
              },
            },
          },
        ]);

      // ==================================================
      // CREATE VOTE COUNT MAP
      // ==================================================

      const voteCountMap =
        new Map();

      voteCounts.forEach(
        (item) => {
          voteCountMap.set(
            item._id.toString(),
            item.votes
          );
        }
      );

      // ==================================================
      // BUILD RESULTS
      // ==================================================

      const results =
        candidates.map(
          (candidate) => {
            const votes =
              voteCountMap.get(
                candidate._id.toString()
              ) || 0;

            return {
              candidate: {
                id:
                  candidate._id,

                name:
                  candidate.name,

                party:
                  candidate.party,

                photo:
                  candidate.photo,

                symbol:
                  candidate.symbol,
              },

              votes,

              percentage: 0,
            };
          }
        );

      // ==================================================
      // TOTAL VOTES
      // ==================================================

      const totalVotes =
        results.reduce(
          (total, result) =>
            total + result.votes,
          0
        );

      // ==================================================
      // PERCENTAGES
      // ==================================================

      results.forEach(
        (result) => {
          result.percentage =
            totalVotes > 0
              ? Number(
                  (
                    (result.votes /
                      totalVotes) *
                    100
                  ).toFixed(2)
                )
              : 0;
        }
      );

      // ==================================================
      // SORT
      // ==================================================

      results.sort(
        (a, b) =>
          b.votes - a.votes
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({
        success: true,

        election: {
          id:
            election._id,

          title:
            election.title,

          status:
            electionState,
        },

        totalVotes,

        totalCandidates:
          candidates.length,

        results,
      });
    } catch (error) {
      console.error(
        "GET ELECTION RESULTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch election results.",
      });
    }
  };