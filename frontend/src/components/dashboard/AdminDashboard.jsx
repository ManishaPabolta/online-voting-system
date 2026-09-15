import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Vote,
  ShieldCheck,
  FileText,
  RefreshCw,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";

import StatsCard from "./StatsCard";
import ReportChart from "./ReportChart";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalVotes: 0,
    liveElections: 0,
    totalElections: 0,
    chartData: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [usersResponse, electionsResponse] =
        await Promise.all([
          API.get("/users"),
          API.get("/elections"),
        ]);

      /*
       * Backend response can be wrapped inside data.
       * Keep this defensive so the dashboard doesn't
       * break if apiResponse structure changes slightly.
       */

      const usersPayload =
        usersResponse?.data?.data ||
        usersResponse?.data ||
        {};

      const electionsPayload =
        electionsResponse?.data?.data ||
        electionsResponse?.data ||
        {};

      const users =
        usersPayload?.users ||
        [];

      const elections =
        electionsPayload?.elections ||
        [];

      /*
       * ============================
       * USERS
       * ============================
       */

      const totalUsers = Array.isArray(users)
        ? users.length
        : Number(usersPayload?.count || 0);

      /*
       * ============================
       * ELECTIONS
       * ============================
       */

      const liveElections = elections.filter(
        (election) =>
          election?.status === "LIVE"
      ).length;

      /*
       * ============================
       * TOTAL VOTES
       * ============================
       *
       * Election.totalVotes is used only
       * if the backend provides it.
       *
       * Otherwise we don't invent a number.
       */

      const totalVotes = elections.reduce(
        (total, election) => {
          const votes = Number(
            election?.totalVotes || 0
          );

          return total + votes;
        },
        0
      );

      /*
       * ============================
       * CHART
       * ============================
       */

      const chartData = elections.map(
        (election) => ({
          name:
            election?.title?.length > 18
              ? `${election.title.slice(0, 18)}...`
              : election?.title || "Election",

          votes: Number(
            election?.totalVotes || 0
          ),
        })
      );

      setDashboardData({
        totalUsers,
        totalVotes,
        liveElections,
        totalElections: elections.length,
        chartData,
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      if (error?.response?.status !== 429) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <RefreshCw
              size={25}
              className="animate-spin text-emerald-400"
            />
          </div>

          <p className="text-sm font-medium text-slate-400">
            Loading admin dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Administration
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Manage elections and monitor voting activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* =========================================
          STATS
      ========================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<Users size={24} />}
          color="emerald"
        />

        <StatsCard
          title="Total Votes"
          value={dashboardData.totalVotes}
          icon={<Vote size={24} />}
          color="teal"
        />

        <StatsCard
          title="Live Elections"
          value={dashboardData.liveElections}
          icon={<Activity size={24} />}
          color="emerald"
        />

        <StatsCard
          title="Total Elections"
          value={dashboardData.totalElections}
          icon={<FileText size={24} />}
          color="teal"
        />
      </div>

      {/* =========================================
          SYSTEM STATUS
      ========================================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Security
              </p>

              <p className="mt-1 font-semibold text-white">
                Authentication Protected
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Voting System
              </p>

              <p className="mt-1 font-semibold text-white">
                System Operational
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <Clock3 size={21} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Live Elections
              </p>

              <p className="mt-1 font-semibold text-white">
                {dashboardData.liveElections} Running
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================
          REPORT CHART
      ========================================= */}

      <ReportChart
        data={dashboardData.chartData}
      />
    </motion.div>
  );
};

export default AdminDashboard;