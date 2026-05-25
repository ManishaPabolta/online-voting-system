import cron from "node-cron";
import VotingLink from "../models/VotingLink.js";

const expireVotingLinks = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Checking expired voting links...");

      const currentTime = new Date();

      const expiredLinks = await VotingLink.updateMany(
        {
          expiresAt: { $lt: currentTime },
          isActive: true,
        },
        {
          $set: {
            isActive: false,
          },
        }
      );

      console.log(
        `${expiredLinks.modifiedCount} voting links expired`
      );

    } catch (error) {
      console.log(
        "Expire Voting Link Error:",
        error.message
      );
    }
  });
};

export default expireVotingLinks;