import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import ElectionCard from "../components/elections/ElectionCard";

import { getAllElections } from "../api/electionApi";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchElections = async () => {
    try {
      const response = await getAllElections();

      // ✅ SAFE HANDLING (depends on backend response shape)
      const data = response?.data || response;

      setElections(data?.elections || []);
    } catch (error) {
      console.log("FETCH_ELECTIONS_ERROR:", error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <MainLayout>
      <div className="mb-10">
        <h1 className="text-5xl font-black">Elections</h1>

        <p className="text-gray-400 mt-3">
          Participate in secure online elections
        </p>
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-gray-500">Loading elections...</p>
      ) : elections.length === 0 ? (
        <p className="text-gray-500">No elections available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {elections.map((election) => (
            <ElectionCard key={election._id} election={election} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Elections;