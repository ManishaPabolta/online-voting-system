import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import VoterProfile from "../models/VoterProfile.js";

export const getDashboardStats =
  async (req, res) => {

    try {

      const activeElections =
        await Election.countDocuments({
          status: "ACTIVE",
        });

      const totalVotes =
        await Vote.countDocuments();

      const notifications =
        await Notification.countDocuments({
          user: req.user.id,
          isRead: false,
        });

      const profile =
        await VoterProfile.findOne({
          user: req.user.id,
        });

      return res.status(200).json({
        success: true,

        stats: {
          activeElections,
          totalVotes,
          notifications,
          verified:
            profile ? "YES" : "NO",
        },
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };