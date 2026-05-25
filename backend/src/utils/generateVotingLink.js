import crypto from "crypto";

const generateVotingLink = () => {
  const token =
    crypto.randomBytes(32).toString(
      "hex"
    );

  return token;
};

export default generateVotingLink;