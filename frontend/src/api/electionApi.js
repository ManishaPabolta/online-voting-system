import API from "./axios";

// CREATE
export const createElection = (
  data
) =>
  API.post(
    "/elections",
    data
  );

// GET ALL
export const getAllElections =
  () =>
    API.get(
      "/elections"
    );

// GET SINGLE
export const getElectionById = (
  id
) =>
  API.get(
    `/elections/${id}`
  );

// UPDATE
export const updateElection = (
  id,
  data
) =>
  API.put(
    `/elections/${id}`,
    data
  );

// DELETE
export const deleteElection = (
  id
) =>
  API.delete(
    `/elections/${id}`
  );