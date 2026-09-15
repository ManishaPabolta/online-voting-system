import API from "./axios";

// ==========================================
// CREATE VOTER PROFILE
// ==========================================

export const createProfile = async (
  formData
) => {
  const response = await API.post(
    "/profile",
    formData
  );

  return response.data;
};

// ==========================================
// GET MY PROFILE
// ==========================================

export const getProfile = async () => {
  const response = await API.get(
    "/profile/me"
  );

  return response.data;
};

// ==========================================
// UPDATE VOTER PROFILE
// ==========================================

export const updateProfile = async (
  formData
) => {
  const response = await API.put(
    "/profile",
    formData
  );

  return response.data;
};