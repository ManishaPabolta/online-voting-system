import cron from "node-cron";

import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const electionJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // ============================================
      // 1. MARK UPCOMING ELECTIONS
      // ============================================

      await Election.updateMany(
        {
          isPublished: true,
          status: {
            $nin: ["CANCELLED", "LIVE", "COMPLETED"],
          },
          startDate: {
            $gt: now,
          },
          endDate: {
            $gt: now,
          },
        },
        {
          $set: {
            status: "UPCOMING",
          },
        }
      );

      // ============================================
      // 2. MARK LIVE ELECTIONS
      // ============================================

      await Election.updateMany(
        {
          isPublished: true,
          status: {
            $nin: ["CANCELLED", "COMPLETED"],
          },
          startDate: {
            $lte: now,
          },
          endDate: {
            $gt: now,
          },
        },
        {
          $set: {
            status: "LIVE",
          },
        }
      );

      // ============================================
      // 3. FIND ELECTIONS THAT HAVE JUST ENDED
      // ============================================

      const completedElections = await Election.find({
        isPublished: true,
        status: "LIVE",
        endDate: {
          $lte: now,
        },
      });

      if (completedElections.length === 0) {
        console.log("Election statuses checked successfully.");
        return;
      }

      // ============================================
      // 4. GET VERIFIED USERS ONCE
      // ============================================

      const users = await User.find({
        role: "user",
        isActive: true,
        isBlocked: false,
        isVerified: true,
      })
        .select("_id")
        .lean();

      // ============================================
      // 5. COMPLETE EACH ELECTION
      // ============================================

      for (const election of completedElections) {
        // --------------------------------------------
        // Find vote totals
        // --------------------------------------------

        const voteResults = await Vote.aggregate([
          {
            $match: {
              election: election._id,
            },
          },
          {
            $group: {
              _id: "$candidate",
              totalVotes: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              totalVotes: -1,
            },
          },
        ]);

        const totalVotes = voteResults.reduce(
          (total, candidate) => total + candidate.totalVotes,
          0
        );

        // --------------------------------------------
        // Update election
        // --------------------------------------------

        election.status = "COMPLETED";
        election.totalVotes = totalVotes;

        await election.save();

        // ============================================
        // 6. CREATE COMPLETION NOTIFICATIONS
        // ============================================

        if (users.length > 0) {
          const notifications = users.map((user) => ({
            user: user._id,
            title: "Election Completed",
            message: `${election.title} election has ended.`,
            type: "ELECTION_EXPIRED",
            relatedElection: election._id,
            priority: "NORMAL",
            actionUrl: `/elections/${election._id}`,
          }));

          await Notification.insertMany(notifications);
        }

        console.log(
          `Election completed: ${election.title} | Total votes: ${totalVotes}`
        );
      }

      console.log("Election statuses updated successfully.");
    } catch (error) {
      console.error("Election Job Error:", error);
    }
  });
};

export default electionJob;