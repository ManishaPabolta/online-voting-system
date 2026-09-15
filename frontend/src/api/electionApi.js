import API from "./axios";

// ==========================================
// GET PUBLIC ELECTIONS
// ==========================================

export const getPublicElections = async () => {
  const response = await API.get(
    "/elections/public"
  );

  return response.data;
};

// ==========================================
// GET ALL ELECTIONS - ADMIN
// ==========================================

export const getAllElections = async () => {
  const response = await API.get(
    "/elections"
  );

  return response.data;
};

// ==========================================
// GET SINGLE ELECTION
// ==========================================

export const getElectionById = async (id) => {
  const response = await API.get(
    `/elections/${id}`
  );

  return response.data;
};

// ==========================================
// CREATE ELECTION - ADMIN
// ==========================================

export const createElection = async (data) => {
  const response = await API.post(
    "/elections",
    data
  );

  return response.data;
};

// ==========================================
// UPDATE ELECTION - ADMIN
// ==========================================

export const updateElection = async (
  id,
  data
) => {
  const response = await API.put(
    `/elections/${id}`,
    data
  );

  return response.data;
};

// ==========================================
// PUBLISH ELECTION - ADMIN
// ==========================================

export const publishElection = async (id) => {
  const response = await API.patch(
    `/elections/${id}/publish`
  );

  return response.data;
};

// ==========================================
// CANCEL ELECTION - ADMIN
// ==========================================

export const cancelElection = async (id) => {
  const response = await API.patch(
    `/elections/${id}/cancel`
  );

  return response.data;
};

// ==========================================
// DELETE ELECTION - ADMIN
// ==========================================

export const deleteElection = async (id) => {
  const response = await API.delete(
    `/elections/${id}`
  );

  return response.data;
};