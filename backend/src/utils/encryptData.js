import CryptoJS from "crypto-js";

const encryptData = (data) => {
  const encrypted =
    CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.JWT_SECRET
    ).toString();

  return encrypted;
};

export default encryptData;