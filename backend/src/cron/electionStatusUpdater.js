import cron from "node-cron";
import Election from "../models/Election.js";

const electionStatusUpdater = () => {

  cron.schedule("*/5 * * * *", async () => {

    try {

      console.log("Updating election statuses...");

      const currentDate = new Date();

      // ACTIVE
      await Election.updateMany(
        {
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
        },
        {
          $set: { status: "active" },
        }
      );

      // COMPLETED
      await Election.updateMany(
        {
          endDate: { $lt: currentDate },
        },
        {
          $set: { status: "completed" },
        }
      );

      // UPCOMING
      await Election.updateMany(
        {
          startDate: { $gt: currentDate },
        },
        {
          $set: { status: "upcoming" },
        }
      );

      console.log("Election statuses updated");

    } catch (error) {

      console.log(
        "Election Status Updater Error:",
        error.message
      );
    }
  });
};

export default electionStatusUpdater;