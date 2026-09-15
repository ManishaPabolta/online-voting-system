import mongoose from "mongoose";

import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";

// ======================================================
// GENERATE ELECTION REPORT
// ======================================================

export const generateElectionReport =
  async (electionId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        electionId
      )
    ) {
      throw new Error("Invalid election ID.");
    }

    const electionObjectId =
      new mongoose.Types.ObjectId(
        electionId
      );

    // --------------------------------------------------
    // Total votes
    // --------------------------------------------------

    const totalVotes =
      await Vote.countDocuments({
        election: electionObjectId,
      });

    // --------------------------------------------------
    // Total candidates
    // --------------------------------------------------

    const totalCandidates =
      await Candidate.countDocuments({
        election: electionObjectId,
      });

    // --------------------------------------------------
    // Candidate-wise results
    // --------------------------------------------------

    const candidateResults =
      await Vote.aggregate([
        {
          $match: {
            election: electionObjectId,
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

        {
          $sort: {
            votes: -1,
          },
        },

        {
          $lookup: {
            from: "candidates",
            localField: "_id",
            foreignField: "_id",
            as: "candidate",
          },
        },

        {
          $unwind: {
            path: "$candidate",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            candidateId: "$_id",
            name: "$candidate.name",
            party: "$candidate.party",
            symbol: "$candidate.symbol",
            photo: "$candidate.photo",
            votes: 1,

            percentage: {
              $cond: [
                {
                  $gt: [totalVotes, 0],
                },
                {
                  $multiply: [
                    {
                      $divide: [
                        "$votes",
                        totalVotes,
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },
      ]);

    return {
      electionId,
      totalVotes,
      totalCandidates,
      candidateResults,
      generatedAt: new Date(),
    };
  };