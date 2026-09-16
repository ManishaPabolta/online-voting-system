import API from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL CANDIDATES
|--------------------------------------------------------------------------
| Backend:
| GET /api/candidates
|
| Optional query parameters:
| ?election=<electionId>
| ?active=true
| ?active=false
|
| Examples:
| getCandidates()
| getCandidates({ election: electionId })
| getCandidates({ election: electionId, active: true })
*/
export const getCandidates = async (params = {}) => {
  const response = await API.get("/candidates", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE CANDIDATE
|--------------------------------------------------------------------------
| Backend:
| GET /api/candidates/:id
*/
export const getCandidateById = async (id) => {
  const response = await API.get(`/candidates/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE CANDIDATE
|--------------------------------------------------------------------------
| Backend:
| POST /api/candidates
|
| Admin authentication required.
|
| Supported fields:
| - election     required
| - name         required
| - party        optional
| - symbol       optional
| - photo        optional
| - manifesto    optional
| - biography    optional
| - experience   optional
| - position     optional
| - isActive     optional
*/
export const createCandidate = async (data) => {
  const response = await API.post("/candidates", data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE CANDIDATE
|--------------------------------------------------------------------------
| Backend:
| PUT /api/candidates/:id
|
| Supported fields:
| - name
| - party
| - symbol
| - photo
| - manifesto
| - biography
| - experience
| - position
| - isActive
*/
export const updateCandidate = async (id, data) => {
  const response = await API.put(`/candidates/${id}`, data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE CANDIDATE
|--------------------------------------------------------------------------
| Backend:
| DELETE /api/candidates/:id
|
| Admin authentication required.
*/
export const deleteCandidate = async (id) => {
  const response = await API.delete(`/candidates/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/
export default {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};