import API from "./axios";

/**
 * ================= CREATE PROFILE =================
 */
export const createProfile = async (
  formData
) => {

  const response =
    await API.post(
      "/profile/create",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};

/**
 * ================= GET PROFILE =================
 */
export const getProfile =
  async () => {

    const response =
      await API.get(
        "/profile/me"
      );

    return response.data;
  };

/**
 * ================= UPDATE PROFILE =================
 */
export const updateProfile =
  async (formData) => {

    const response =
      await API.put(
        "/profile/update",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };