import cron from "node-cron";

import Election from "../models/Election.js";

// ======================================================
// ELECTION STATUS UPDATER
// ======================================================

const updateElectionStatuses = async () => {
  try {
    const now = new Date();

    console.log(
      `[CRON] Updating election statuses at ${now.toISOString()}`
    );

    // --------------------------------------------------
    // UPCOMING
    // Published elections whose start time is in future
    // --------------------------------------------------

    const upcomingResult = await Election.updateMany(
      {
        isPublished: true,
        status: {
          $nin: ["CANCELLED", "COMPLETED"],
        },
        startDate: {
          $gt: now,
        },
      },
      {
        $set: {
          status: "UPCOMING",
        },
      }
    );

    // --------------------------------------------------
    // LIVE
    // Published elections currently running
    // --------------------------------------------------

    const liveResult = await Election.updateMany(
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

    // --------------------------------------------------
    // COMPLETED
    // Elections whose end time has passed
    // --------------------------------------------------

    const completedResult = await Election.updateMany(
      {
        isPublished: true,
        status: {
          $ne: "CANCELLED",
        },
        endDate: {
          $lte: now,
        },
      },
      {
        $set: {
          status: "COMPLETED",
        },
      }
    );

    console.log(
      `[CRON] Upcoming: ${upcomingResult.modifiedCount}`
    );

    console.log(
      `[CRON] Live: ${liveResult.modifiedCount}`
    );

    console.log(
      `[CRON] Completed: ${completedResult.modifiedCount}`
    );

    console.log("[CRON] Election status update completed.");
  } catch (error) {
    console.error(
      "[CRON] Election Status Updater Error:",
      error.message
    );
  }
};

// ======================================================
// START CRON JOB
// ======================================================

const electionStatusUpdater = () => {
  console.log(
    "[CRON] Election status updater started."
  );

  /*
   * Runs every 5 minutes.
   *
   * */ 
  cron.schedule("*/5 * * * *", async () => {
    await updateElectionStatuses();
  });
};

export default electionStatusUpdater;