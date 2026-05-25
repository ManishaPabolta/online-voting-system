import API from "./axios";

export const registerUser = async (
  userData
) => {
  const response =
    await API.post(
      "/auth/register",
      userData
    );

  return response.data;
};

export const loginUser = async (
  userData
) => {
  const response =
    await API.post(
      "/auth/login",
      userData
    );

  return response.data;
};

export const verifyOTP = async (
  otpData
) => {
  const response =
    await API.post(
      "/auth/verify-otp",
      otpData
    );

  return response.data;
};

export const getCurrentUser =
  async () => {
    const response =
      await API.get(
        "/auth/me"
      );

    return response.data;
  };

export const logoutUser =
  async () => {
    const response =
      await API.post(
        "/auth/logout"
      );

    return response.data;
  };