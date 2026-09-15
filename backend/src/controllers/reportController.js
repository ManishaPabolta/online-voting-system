import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Report from "../models/Report.js";

// ======================================================
// GENERATE REPORT
// ======================================================

export const generateReport = async (
  req,
  res
) => {
  try {
    const {
      electionId,
    } = req.body;

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message:
          "Election ID is required.",
      });
    }

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

    const [
      totalVotes,
      totalCandidates,
    ] = await Promise.all([
      Vote.countDocuments({
        election: electionId,
      }),

      Candidate.countDocuments({
        election: electionId,
        isActive: true,
      }),
    ]);

    const totalEligibleVoters =
      election.totalEligibleVoters || 0;

    const voterTurnout =
      totalEligibleVoters > 0
        ? Number(
            (
              (totalVotes /
                totalEligibleVoters) *
              100
            ).toFixed(2)
          )
        : 0;

    const winner =
      await Candidate.findOne({
        election: electionId,
        isActive: true,
      }).sort({
        voteCount: -1,
      });

    const report =
      await Report.create({
        election: electionId,

        totalVotes,

        totalCandidates,

        totalEligibleVoters,

        voterTurnout,

        winner:
          winner?._id || null,

        generatedBy: req.user.id,

        status: "COMPLETED",

        generatedAt: new Date(),

        reportFormat: "JSON",

        metadata: {
          electionTitle:
            election.title,

          generatedAt:
            new Date(),
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Election report generated successfully.",
      report,
    });
  } catch (error) {
    console.error(
      "GENERATE REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate report.",
    });
  }
};