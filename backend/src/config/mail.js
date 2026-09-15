import nodemailer from "nodemailer";

// ======================================================
// MAIL TRANSPORTER
// ======================================================

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn(
    "⚠️ EMAIL_USER or EMAIL_PASS is missing from environment variables."
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: emailUser,
    pass: emailPass,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  tls: {
    minVersion: "TLSv1.2",
  },
});

// ======================================================
// VERIFY MAIL CONFIGURATION
// ======================================================

export const verifyMailTransporter = async () => {
  try {
    await transporter.verify();

    console.log("Mail transporter is ready.");
    return true;
  } catch (error) {
    console.error(
      "Mail transporter verification failed:",
      error.message
    );

    return false;
  }
};

export default transporter;