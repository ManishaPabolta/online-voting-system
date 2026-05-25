import crypto from "crypto";

import VotingLink from "../models/VotingLink.js";

export const generateVotingLink = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const link = await VotingLink.create({
      user: req.user.id,
      token,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      link,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};