import API from "./axios";

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = async (otpData) => {
  const response = await API.post("/auth/verify-otp", otpData);
  return response.data;
};

// ==========================================
// RESEND OTP
// ==========================================

export const resendOTP = async (email) => {
  const response = await API.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

// ==========================================
// LOGOUT
// ==========================================
//
// Backend currently does not expose /auth/logout.
// Logout is handled locally.
//

export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return {
    success: true,
    message: "Logged out successfully.",
  };
};