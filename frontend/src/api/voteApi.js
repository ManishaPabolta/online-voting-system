import API from "./axios";

/**
 * ================= CAST VOTE =================
 */
export const castVote = async (voteData) => {

  console.log("VOTE DATA =>", voteData);

  const response = await API.post(
    "/vote/cast",
    voteData
  );

  return response.data;
};

/**
 * ================= GET VOTE STATUS =================
 */
export const getVoteStatus = async () => {

  const response = await API.get(
    "/vote/status"
  );

  return response.data;
};