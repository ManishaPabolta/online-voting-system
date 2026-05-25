import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import VotingPanel from "../components/elections/VotingPanel";

import LiveVoteTracker from "../components/elections/LiveVoteTracker";

import {
  getElectionById,
} from "../api/electionApi";

const ElectionDetails = () => {

  // ================= PARAMS =================

  const { id } = useParams();

  // ================= STATES =================

  const [
    election,
    setElection,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ================= FETCH ELECTION =================

  const fetchElection = async () => {

    try {

      setLoading(true);

      const response =
        await getElectionById(id);

      console.log(
        "ELECTION RESPONSE =>",
        response.data
      );

      // 🔥 IMPORTANT FIX
      setElection(
        response?.data?.election
      );

    } catch (error) {

      console.log(
        "FETCH ELECTION ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {

    if (id) {
      fetchElection();
    }

  }, [id]);

  // ================= LOADING =================

  if (loading) {

    return (

      <MainLayout>

        <div className="flex justify-center items-center min-h-[60vh]">

          <h1 className="text-3xl font-bold text-white">
            Loading Election...
          </h1>

        </div>

      </MainLayout>
    );
  }

  // ================= NOT FOUND =================

  if (!election) {

    return (

      <MainLayout>

        <div className="flex justify-center items-center min-h-[60vh]">

          <h1 className="text-3xl font-bold text-red-500">
            Election Not Found
          </h1>

        </div>

      </MainLayout>
    );
  }

  // ================= MAIN UI =================

  return (

    <MainLayout>

      {/* ================= HEADER ================= */}

      <div className="mb-10">

        <h1 className="text-5xl font-black text-white">
          {election.title}
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          {election.description}
        </p>

      </div>

      {/* ================= STATUS ================= */}

      {
        election?.status === "COMPLETED" && (

          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl mb-8">

            <h2 className="text-3xl font-bold text-red-400">
              Election Ended
            </h2>

            <p className="text-gray-300 mt-3">
              Voting time has ended.
            </p>

            {
              election?.winner && (

                <div className="mt-5 bg-green-500/10 border border-green-500/30 rounded-2xl p-5">

                  <h3 className="text-2xl font-bold text-green-400">
                    Winner
                  </h3>

                  <p className="mt-2 text-xl font-semibold text-white">
                    {election.winner.name}
                  </p>

                </div>
              )
            }

          </div>
        )
      }

      {
        election?.status === "ACTIVE" && (

          <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-3xl mb-8">

            <h2 className="text-2xl font-bold text-green-400">
              Voting Live
            </h2>

            <p className="text-gray-300 mt-2">
              You can cast your vote now.
            </p>

          </div>
        )
      }

      {
        election?.status === "UPCOMING" && (

          <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-3xl mb-8">

            <h2 className="text-2xl font-bold text-yellow-400">
              Election Not Started
            </h2>

            <p className="text-gray-300 mt-2">
              Voting will begin soon.
            </p>

          </div>
        )
      }

      {/* ================= CANDIDATES ================= */}

      <div className="mb-10">

        <h2 className="text-3xl font-bold text-white mb-5">
          Candidates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {election?.candidates?.length > 0 ? (

            election.candidates.map(
              (candidate) => (

                <div
                  key={candidate._id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-5 shadow-lg"
                >

                  <img
                    src={
                      candidate.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />

                  <h3 className="text-2xl font-bold text-center mt-4 text-white">
                    {candidate.name}
                  </h3>

                  <p className="text-center text-gray-400 mt-1">
                    {candidate.party}
                  </p>

                  <p className="text-center mt-3 text-green-400 font-semibold">
                    Votes: {candidate.votes || 0}
                  </p>

                </div>
              )
            )

          ) : (

            <p className="text-gray-400">
              No candidates available
            </p>

          )}

        </div>

      </div>

      {/* ================= VOTING PANEL ================= */}

      <VotingPanel
        candidates={
          election?.candidates || []
        }
        electionId={
          election?._id
        }
        electionStatus={
          election?.status
        }
        winner={
          election?.winner
        }
      />

      {/* ================= LIVE VOTE TRACKER ================= */}

      <div className="mt-12">

        <LiveVoteTracker
          electionId={
            election?._id
          }
        />

      </div>

    </MainLayout>
  );
};

export default ElectionDetails;