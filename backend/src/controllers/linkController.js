import crypto from "crypto";

import VotingLink from "../models/VotingLink.js";
import Election from "../models/Election.js";

// ======================================================
// GENERATE VOTING LINK
// ======================================================

export const generateVotingLink =
  async (req, res) => {
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

      if (election.status !== "LIVE") {
        return res.status(400).json({
          success: false,
          message:
            "Voting link can only be generated for a live election.",
        });
      }

      // Disable old active links.
      await VotingLink.updateMany(
        {
          user: req.user.id,
          election: electionId,
          isActive: true,
          isUsed: false,
        },
        {
          $set: {
            isActive: false,
          },
        }
      );

      const rawToken =
        crypto.randomBytes(32);

      const token =
        rawToken.toString("hex");

      const expiresAt =
        new Date(
          Date.now() +
            10 * 60 * 1000
        );

      /*
       * Store hash rather than raw token.
       */
      const hashedToken =
        crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

      const link =
        await VotingLink.create({
          user: req.user.id,

          election: electionId,

          token: hashedToken,

          expiresAt,

          isActive: true,

          isUsed: false,

          ipAddress:
            req.ip || "",

          userAgent:
            req.headers[
              "user-agent"
            ] || "",
        });

      return res.status(201).json({
        success: true,

        message:
          "Voting link generated successfully.",

        link: {
          id: link._id,

          token,

          election:
            election._id,

          expiresAt,
        },
      });
    } catch (error) {
      console.error(
        "GENERATE VOTING LINK ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to generate voting link.",
      });
    }
  };