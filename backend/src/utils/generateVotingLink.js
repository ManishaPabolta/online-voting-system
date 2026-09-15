import crypto from "crypto";

// ======================================================
// GENERATE SECURE VOTING LINK TOKEN
// ======================================================

const generateVotingLink = () => {
  return crypto
    .randomBytes(32)
    .toString("hex");
};

export default generateVotingLink;