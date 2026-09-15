import API from "./axios";

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (userData) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = async (otpData) => {
  const response = await API.post(
    "/auth/verify-otp",
    otpData
  );

  return response.data;
};

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (userData) => {
  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};

// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const response = await API.get(
    "/auth/me"
  );

  return response.data;
};

// ==========================================
// LOGOUT
// ==========================================

/*
  Current backend authRoutes does not expose
  /auth/logout.

  Therefore logout is handled on the frontend
  by removing the stored access token/user.
*/

export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return {
    success: true,
    message: "Logged out successfully.",
  };
};