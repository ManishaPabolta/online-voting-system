import Vote from "../models/Vote.js";

export const createVote =
  async ({
    voter,
    election,
    candidate,
    latitude,
    longitude,
    ipAddress,
    deviceInfo,
  }) => {
    const existingVote =
      await Vote.findOne({
        voter,
        election,
      });

    if (existingVote) {
      throw new Error(
        "Already voted"
      );
    }

    const vote =
      await Vote.create({
        voter,
        election,
        candidate,
        latitude,
        longitude,
        ipAddress,
        deviceInfo,
      });

    return vote;
  };

export const getVotesByElection =
  async (electionId) => {
    return await Vote.find({
      election: electionId,
    })
      .populate("candidate")
      .populate("voter");
  };