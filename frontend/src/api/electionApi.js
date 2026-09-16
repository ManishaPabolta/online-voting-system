import API from "./axios";

/*
|--------------------------------------------------------------------------
| PUBLIC ELECTIONS
|--------------------------------------------------------------------------
| Normal logged-in users ke liye.
| Backend route:
| GET /api/elections/public
*/
export const getPublicElections = async () => {
  const response = await API.get("/elections/public");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| ALL ELECTIONS
|--------------------------------------------------------------------------
| Admin-only endpoint.
| Backend route:
| GET /api/elections
*/
export const getAllElections = async () => {
  const response = await API.get("/elections");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| SINGLE ELECTION
|--------------------------------------------------------------------------
| Backend route:
| GET /api/elections/:id
*/
export const getElectionById = async (id) => {
  const response = await API.get(`/elections/${id}`);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE ELECTION
|--------------------------------------------------------------------------
| Admin only.
*/
export const createElection = async (data) => {
  const response = await API.post("/elections", data);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE ELECTION
|--------------------------------------------------------------------------
| Admin only.
*/
export const updateElection = async (id, data) => {
  const response = await API.put(`/elections/${id}`, data);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| PUBLISH ELECTION
|--------------------------------------------------------------------------
| Admin only.
*/
export const publishElection = async (id) => {
  const response = await API.patch(
    `/elections/${id}/publish`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CANCEL ELECTION
|--------------------------------------------------------------------------
| Admin only.
*/
export const cancelElection = async (id) => {
  const response = await API.patch(
    `/elections/${id}/cancel`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE ELECTION
|--------------------------------------------------------------------------
| Admin only.
*/
export const deleteElection = async (id) => {
  const response = await API.delete(
    `/elections/${id}`
  );

  return response.data;
};

export default {
  getPublicElections,
  getAllElections,
  getElectionById,
  createElection,
  updateElection,
  publishElection,
  cancelElection,
  deleteElection,
};