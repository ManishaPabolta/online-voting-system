import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Vote,
  Bell,
  ShieldCheck,
  Activity,
  RefreshCw,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";

import StatsCard from "./StatsCard";
import ReportChart from "./ReportChart";

import API from "../../api/axios";
import { getPublicElections } from "../../api/electionApi";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] =
    useState({
      liveElections: 0,
      totalElections: 0,
      notifications: 0,
      verified: false,
      chartData: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  const fetchDashboard = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /*
       * IMPORTANT:
       *
       * /elections is admin-only.
       * Normal users must use:
       *
       * /elections/public
       *
       * Profile can legitimately return 404 when
       * the voter profile has not been created yet.
       *
       * Therefore Promise.allSettled is used instead
       * of Promise.all.
       */

      const results = await Promise.allSettled([
        getPublicElections(),
        API.get("/notifications"),
        API.get("/profile/me"),
      ]);

      // =====================================================
      // ELECTIONS
      // =====================================================

      let elections = [];

      const electionResult = results[0];

      if (electionResult.status === "fulfilled") {
        const response =
          electionResult.value;

        const payload =
          response?.data ?? response;

        if (Array.isArray(payload)) {
          elections = payload;
        } else if (
          Array.isArray(payload?.elections)
        ) {
          elections = payload.elections;
        } else if (
          Array.isArray(payload?.data)
        ) {
          elections = payload.data;
        } else if (
          Array.isArray(
            payload?.data?.elections
          )
        ) {
          elections =
            payload.data.elections;
        }
      } else {
        console.error(
          "DASHBOARD ELECTION ERROR:",
          electionResult.reason
        );
      }

      const liveElections =
        elections.filter(
          (election) =>
            election?.status === "LIVE"
        ).length;

      // =====================================================
      // NOTIFICATIONS
      // =====================================================

      let unreadNotifications = 0;

      const notificationResult =
        results[1];

      if (
        notificationResult.status ===
        "fulfilled"
      ) {
        const response =
          notificationResult.value;

        const payload =
          response?.data ?? response;

        const notifications =
          Array.isArray(
            payload?.notifications
          )
            ? payload.notifications
            : Array.isArray(payload)
            ? payload
            : Array.isArray(
                payload?.data?.notifications
              )
            ? payload.data.notifications
            : [];

        if (
          Number.isFinite(
            Number(payload?.unreadCount)
          )
        ) {
          unreadNotifications = Number(
            payload.unreadCount
          );
        } else {
          unreadNotifications =
            notifications.filter(
              (notification) =>
                !notification?.isRead
            ).length;
        }
      } else {
        console.error(
          "DASHBOARD NOTIFICATION ERROR:",
          notificationResult.reason
        );
      }

      // =====================================================
      // PROFILE
      // =====================================================

      let verified = false;

      const profileResult = results[2];

      if (
        profileResult.status ===
        "fulfilled"
      ) {
        const response =
          profileResult.value;

        const payload =
          response?.data ?? response;

        const profile =
          payload?.profile ??
          payload?.data?.profile ??
          null;

        /*
         * Backend profile uses isEligible.
         * Do not invent another verification field.
         */

        verified = Boolean(
          profile?.isEligible
        );
      } else {
        const profileError =
          profileResult.reason;

        /*
         * 404 means profile does not exist yet.
         * This is not a dashboard failure.
         */

        if (
          profileError?.response?.status ===
          404
        ) {
          verified = false;
        } else {
          console.error(
            "DASHBOARD PROFILE ERROR:",
            profileError
          );
        }
      }

      // =====================================================
      // CHART DATA
      // =====================================================
      //
      // Do NOT create fake vote numbers.
      //
      // Only use vote data if backend actually
      // provides totalVotes.
      //

      const chartData = elections
        .filter((election) =>
          Object.prototype.hasOwnProperty.call(
            election || {},
            "totalVotes"
          )
        )
        .map((election) => ({
          name:
            election?.title?.length > 18
              ? `${election.title.slice(
                  0,
                  18
                )}...`
              : election?.title ||
                "Election",

          votes: Number(
            election?.totalVotes || 0
          ),
        }));

      setDashboardData({
        liveElections,
        totalElections:
          elections.length,
        notifications:
          unreadNotifications,
        verified,
        chartData,
      });

      /*
       * Show an error only when the important
       * election request itself fails.
       */

      if (
        electionResult.status ===
        "rejected" &&
        electionResult.reason?.response
          ?.status !== 429
      ) {
        toast.error(
          electionResult.reason?.response
            ?.data?.message ||
            "Unable to load elections."
        );
      }
    } catch (error) {
      console.error(
        "USER DASHBOARD ERROR:",
        error
      );

      if (
        error?.response?.status !== 429
      ) {
        toast.error(
          error?.response?.data?.message ||
            "Dashboard load failed."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <RefreshCw
              size={25}
              className="animate-spin text-emerald-400"
            />
          </div>

          <p className="text-sm font-medium text-slate-400">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
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
      className="space-y-8"
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Voter Portal
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Track elections, notifications and
            your eligibility status.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fetchDashboard(true)
          }
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

      {/* =================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Live Elections"
          value={
            dashboardData.liveElections
          }
          icon={
            <Activity size={24} />
          }
          color="emerald"
        />

        <StatsCard
          title="Total Elections"
          value={
            dashboardData.totalElections
          }
          icon={
            <Vote size={24} />
          }
          color="teal"
        />

        <StatsCard
          title="Unread Notifications"
          value={
            dashboardData.notifications
          }
          icon={
            <Bell size={24} />
          }
          color="emerald"
        />

        <StatsCard
          title="Eligibility Status"
          value={
            dashboardData.verified
              ? "Verified"
              : "Pending"
          }
          icon={
            <ShieldCheck size={24} />
          }
          color={
            dashboardData.verified
              ? "emerald"
              : "teal"
          }
        />
      </div>

      {/* =================================================
          STATUS CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Profile Eligibility
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {dashboardData.verified
                  ? "Your voter profile is eligible."
                  : "Your voter profile is not eligible yet. Complete the required verification process."}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-400">
              <Clock3 size={21} />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Election Status
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {dashboardData.liveElections >
                0
                  ? `${dashboardData.liveElections} election${
                      dashboardData.liveElections ===
                      1
                        ? ""
                        : "s"
                    } currently live.`
                  : "There are no live elections right now."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =================================================
          REPORT
      ================================================== */}

      {dashboardData.chartData.length >
        0 && (
        <ReportChart
          data={dashboardData.chartData}
        />
      )}
    </motion.div>
  );
};

export default UserDashboard;