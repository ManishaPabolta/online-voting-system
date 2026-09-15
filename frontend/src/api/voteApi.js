import API from "./axios";

// ==========================================
// CAST VOTE
// ==========================================

export const castVote = async (voteData) => {
  const response = await API.post(
    "/vote/cast",
    voteData
  );

  return response.data;
};

// ==========================================
// GET MY VOTE STATUS
// ==========================================

export const getVoteStatus = async () => {
  const response = await API.get(
    "/vote/status"
  );

  return response.data;
};

// ==========================================
// CHECK SPECIFIC ELECTION STATUS
// ==========================================

export const checkVoteStatus = async (
  electionId
) => {
  const response = await API.get(
    `/vote/status/${electionId}`
  );

  return response.data;
};

// ==========================================
// GET ELECTION RESULTS
// ==========================================

export const getElectionResults = async (
  electionId
) => {
  const response = await API.get(
    `/vote/results/${electionId}`
  );

  return response.data;
};