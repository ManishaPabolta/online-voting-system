import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Vote,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { castVote } from "../../api/voteApi";
import CandidateCard from "./CandidateCard";

const VotingPanel = ({ candidates = [], electionId, onVoteSuccess }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingPassword, setVotingPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }

    setStep(2);
  };

  const submitVote = async (position) => {
    if (!selectedCandidate?._id) {
      toast.error("Please select a candidate");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        electionId,
        candidateId: selectedCandidate._id,
        votingPassword,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const response = await castVote(payload);

      const voteData =
        response?.data?.vote ||
        response?.data ||
        response?.vote ||
        null;

      const message =
        response?.message ||
        response?.data?.message ||
        "Vote cast successfully";

      toast.success(message);

      if (onVoteSuccess) {
        onVoteSuccess(voteData, response);
      }

      setSelectedCandidate(null);
      setVotingPassword("");
      setShowPassword(false);
      setStep(1);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to cast vote";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!votingPassword.trim()) {
      toast.error("Enter your voting password");
      return;
    }

    if (votingPassword.length < 6) {
      toast.error("Voting password must be at least 6 characters");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      submitVote,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Location permission is required to cast your vote"
          );
        } else if (error.code === error.TIMEOUT) {
          toast.error("Unable to get your location. Please try again.");
        } else {
          toast.error("Unable to get your current location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Vote size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Cast Your Vote
            </h2>

            <p className="text-sm text-slate-400">
              Select one candidate to continue.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
              step === 1
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-white/5 text-slate-500"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
              1
            </span>
            Candidate
          </div>

          <div className="h-px w-8 bg-white/10" />

          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
              step === 2
                ? "bg-teal-500/15 text-teal-300"
                : "bg-white/5 text-slate-500"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                step === 2
                  ? "bg-teal-500 text-white"
                  : "bg-white/10 text-slate-500"
              }`}
            >
              2
            </span>
            Verification
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            key="candidate-step"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="space-y-8"
          >
            {candidates.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
                <Vote
                  size={42}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 text-lg font-bold text-white">
                  No candidates available
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  There are currently no candidates available for this
                  election.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate?._id}
                    candidate={candidate}
                    selected={
                      selectedCandidate?._id === candidate?._id
                    }
                    onSelect={setSelectedCandidate}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedCandidate || candidates.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
              <ArrowRight size={19} />
            </button>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            key="verification-step"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="mx-auto w-full max-w-xl"
          >
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Selected candidate */}
              <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
                <img
                  src={
                    selectedCandidate?.image ||
                    selectedCandidate?.photo ||
                    "https://via.placeholder.com/150?text=Candidate"
                  }
                  alt={selectedCandidate?.name || "Candidate"}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Selected Candidate
                  </p>

                  <h3 className="truncate font-bold text-white">
                    {selectedCandidate?.name}
                  </h3>

                  {selectedCandidate?.party && (
                    <p className="text-xs text-slate-400">
                      {selectedCandidate.party}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="mt-7">
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Voting Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={votingPassword}
                    onChange={(e) =>
                      setVotingPassword(e.target.value)
                    }
                    placeholder="Enter your voting password"
                    autoComplete="off"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide voting password"
                        : "Show voting password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Location notice */}
              <div className="mt-5 flex gap-3 rounded-2xl border border-teal-400/20 bg-teal-500/[0.06] p-4">
                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-teal-400"
                />

                <div>
                  <p className="text-sm font-semibold text-teal-300">
                    Location verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Your current location is required while casting
                    the vote.
                  </p>
                </div>
              </div>

              {/* Security notice */}
              <div className="mt-4 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <p className="text-xs leading-5 text-slate-400">
                  Your voting password is used only for vote
                  verification. Never share it with anyone.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !votingPassword.trim()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Casting Vote...
                    </>
                  ) : (
                    <>
                      <Vote size={18} />
                      Submit Vote
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingPanel;