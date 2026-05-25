import { useState } from "react";
import toast from "react-hot-toast";
import { castVote } from "../../api/voteApi";
import CandidateCard from "./CandidateCard";

const VotingPanel = ({ candidates = [], electionId }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const submitVote = async (position) => {
    try {
      setLoading(true);

      const payload = {
        electionId,
        candidateId: selectedCandidate._id,
        otp,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const res = await castVote(payload);

      toast.success(res?.message || "Vote cast successfully");

      setSelectedCandidate(null);
      setOtp("");
      setStep(1);

    } catch (error) {
      toast.error(error.response?.data?.message || "Vote failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = () => {
    if (!selectedCandidate) {
      return toast.error("Select a candidate");
    }

    if (step === 1) {
      return setStep(2);
    }

    if (!otp) {
      return toast.error("Enter OTP");
    }

    navigator.geolocation.getCurrentPosition(submitVote);
  };

  return (
    <div>

      {/* CANDIDATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            selected={selectedCandidate?._id === candidate._id}
            onSelect={setSelectedCandidate}
          />
        ))}
      </div>

      {/* OTP INPUT */}
      {step === 2 && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 rounded-lg text-black"
          />
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleVote}
        disabled={loading}
        className="w-full mt-10 bg-green-600 hover:bg-green-700 py-4 rounded-2xl text-lg font-bold disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : step === 1
          ? "Continue"
          : "Submit Vote"}
      </button>

    </div>
  );
};

export default VotingPanel;