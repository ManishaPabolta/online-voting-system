import Candidate from "../models/Candidate.js";

export const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);

    res.status(201).json({
      success: true,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("election");

    res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};