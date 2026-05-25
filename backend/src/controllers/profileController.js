import VoterProfile from "../models/VoterProfile.js";

export const createProfile = async (req, res) => {
  try {
    const { age, address, voterId, aadhaarNumber } = req.body;

    const profile = await VoterProfile.create({
      user: req.user.id,
      age,
      address,
      voterId,
      aadhaarNumber,
      idProof: req.file?.path || "",
    });

    res.status(201).json({
      success: true,
      profile,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await VoterProfile.findOne({
      user: req.user.id,
    }).populate("user");

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};