import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Users,
  Vote,
  XCircle,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import VotingPanel from "../components/elections/VotingPanel";
import LiveVoteTracker from "../components/elections/LiveVoteTracker";

import {
  getElectionById,
} from "../api/electionApi";

import {
  getElectionResults,
} from "../api/voteApi";

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    icon: Clock3,
    className:
      "border-slate-400/20 bg-slate-500/10 text-slate-300",
  },

  UPCOMING: {
    label: "Upcoming",
    icon: Clock3,
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
  },

  LIVE: {
    label: "Voting Live",
    icon: Vote,
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
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

const formatDateTime = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Not available";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getElectionFromResponse = (
  response
) => {
  const data =
    response?.data || response;

  if (data?.election) {
    return data.election;
  }

  if (data?.data?.election) {
    return data.data.election;
  }

  if (data?.data?._id) {
    return data.data;
  }

  if (data?._id) {
    return data;
  }

  return null;
};

const getResultsFromResponse = (
  response
) => {
  const data =
    response?.data || response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to load election details."
  );
};

const ElectionDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [
    election,
    setElection,
  ] = useState(null);

  const [
    results,
    setResults,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    resultsLoading,
    setResultsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =========================================================
  // FETCH ELECTION
  // =========================================================

  const fetchElection = async () => {
    if (!id) {
      setError(
        "Election ID is missing."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getElectionById(id);

      const electionData =
        getElectionFromResponse(
          response
        );

      if (!electionData) {
        throw new Error(
          "Election not found."
        );
      }

      setElection(electionData);
    } catch (err) {
      console.error(
        "FETCH ELECTION ERROR:",
        err
      );

      setElection(null);
      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH RESULTS
  // =========================================================
  /*
   * Results are fetched only when they are relevant.
   *
   * Vote results come from the backend aggregation,
   * not from candidate.votes.
   */

  const fetchResults = async () => {
    if (!id) return;

    try {
      setResultsLoading(true);

      const response =
        await getElectionResults(id);

      setResults(
        getResultsFromResponse(
          response
        )
      );
    } catch (err) {
      /*
       * Results may not be available yet,
       * especially before result publication.
       */
      console.log(
        "RESULTS NOT AVAILABLE:",
        err
      );

      setResults([]);
    } finally {
      setResultsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchElection();
  }, [id]);

  // =========================================================
  // LOAD RESULTS WHEN COMPLETED
  // =========================================================

  useEffect(() => {
    if (
      election?.status ===
      "COMPLETED"
    ) {
      fetchResults();
    }
  }, [election?.status, id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[65vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
              <Loader2
                size={30}
                className="animate-spin text-emerald-400"
              />
            </div>

            <h1 className="mt-5 text-xl font-bold text-white">
              Loading Election...
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch the
              election details.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!election) {
    return (
      <MainLayout>
        <div className="flex min-h-[65vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertCircle
                size={30}
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Election Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested election could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white"
            >
              <ArrowLeft
                size={17}
              />
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const status =
    election.status?.toUpperCase();

  const statusConfig =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.DRAFT;

  const StatusIcon =
    statusConfig.icon;

  const candidates =
    Array.isArray(
      election.candidates
    )
      ? election.candidates
      : [];

  const isLive =
    status === "LIVE";

  const isUpcoming =
    status === "UPCOMING";

  const isCompleted =
    status === "COMPLETED";

  const isCancelled =
    status === "CANCELLED";

  /*
   * LiveVoteTracker expects actual vote data.
   * We do not generate fake vote numbers.
   */
  const trackerData =
    results
      .map((item) => {
        const candidate =
          item?.candidate ||
          item?.candidateId;

        return {
          name:
            candidate?.name ||
            item?.name ||
            "Candidate",
          votes:
            Number(
              item?.votes ??
                item?.voteCount ??
                0
            ),
        };
      })
      .filter(
        (item) =>
          item.name &&
          Number.isFinite(item.votes)
      );

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl">

        {/* =================================================
            BACK BUTTON
        ================================================== */}

        <motion.button
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.07] hover:text-white"
        >
          <ArrowLeft size={17} />
          Back
        </motion.button>

        {/* =================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0">
              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${statusConfig.className}`}
              >
                <StatusIcon size={14} />
                {statusConfig.label}
              </div>

              <h1 className="break-words text-3xl font-black tracking-tight text-white sm:text-5xl">
                {election.title}
              </h1>

              {election.description && (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  {election.description}
                </p>
              )}
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <Vote size={27} />
            </div>
          </div>

          {/* =================================================
              ELECTION INFORMATION
          ================================================== */}

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CalendarDays
                  size={15}
                />
                Start Date
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-200">
                {formatDateTime(
                  election.startDate
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock3
                  size={15}
                />
                End Date
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-200">
                {formatDateTime(
                  election.endDate
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Users size={15} />
                Candidates
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-200">
                {candidates.length}
              </p>
            </div>

          </div>
        </motion.div>

        {/* =================================================
            STATUS MESSAGE
        ================================================== */}

        {isLive && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Vote size={18} />
              </div>

              <div>
                <h2 className="font-bold text-emerald-300">
                  Voting is Live
                </h2>

                <p className="mt-1 text-sm leading-6 text-emerald-100/70">
                  You can cast your vote for
                  this election.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isUpcoming && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5"
          >
            <div className="flex items-start gap-3">
              <Clock3
                size={21}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <div>
                <h2 className="font-bold text-amber-300">
                  Election Not Started
                </h2>

                <p className="mt-1 text-sm text-amber-100/70">
                  Voting will become available
                  when the election goes live.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-teal-400/20 bg-teal-500/10 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-teal-400"
              />

              <div>
                <h2 className="font-bold text-teal-300">
                  Election Completed
                </h2>

                <p className="mt-1 text-sm text-teal-100/70">
                  Voting for this election has
                  ended.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isCancelled && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-red-400/20 bg-red-500/10 p-5"
          >
            <div className="flex items-start gap-3">
              <XCircle
                size={21}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h2 className="font-bold text-red-300">
                  Election Cancelled
                </h2>

                <p className="mt-1 text-sm text-red-100/70">
                  Voting is not available for
                  this election.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            CANDIDATES
        ================================================== */}

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
            delay: 0.1,
          }}
          className="mb-10"
        >
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Candidates
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Candidates participating in
                this election.
              </p>
            </div>

            <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400 sm:block">
              {candidates.length}{" "}
              candidate
              {candidates.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {candidates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <Users
                size={30}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                No candidates are available
                for this election.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {candidates.map(
                (candidate, index) => (
                  <motion.div
                    key={
                      candidate._id ||
                      candidate.id ||
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.12 +
                        index * 0.05,
                    }}
                    className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-400/20"
                  >
                    <div className="flex items-center gap-4">
                      {candidate.image ? (
                        <img
                          src={
                            candidate.image
                          }
                          alt={
                            candidate.name ||
                            "Candidate"
                          }
                          className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-400/10"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xl font-black text-emerald-300">
                          {(
                            candidate.name ||
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-white">
                          {candidate.name ||
                            "Unnamed Candidate"}
                        </h3>

                        {candidate.party && (
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {candidate.party}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </motion.section>

        {/* =================================================
            VOTING PANEL
        ================================================== */}

        {!isCompleted &&
          !isCancelled &&
          election.status !==
            "DRAFT" && (
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
                delay: 0.2,
              }}
              className="mb-10"
            >
              <VotingPanel
                candidates={candidates}
                electionId={
                  election._id
                }
                electionStatus={
                  election.status
                }
              />
            </motion.section>
          )}

        {/* =================================================
            RESULTS / LIVE TRACKER
        ================================================== */}

        {isCompleted &&
          (resultsLoading ? (
            <div className="mb-10 flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-10">
              <Loader2
                size={24}
                className="animate-spin text-emerald-400"
              />

              <span className="ml-3 text-sm text-slate-500">
                Loading results...
              </span>
            </div>
          ) : trackerData.length > 0 ? (
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
                delay: 0.25,
              }}
              className="mb-10"
            >
              <div className="mb-5">
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  Election Results
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Results calculated from recorded
                  votes.
                </p>
              </div>

              <LiveVoteTracker
                data={trackerData}
              />
            </motion.section>
          ) : (
            <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-slate-500">
                Results are not available yet.
              </p>
            </div>
          ))}
      </div>
    </MainLayout>
  );
};

export default ElectionDetails;