import CryptoJS from "crypto-js";

const decryptData = (
  encryptedData
) => {
  const bytes =
    CryptoJS.AES.decrypt(
      encryptedData,
      process.env.JWT_SECRET
    );

  const decrypted =
    bytes.toString(
      CryptoJS.enc.Utf8
    );

  return JSON.parse(decrypted);
};

export default decryptData;