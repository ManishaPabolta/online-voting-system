import transporter from "../config/mail.js";

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  const info =
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to,

      subject,

      html,
    });

  return info;
};