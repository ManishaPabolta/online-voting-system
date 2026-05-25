import VoterProfile from "../models/VoterProfile.js";

const checkProfileComplete = async (req, res, next) => {
  try {
    const profile = await VoterProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile before voting",
      });
    }

    if (!profile.voterId || !profile.address || !profile.age) {
      return res.status(403).json({
        success: false,
        message: "Profile incomplete",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default checkProfileComplete;