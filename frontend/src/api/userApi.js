import API from "./axios";

/* ======================================================
   GET ALL USERS
====================================================== */

export const getAllUsers = async (
  params = {}
) => {
  const response = await API.get(
    "/users",
    {
      params,
    }
  );

  return response.data;
};

/* ======================================================
   GET SINGLE USER
====================================================== */

export const getUserById = async (id) => {
  const response = await API.get(
    `/users/${id}`
  );

  return response.data;
};

/* ======================================================
   VERIFY / REJECT VOTER PROFILE
====================================================== */

export const updateVoterVerification =
  async (id, status) => {
    const response = await API.patch(
      `/users/${id}/voter-verification`,
      {
        status,
      }
    );

    return response.data;
  };

/* ======================================================
   VERIFY VOTER
====================================================== */

export const verifyVoterProfile =
  async (id) => {
    return updateVoterVerification(
      id,
      "VERIFIED"
    );
  };

/* ======================================================
   REJECT VOTER
====================================================== */

export const rejectVoterProfile =
  async (id) => {
    return updateVoterVerification(
      id,
      "REJECTED"
    );
  };

/* ======================================================
   MOVE BACK TO PENDING
====================================================== */

export const resetVoterVerification =
  async (id) => {
    return updateVoterVerification(
      id,
      "PENDING"
    );
  };

/* ======================================================
   BLOCK / UNBLOCK USER
====================================================== */

export const toggleUserStatus =
  async (id) => {
    const response = await API.patch(
      `/users/${id}/status`
    );

    return response.data;
  };

/* ======================================================
   DELETE USER
====================================================== */

export const deleteUser = async (id) => {
  const response = await API.delete(
    `/users/${id}`
  );

  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  updateVoterVerification,
  verifyVoterProfile,
  rejectVoterProfile,
  resetVoterVerification,
  toggleUserStatus,
  deleteUser,
};