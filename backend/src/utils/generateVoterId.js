import crypto from "crypto";

// ======================================================
// GENERATE VOTER ID
// ======================================================

const generateVoterId = () => {
  const randomNumber = crypto.randomInt(
    100000,
    1000000
  );

  return `VOTER-${randomNumber}`;
};

export default generateVoterId;