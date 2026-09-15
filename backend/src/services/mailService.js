import transporter from "../config/mail.js";

// ======================================================
// SEND EMAIL
// ======================================================

export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  if (!to) {
    throw new Error("Recipient email is required.");
  }

  if (!subject) {
    throw new Error("Email subject is required.");
  }

  if (!html && !text) {
    throw new Error(
      "Email must contain HTML or text content."
    );
  }

  const info = await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER,

    to: String(to).trim(),

    subject: String(subject).trim(),

    html: html || undefined,

    text: text || undefined,
  });

  return info;
};

// ======================================================
// SEND OTP EMAIL
// ======================================================

export const sendOTPEmail = async ({
  to,
  name = "User",
  otp,
}) => {
  if (!otp) {
    throw new Error("OTP is required.");
  }

  return sendEmail({
    to,
    subject: "Online Voting System - Verification OTP",

    text: `Hello ${name}, your verification OTP is ${otp}. This OTP will expire soon.`,

    html: `
      <div
        style="
          max-width:600px;
          margin:30px auto;
          padding:30px;
          font-family:Arial,sans-serif;
          background:#ffffff;
          border-radius:12px;
        "
      >
        <h2>Account Verification</h2>

        <p>Hello ${name},</p>

        <p>
          Your verification OTP is:
        </p>

        <div
          style="
            margin:20px 0;
            padding:15px;
            text-align:center;
            font-size:30px;
            font-weight:bold;
            letter-spacing:8px;
            background:#f3f4f6;
            border-radius:8px;
          "
        >
          ${otp}
        </div>

        <p>
          Please do not share this OTP with anyone.
        </p>

        <p style="color:#777;font-size:13px;">
          This is an automated message from the
          Online Voting System.
        </p>
      </div>
    `,
  });
};

// ======================================================
// SEND GENERIC SECURITY EMAIL
// ======================================================

export const sendSecurityEmail = async ({
  to,
  name = "User",
  subject,
  message,
}) => {
  return sendEmail({
    to,
    subject,

    text: `Hello ${name},\n\n${message}`,

    html: `
      <div
        style="
          max-width:600px;
          margin:30px auto;
          padding:30px;
          font-family:Arial,sans-serif;
        "
      >
        <h2>${subject}</h2>

        <p>Hello ${name},</p>

        <p>${message}</p>

        <p
          style="
            color:#777;
            font-size:13px;
          "
        >
          This is an automated security message.
        </p>
      </div>
    `,
  });
};