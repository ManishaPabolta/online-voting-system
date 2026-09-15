import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import VoterProfile from "../models/VoterProfile.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";

// ======================================================
// VOTER DASHBOARD
// ======================================================

export const getDashboardStats = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const [
      liveElections,
      upcomingElections,
      completedElections,
      totalVotes,
      unreadNotifications,
      profile,
    ] = await Promise.all([
      Election.countDocuments({
        isPublished: true,
        status: "LIVE",
      }),

      Election.countDocuments({
        isPublished: true,
        status: "UPCOMING",
      }),

      Election.countDocuments({
        isPublished: true,
        status: "COMPLETED",
      }),

      Vote.countDocuments({
        voter: userId,
      }),

      Notification.countDocuments({
        user: userId,
        isRead: false,
      }),

      VoterProfile.findOne({
        user: userId,
      }),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        liveElections,
        upcomingElections,
        completedElections,
        totalVotes,
        unreadNotifications,

        profileCompleted:
          profile?.isComplete || false,

        verificationStatus:
          profile?.verificationStatus ||
          "PENDING",

        eligible:
          profile?.isEligible || false,
      },
    });
  } catch (error) {
    console.error(
      "GET DASHBOARD STATS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard statistics.",
    });
  }
};

// ======================================================
// ADMIN DASHBOARD
// ======================================================

export const getAdminDashboardStats = async (
  req,
  res
) => {
  try {
    const [
      totalUsers,
      totalCandidates,
      totalElections,
      liveElections,
      upcomingElections,
      completedElections,
      totalVotes,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
        isActive: true,
      }),

      Candidate.countDocuments({
        isActive: true,
      }),

      Election.countDocuments(),

      Election.countDocuments({
        status: "LIVE",
      }),

      Election.countDocuments({
        status: "UPCOMING",
      }),

      Election.countDocuments({
        status: "COMPLETED",
      }),

      Vote.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalCandidates,
        totalElections,
        liveElections,
        upcomingElections,
        completedElections,
        totalVotes,
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard.",
    });
  }
};