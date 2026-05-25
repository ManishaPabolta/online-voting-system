import Vote from "../models/Vote.js";

import Candidate from "../models/Candidate.js";

export const generateElectionReport =
  async (electionId) => {
    const totalVotes =
      await Vote.countDocuments({
        election: electionId,
      });

    const totalCandidates =
      await Candidate.countDocuments({
        election: electionId,
      });

    return {
      totalVotes,
      totalCandidates,
    };
  };