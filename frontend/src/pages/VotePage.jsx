import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  Vote,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import VotingPanel from "../components/elections/VotingPanel";
import LiveVoteTracker from "../components/elections/LiveVoteTracker";

import { getElectionById } from "../api/electionApi";
import { getElectionResults } from "../api/voteApi";

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    icon: Clock3,
    className:
      "border-slate-400/20 bg-slate-500/10 text-slate-300",
  },
  UPCOMING: {
    label: "Upcoming",
    icon: CalendarDays,
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
  },
  LIVE: {
    label: "Live",
    icon: CheckCircle2,
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-teal-400/20 bg-teal-500/10 text-teal-300",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "border-red-400/20 bg-red-500/10 text-red-300",
  },
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchElection = useCallback(async () => {
    if (!id) {
      setError("Election ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getElectionById(id);

      const electionData =
        response?.election ??
        response?.data?.election ??
        response?.data ??
        null;

      if (!electionData) {
        throw new Error("Election details were not found.");
      }

      setElection(electionData);
    } catch (error) {
      console.error("FETCH_ELECTION_ERROR:", error);

      setElection(null);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load election details."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchResults = useCallback(async () => {
    if (!id || election?.status !== "COMPLETED") {
      return;
    }

    try {
      setResultsLoading(true);

      const response = await getElectionResults(id);

      const resultData =
        response?.results ??
        response?.data?.results ??
        response?.data ??
        response ??
        null;

      setResults(resultData);
    } catch (error) {
      /*
       * Results may not be publicly available depending on
       * backend election settings.
       */
      console.error("FETCH_RESULTS_ERROR:", error);
      setResults(null);
    } finally {
      setResultsLoading(false);
    }
  }, [id, election?.status]);

  useEffect(() => {
    fetchElection();
  }, [fetchElection]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={34}
              className="animate-spin text-emerald-400"
            />

            <p className="text-sm text-slate-500">
              Loading election details...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ================= ERROR ================= */

  if (error || !election) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-lg rounded-3xl border border-red-400/20 bg-slate-900/70 p-8 text-center shadow-xl backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertCircle size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-white">
              Election Not Available
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error || "The requested election could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/elections")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              <ArrowLeft size={17} />
              Back to Elections
            </button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const status =
    STATUS_CONFIG[election.status] ??
    STATUS_CONFIG.UPCOMING;

  const StatusIcon = status.icon;

  /*
   * Candidates are expected from the backend election response.
   * No fake candidates are created here.
   */
  const candidates = Array.isArray(election.candidates)
    ? election.candidates
    : [];

  const canVote =
    election.status === "LIVE" &&
    candidates.length > 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* ================= BACK BUTTON ================= */}

        <motion.button
          initial={{
            opacity: 0,
            x: -15,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          type="button"
          onClick={() => navigate("/elections")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/5 hover:text-emerald-300"
        >
          <ArrowLeft size={17} />
          Back to Elections
        </motion.button>

        {/* ================= ELECTION HEADER ================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
              >
                <StatusIcon size={14} />
                {status.label}
              </div>

              {election.isPublished && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <ShieldCheck size={14} />
                  Published
                </div>
              )}
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              {election.title}
            </h1>

            {election.description && (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                {election.description}
              </p>
            )}

            {/* Election information */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {election.startDate && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <CalendarDays
                    size={20}
                    className="shrink-0 text-emerald-400"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Starts
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {formatDate(election.startDate)}
                    </p>
                  </div>
                </div>
              )}

              {election.endDate && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Clock3
                    size={20}
                    className="shrink-0 text-teal-400"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Ends
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {formatDate(election.endDate)}
                    </p>
                  </div>
                </div>
              )}

              {election.location && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
                  <MapPin
                    size={20}
                    className="shrink-0 text-emerald-400"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {election.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* ================= VOTING ================= */}

        {canVote && (
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                <Vote size={21} />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  Cast Your Vote
                </h2>

                <p className="text-sm text-slate-500">
                  Select a candidate and complete verification.
                </p>
              </div>
            </div>

            <VotingPanel
              candidates={candidates}
              electionId={election._id}
            />
          </motion.section>
        )}

        {/* ================= NOT AVAILABLE ================= */}

        {!canVote &&
          election.status !== "COMPLETED" &&
          election.status !== "CANCELLED" && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="rounded-3xl border border-amber-400/20 bg-amber-500/[0.04] p-6"
            >
              <div className="flex items-start gap-4">
                <CalendarDays
                  size={23}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <div>
                  <h3 className="font-bold text-white">
                    Voting is not available yet
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This election is currently{" "}
                    {election.status?.toLowerCase() || "unavailable"}.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        {election.status === "CANCELLED" && (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.04] p-6">
            <div className="flex items-start gap-4">
              <XCircle
                size={23}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h3 className="font-bold text-white">
                  This election has been cancelled
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Voting is unavailable for a cancelled election.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= RESULTS ================= */}

        {election.status === "COMPLETED" && (
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-400">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  Election Results
                </h2>

                <p className="text-sm text-slate-500">
                  Official voting results for this election.
                </p>
              </div>
            </div>

            {resultsLoading ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60">
                <Loader2
                  size={28}
                  className="animate-spin text-emerald-400"
                />
              </div>
            ) : results ? (
              <LiveVoteTracker
                electionId={election._id}
                data={results}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
                <p className="text-sm text-slate-500">
                  Results are not available for this election.
                </p>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </MainLayout>
  );
};

export default ElectionDetails;