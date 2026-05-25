import cron from "node-cron";
import Election from "../models/Election.js";

const electionStatusUpdater = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      // ACTIVE
      await Election.updateMany(
        {
          startDate: { $lte: now },
          endDate: { $gte: now },
        },
        { status: "active" }
      );

      // COMPLETED
      await Election.updateMany(
        { endDate: { $lt: now } },
        { status: "completed" }
      );

      // UPCOMING
      await Election.updateMany(
        { startDate: { $gt: now } },
        { status: "upcoming" }
      );

      console.log("Election statuses updated");
    } catch (error) {
      console.log("Cron Error:", error.message);
    }
  });
};

export default electionStatusUpdater;