import CryptoJS from "crypto-js";

// ======================================================
// GET ENCRYPTION KEY
// ======================================================

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error(
      "ENCRYPTION_KEY is not configured."
    );
  }

  return key;
};

// ======================================================
// ENCRYPT DATA
// ======================================================

const encryptData = (data) => {
  if (data === undefined || data === null) {
    throw new Error(
      "Data is required for encryption."
    );
  }

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    getEncryptionKey()
  ).toString();

  return encrypted;
};

export default encryptData;