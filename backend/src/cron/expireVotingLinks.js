import cron from "node-cron";

import VotingLink from "../models/VotingLink.js";

// ======================================================
// EXPIRE VOTING LINKS
// ======================================================

const expireVotingLinksNow = async () => {
  try {
    const currentTime = new Date();

    console.log(
      `[CRON] Checking expired voting links at ${currentTime.toISOString()}`
    );

    const expiredLinks = await VotingLink.updateMany(
      {
        isActive: true,
        expiresAt: {
          $lte: currentTime,
        },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    console.log(
      `[CRON] ${expiredLinks.modifiedCount} voting link(s) expired.`
    );
  } catch (error) {
    console.error(
      "[CRON] Expire Voting Link Error:",
      error.message
    );
  }
};

// ======================================================
// START CRON JOB
// ======================================================

const expireVotingLinks = () => {
  console.log(
    "[CRON] Voting link expiry job started."
  );

  /*
   * Runs every 5 minutes.
   */
  cron.schedule("*/5 * * * *", async () => {
    await expireVotingLinksNow();
  });
};

export default expireVotingLinks;