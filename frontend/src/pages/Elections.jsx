import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Vote,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import ElectionCard from "../components/elections/ElectionCard";

import { getAllElections } from "../api/electionApi";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ELECTIONS
  // =========================================================

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllElections();

      /*
       * Supports common backend response shapes:
       *
       * { elections: [...] }
       * { data: { elections: [...] } }
       * [...]
       */

      const responseData =
        response?.data ?? response;

      let electionList = [];

      if (Array.isArray(responseData)) {
        electionList = responseData;
      } else if (
        Array.isArray(
          responseData?.elections
        )
      ) {
        electionList =
          responseData.elections;
      } else if (
        Array.isArray(
          responseData?.data
        )
      ) {
        electionList =
          responseData.data;
      }

      setElections(electionList);
    } catch (error) {
      console.error(
        "FETCH_ELECTIONS_ERROR:",
        error
      );

      setElections([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load elections."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl">

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
          className="mb-10"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
                <Vote size={14} />
                Online Voting
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                Elections
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                View available elections and
                participate securely in the voting
                process.
              </p>
            </div>

            {!loading &&
              elections.length > 0 && (
                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <Vote
                    size={17}
                    className="text-emerald-400"
                  />

                  <span className="text-sm font-semibold text-slate-300">
                    {elections.length}{" "}
                    election
                    {elections.length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}
          </div>
        </motion.div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
                <Loader2
                  size={30}
                  className="animate-spin text-emerald-400"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                Loading Elections...
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fetching the latest election
                information.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-500/5 p-7 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertCircle
                size={28}
              />
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              Unable to Load Elections
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchElections}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
            >
              <RefreshCw
                size={17}
              />
              Try Again
            </button>
          </motion.div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          !error &&
          elections.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/70 text-slate-500">
                <Vote size={30} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No Elections Available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no elections
                available to display.
              </p>
            </motion.div>
          )}

        {/* =================================================
            ELECTION GRID
        ================================================== */}

        {!loading &&
          !error &&
          elections.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {elections.map(
                (election, index) => (
                  <motion.div
                    key={
                      election?._id ||
                      election?.id ||
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.06,
                    }}
                  >
                    <ElectionCard
                      election={election}
                    />
                  </motion.div>
                )
              )}
            </motion.div>
          )}
      </div>
    </MainLayout>
  );
};

export default Elections;