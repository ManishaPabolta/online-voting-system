import {
  Vote,
  Users,
  Bell,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import StatsCard from "./StatsCard";
import ReportChart from "./ReportChart";

import API from "../../api/axios";

const UserDashboard = () => {

  const [dashboardData, setDashboardData] =
    useState({
      activeElections: 0,
      totalVotes: 0,
      notifications: 0,
      verified: false,
      chartData: [],
    });

  const [loading, setLoading] =
    useState(true);

  /**
   * ================= FETCH DASHBOARD =================
   */
  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        /**
         * API CALLS
         */
        const [
          electionRes,
          voteRes,
          notificationRes,
          profileRes,
        ] = await Promise.all([

          API.get("/elections"),

          API.get("/vote/status"),

          API.get("/notifications"),

          API.get("/profile/me"),
        ]);

        /**
         * ACTIVE ELECTIONS
         */
        const elections =
          electionRes.data?.elections || [];

        const activeElections =
          elections.filter(
            (election) =>
              election.status ===
              "active"
          ).length;

        /**
         * TOTAL VOTES
         */
        const totalVotes =
          voteRes.data?.votes
            ?.length || 0;

        /**
         * NOTIFICATIONS
         */
        const notifications =
          notificationRes.data
            ?.notifications
            ?.length || 0;

        /**
         * VERIFIED STATUS
         */
        const verified =
          profileRes.data?.profile
            ?.isVerified || false;

        /**
         * CHART DATA
         */
        const chartData =
          elections.map(
            (election) => ({
              name:
                election.title,
              votes:
                election.totalVotes ||
                0,
            })
          );

        /**
         * SET STATE
         */
        setDashboardData({
          activeElections,
          totalVotes,
          notifications,
          verified,
          chartData,
        });

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Dashboard Load Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  /**
   * ================= AUTO REFRESH =================
   */
  useEffect(() => {

    fetchDashboard();

    /**
     * AUTO UPDATE EVERY 5 SEC
     */
    const interval =
      setInterval(() => {
        fetchDashboard();
      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  /**
   * ================= LOADING =================
   */
  if (loading) {

    return (
      <div className="p-10 text-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          User Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome to Secure
          Online Voting
        </p>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Active Elections"
          value={
            dashboardData.activeElections
          }
          icon={<Vote size={32} />}
          color="from-blue-600 to-cyan-600"
        />

        <StatsCard
          title="Total Votes"
          value={
            dashboardData.totalVotes
          }
          icon={<Users size={32} />}
          color="from-purple-600 to-pink-600"
        />

        <StatsCard
          title="Notifications"
          value={
            dashboardData.notifications
          }
          icon={<Bell size={32} />}
          color="from-orange-500 to-red-500"
        />

        <StatsCard
          title="Verified Status"
          value={
            dashboardData.verified
              ? "YES"
              : "NO"
          }
          icon={
            <ShieldCheck size={32} />
          }
          color={
            dashboardData.verified
              ? "from-green-600 to-emerald-600"
              : "from-red-600 to-pink-600"
          }
        />

      </div>

      {/* ================= CHART ================= */}
      <div className="mt-10">

        <ReportChart
          data={
            dashboardData.chartData
          }
        />

      </div>

    </div>
  );
};

export default UserDashboard;