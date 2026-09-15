// ======================================================
// RESEND MAIL SERVICE
// ======================================================

const RESEND_API_URL = "https://api.resend.com/emails";

// ======================================================
// GET RESEND API KEY
// ======================================================

const getApiKey = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured in environment variables."
    );
  }

  return apiKey;
};

// ======================================================
// GET SENDER EMAIL
// ======================================================

const getFromEmail = () => {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error(
      "EMAIL_FROM is not configured in environment variables."
    );
  }

  return from;
};

// ======================================================
// SEND EMAIL
// ======================================================

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
  text,
}) => {
  // -----------------------------------------------
  // VALIDATION
  // -----------------------------------------------

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

  // -----------------------------------------------
  // RESEND CONFIGURATION
  // -----------------------------------------------

  const apiKey = getApiKey();

  const sender = from || getFromEmail();

  const recipients = Array.isArray(to)
    ? to
    : [String(to).trim()];

  // -----------------------------------------------
  // REQUEST PAYLOAD
  // -----------------------------------------------

  const payload = {
    from: sender,
    to: recipients,
    subject: String(subject).trim(),
  };

  if (html) {
    payload.html = html;
  }

  if (text) {
    payload.text = text;
  }

  // -----------------------------------------------
  // SEND THROUGH RESEND
  // -----------------------------------------------

  const response = await fetch(
    RESEND_API_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  // -----------------------------------------------
  // READ RESPONSE
  // -----------------------------------------------

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // -----------------------------------------------
  // HANDLE RESEND ERROR
  // -----------------------------------------------

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `Resend API request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  // -----------------------------------------------
  // SUCCESS
  // -----------------------------------------------

  console.log(
    `Email sent successfully to ${recipients.join(", ")}`
  );

  return {
    messageId: data?.id || null,
    response: data,
  };
};

// ======================================================
// VERIFY RESEND CONFIGURATION
// ======================================================

export const verifyMailTransporter = async () => {
  try {
    getApiKey();
    getFromEmail();

    console.log(
      "Resend mail configuration is ready."
    );

    return true;
  } catch (error) {
    console.error(
      "Resend mail configuration failed:",
      error.message
    );

    return false;
  }
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const transporter = {
  sendEmail,
};

export default transporter;