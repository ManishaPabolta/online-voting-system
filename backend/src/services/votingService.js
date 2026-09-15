import mongoose from "mongoose";

import Vote from "../models/Vote.js";

// ======================================================
// CREATE VOTE
// ======================================================

export const createVote = async ({
  voter,
  election,
  candidate,
  latitude = null,
  longitude = null,
  ipAddress = "",
  deviceInfo = "",
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(voter)
  ) {
    throw new Error("Invalid voter ID.");
  }

  if (
    !mongoose.Types.ObjectId.isValid(election)
  ) {
    throw new Error("Invalid election ID.");
  }

  if (
    !mongoose.Types.ObjectId.isValid(candidate)
  ) {
    throw new Error("Invalid candidate ID.");
  }

  // --------------------------------------------------
  // Fast pre-check
  // --------------------------------------------------

  const existingVote =
    await Vote.findOne({
      voter,
      election,
    }).lean();

  if (existingVote) {
    const error = new Error(
      "You have already voted in this election."
    );

    error.code = "ALREADY_VOTED";

    throw error;
  }

  try {
    // ------------------------------------------------
    // Database unique index is the final protection
    // ------------------------------------------------

    const vote = await Vote.create({
      voter,
      election,
      candidate,
      latitude,
      longitude,
      ipAddress: String(
        ipAddress || ""
      ).trim(),
      deviceInfo: String(
        deviceInfo || ""
      ).trim(),
      castAt: new Date(),
    });

    return vote;
  } catch (error) {
    // ----------------------------------------------
    // Unique compound index:
    // { voter: 1, election: 1 }
    // ----------------------------------------------

    if (
      error.code === 11000
    ) {
      const duplicateError =
        new Error(
          "You have already voted in this election."
        );

      duplicateError.code =
        "ALREADY_VOTED";

      throw duplicateError;
    }

    throw error;
  }
};

// ======================================================
// GET VOTES BY ELECTION
// ======================================================

export const getVotesByElection =
  async (electionId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        electionId
      )
    ) {
      throw new Error("Invalid election ID.");
    }

    return Vote.find({
      election: electionId,
    })
      .populate(
        "candidate",
        "name party symbol photo"
      )
      .populate(
        "voter",
        "name email voterId"
      )
      .sort({
        castAt: -1,
      })
      .lean();
  };

// ======================================================
// CHECK WHETHER USER HAS VOTED
// ======================================================

export const hasUserVoted = async (
  voter,
  election
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      voter
    )
  ) {
    throw new Error("Invalid voter ID.");
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      election
    )
  ) {
    throw new Error("Invalid election ID.");
  }

  const vote = await Vote.findOne({
    voter,
    election,
  })
    .select("castAt")
    .lean();

  return {
    hasVoted: Boolean(vote),
    votedAt: vote?.castAt || null,
  };
};

// ======================================================
// COUNT ELECTION VOTES
// ======================================================

export const countElectionVotes =
  async (electionId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        electionId
      )
    ) {
      throw new Error("Invalid election ID.");
    }

    return Vote.countDocuments({
      election: electionId,
    });
  };

// ======================================================
// GET CANDIDATE VOTE COUNT
// ======================================================

export const countCandidateVotes =
  async (
    electionId,
    candidateId
  ) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        electionId
      )
    ) {
      throw new Error("Invalid election ID.");
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        candidateId
      )
    ) {
      throw new Error("Invalid candidate ID.");
    }

    return Vote.countDocuments({
      election: electionId,
      candidate: candidateId,
    });
  };