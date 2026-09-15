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
// DECRYPT DATA
// ======================================================

const decryptData = (encryptedData) => {
  if (!encryptedData) {
    throw new Error(
      "Encrypted data is required."
    );
  }

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      getEncryptionKey()
    );

    const decryptedText =
      bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error(
        "Unable to decrypt data."
      );
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    throw new Error(
      "Invalid or corrupted encrypted data."
    );
  }
};

export default decryptData;