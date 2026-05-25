import cron from "node-cron";

import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

const electionJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const elections = await Election.find({
        status: "ACTIVE",
      });

      for (const election of elections) {
        if (new Date(election.endDate) < now) {

          election.status = "COMPLETED";

          // ================= FIND WINNER =================

          const votes = await Vote.aggregate([
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

          if (votes.length > 0) {
            election.winner = votes[0]._id;
          }

          await election.save();

          // ================= NOTIFICATIONS =================

          const users = await User.find();

          for (const user of users) {
            await Notification.create({
              user: user._id,

              title: "Election Completed",

              message: `${election.title} election has ended.`,

              type: "ELECTION_EXPIRED",
            });
          }
        }
      }

      console.log(
        "Election statuses updated"
      );

    } catch (error) {
      console.log(error);
    }
  });
};

export default electionJob;