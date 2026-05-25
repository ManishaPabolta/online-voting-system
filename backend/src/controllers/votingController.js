import Vote from "../models/Vote.js";
import Election from "../models/Election.js";

// ================= CAST VOTE =================
export const castVote = async (req, res) => {
  try {
    const {
      electionId,
      candidateId,
      latitude,
      longitude,
    } = req.body;

    // check election exists
    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // already voted check
    const alreadyVoted = await Vote.findOne({
      voter: req.user.id,
      election: electionId,
    });

    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        message: "You already voted in this election",
      });
    }

    // create vote
    const vote = await Vote.create({
      voter: req.user.id,
      election: electionId,
      candidate: candidateId,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: "Vote cast successfully",
      vote,
    });

  } catch (error) {
    console.error("CAST_VOTE_ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET VOTE STATUS =================
export const getVoteStatus = async (req, res) => {
  try {
    const votes = await Vote.find({
      voter: req.user.id,
    });

    res.status(200).json({
      success: true,
      votes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};