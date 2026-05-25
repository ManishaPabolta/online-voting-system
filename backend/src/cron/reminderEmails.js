import cron from "node-cron";

import VotingLink from "../models/VotingLink.js";

import User from "../models/User.js";

import transporter from "../config/mail.js";

const reminderEmails = () => {
  cron.schedule("*/2 * * * *", async () => {
    try {
      console.log("Sending reminder emails...");

      const currentTime = new Date();

      const links = await VotingLink.find({
        isActive: true,
        expiresAt: {
          $gt: currentTime,
        },
      }).populate("user");

      for (const link of links) {
        const remainingTime =
          (new Date(link.expiresAt) - currentTime) / 1000;

        if (remainingTime <= 60) {
          const user = await User.findById(link.user._id);

          if (user) {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: "Voting Link Expiry Reminder",
              html: `
                <h2>Your voting link will expire soon</h2>

                <p>Please cast your vote immediately.</p>

                <p>Remaining Time: ${Math.floor(
                  remainingTime
                )} seconds</p>
              `,
            });

            console.log(
              `Reminder email sent to ${user.email}`
            );
          }
        }
      }
    } catch (error) {
      console.log("Reminder Email Error:", error.message);
    }
  });
};

export default reminderEmails;