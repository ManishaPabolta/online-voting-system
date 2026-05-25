import Vote from "../models/Vote.js";

const voteSecurityMiddleware = async (req, res, next) => {
  try {
    const { electionId } = req.body;

    if (!electionId) {
      return res.status(400).json({
        message: "ElectionId required",
      });
    }

    const existingVote = await Vote.findOne({
      voter: req.user.id,
      election: electionId,
    });

    if (existingVote) {
      return res.status(400).json({
        message: "Already voted in this election",
      });
    }

    next();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default voteSecurityMiddleware;