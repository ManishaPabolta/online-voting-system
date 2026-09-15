import cron from "node-cron";

import VotingLink from "../models/VotingLink.js";
import transporter from "../config/mail.js";

// ======================================================
// REMINDER WINDOW
// ======================================================

const REMINDER_WINDOW_SECONDS = 60;

// ======================================================
// SEND REMINDER EMAIL
// ======================================================

const sendReminderEmail = async (link) => {
  try {
    if (!link.user || !link.user.email) {
      return;
    }

    const currentTime = new Date();

    const expiresAt = new Date(link.expiresAt);

    const remainingSeconds =
      Math.floor(
        (expiresAt.getTime() - currentTime.getTime()) /
          1000
      );

    // Link already expired
    if (remainingSeconds <= 0) {
      return;
    }

    // Reminder only inside configured window
    if (
      remainingSeconds >
      REMINDER_WINDOW_SECONDS
    ) {
      return;
    }

    const user = link.user;

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER,

      to: user.email,

      subject:
        "⏰ Your Voting Link Will Expire Soon",

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />

            <title>
              Voting Link Expiry Reminder
            </title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f4f7f6;
              font-family: Arial, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              "
            >

              <h2
                style="
                  margin-top: 0;
                  color: #1f2937;
                "
              >
                Your Voting Link Will Expire Soon
              </h2>

              <p
                style="
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Hello ${user.name || "Voter"},
              </p>

              <p
                style="
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Your voting link is about to expire.
                Please complete your voting process
                before the link becomes inactive.
              </p>

              <div
                style="
                  margin: 25px 0;
                  padding: 18px;
                  background: #f3f4f6;
                  border-radius: 8px;
                  text-align: center;
                "
              >

                <div
                  style="
                    color: #6b7280;
                    font-size: 13px;
                    margin-bottom: 8px;
                  "
                >
                  Time Remaining
                </div>

                <strong
                  style="
                    font-size: 28px;
                    color: #dc2626;
                  "
                >
                  ${remainingSeconds} seconds
                </strong>

              </div>

              <p
                style="
                  color: #6b7280;
                  font-size: 13px;
                  line-height: 1.5;
                "
              >
                If you have already voted, you can
                safely ignore this message.
              </p>

              <hr
                style="
                  border: none;
                  border-top: 1px solid #e5e7eb;
                  margin: 25px 0;
                "
              />

              <p
                style="
                  color: #9ca3af;
                  font-size: 12px;
                  margin-bottom: 0;
                "
              >
                This is an automated message from
                the Online Voting System.
              </p>

            </div>

          </body>
        </html>
      `,
    });

    console.log(
      `[CRON] Reminder email sent to ${user.email}`
    );
  } catch (error) {
    console.error(
      `[CRON] Failed to send reminder for voting link ${link._id}:`,
      error.message
    );
  }
};

// ======================================================
// PROCESS REMINDERS
// ======================================================

const processReminderEmails = async () => {
  try {
    const currentTime = new Date();

    console.log(
      `[CRON] Checking voting reminders at ${currentTime.toISOString()}`
    );

    const links = await VotingLink.find({
      isActive: true,
      expiresAt: {
        $gt: currentTime,
        $lte: new Date(
          currentTime.getTime() +
            REMINDER_WINDOW_SECONDS * 1000
        ),
      },
    }).populate(
      "user",
      "name email"
    );

    if (!links.length) {
      console.log(
        "[CRON] No voting links require a reminder."
      );

      return;
    }

    for (const link of links) {
      await sendReminderEmail(link);
    }

    console.log(
      `[CRON] Processed ${links.length} voting reminder(s).`
    );
  } catch (error) {
    console.error(
      "[CRON] Reminder Email Error:",
      error.message
    );
  }
};

// ======================================================
// START CRON JOB
// ======================================================

const reminderEmails = () => {
  console.log(
    "[CRON] Voting reminder email job started."
  );

  /*
   * Runs every minute so that the 60-second
   * reminder window is not easily missed.
   */
  cron.schedule("* * * * *", async () => {
    await processReminderEmails();
  });
};

export default reminderEmails;