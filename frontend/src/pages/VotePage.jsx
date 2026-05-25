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
  const { id } =
    useParams();

  const [election, setElection] =
    useState(null);

  useEffect(() => {
    fetchElection();
  }, []);

  const fetchElection =
    async () => {
      try {
        const response =
          await getElectionById(
            id
          );

        setElection(
          response.election
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (!election)
    return null;

  return (
    <MainLayout>

      <div className="mb-10">

        <h1 className="text-5xl font-black">
          {election.title}
        </h1>

        <p className="text-gray-400 mt-4">
          {
            election.description
          }
        </p>

      </div>

      <VotingPanel
        candidates={
          election.candidates
        }
        electionId={
          election._id
        }
      />

      <div className="mt-12">

        <LiveVoteTracker
          electionId={
            election._id
          }
        />

      </div>

    </MainLayout>
  );
};

export default ElectionDetails;