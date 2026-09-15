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
    throw new Error(
      "Recipient email is required."
    );
  }

  if (!subject) {
    throw new Error(
      "Email subject is required."
    );
  }

  if (!html && !text) {
    throw new Error(
      "Email must contain HTML or text content."
    );
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,

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
    throw new Error(
      "OTP is required."
    );
  }

  return sendEmail({
    to,

    subject:
      "Online Voting System - Verification OTP",

    text: `
Hello ${name},

Your verification OTP is ${otp}.

This OTP will expire soon.

Please do not share this OTP with anyone.

Online Voting System
`.trim(),

    html: `
      <!DOCTYPE html>

      <html>

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          Account Verification
        </title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f7f5;
          font-family:Arial,Helvetica,sans-serif;
          color:#1f2937;
        "
      >

        <div
          style="
            max-width:600px;
            margin:30px auto;
            padding:20px;
          "
        >

          <div
            style="
              background:#ffffff;
              border-radius:16px;
              padding:30px;
              box-shadow:0 8px 30px rgba(0,0,0,0.08);
            "
          >

            <div
              style="
                text-align:center;
                margin-bottom:25px;
              "
            >

              <h1
                style="
                  margin:0;
                  color:#166534;
                  font-size:26px;
                "
              >
                Online Voting System
              </h1>

              <p
                style="
                  color:#6b7280;
                  margin-top:8px;
                "
              >
                Secure Digital Voting Platform
              </p>

            </div>

            <h2>
              Account Verification
            </h2>

            <p
              style="
                color:#4b5563;
                line-height:1.6;
              "
            >
              Hello ${name},
            </p>

            <p
              style="
                color:#4b5563;
                line-height:1.6;
              "
            >
              Your verification OTP is:
            </p>

            <div
              style="
                margin:25px 0;
                padding:20px;
                text-align:center;
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                border-radius:12px;
              "
            >

              <div
                style="
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#14532d;
                "
              >
                ${otp}
              </div>

            </div>

            <p
              style="
                color:#4b5563;
                line-height:1.6;
              "
            >
              Please do not share this OTP with anyone.
            </p>

            <div
              style="
                margin-top:25px;
                padding-top:20px;
                border-top:1px solid #e5e7eb;
                text-align:center;
                color:#9ca3af;
                font-size:12px;
              "
            >

              This is an automated message from the
              Online Voting System.

            </div>

          </div>

        </div>

      </body>

      </html>
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
  if (!subject) {
    throw new Error(
      "Email subject is required."
    );
  }

  if (!message) {
    throw new Error(
      "Email message is required."
    );
  }

  return sendEmail({
    to,

    subject,

    text: `
Hello ${name},

${message}

This is an automated security message from the Online Voting System.
`.trim(),

    html: `
      <!DOCTYPE html>

      <html>

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          ${subject}
        </title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f3f7f5;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <div
          style="
            max-width:600px;
            margin:30px auto;
            padding:20px;
          "
        >

          <div
            style="
              background:#ffffff;
              border-radius:16px;
              padding:30px;
              box-shadow:0 8px 30px rgba(0,0,0,0.08);
            "
          >

            <h2>
              ${subject}
            </h2>

            <p>
              Hello ${name},
            </p>

            <p
              style="
                line-height:1.6;
                color:#4b5563;
              "
            >
              ${message}
            </p>

            <p
              style="
                margin-top:30px;
                color:#777;
                font-size:13px;
              "
            >
              This is an automated security message
              from the Online Voting System.
            </p>

          </div>

        </div>

      </body>

      </html>
    `,
  });
};