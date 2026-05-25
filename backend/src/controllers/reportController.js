import Vote from "../models/Vote.js";

export const generateReport = async (req, res) => {
  try {
    const totalVotes = await Vote.countDocuments();

    res.status(200).json({
      success: true,
      totalVotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};