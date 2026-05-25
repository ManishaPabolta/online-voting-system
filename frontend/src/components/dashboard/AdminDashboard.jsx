import {
  Users,
  Vote,
  Shield,
  FileText,
} from "lucide-react";

import StatsCard from "./StatsCard";

import ReportChart from "./ReportChart";

const AdminDashboard = () => {
  return (
    <div className="p-6">

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Manage Elections &
          Monitor System
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Total Users"
          value="15,230"
          icon={<Users size={32} />}
          color="from-indigo-600 to-blue-600"
        />

        <StatsCard
          title="Votes Casted"
          value="10,845"
          icon={<Vote size={32} />}
          color="from-pink-600 to-rose-600"
        />

        <StatsCard
          title="Security Alerts"
          value="4"
          icon={<Shield size={32} />}
          color="from-red-600 to-orange-600"
        />

        <StatsCard
          title="Reports"
          value="28"
          icon={<FileText size={32} />}
          color="from-green-600 to-lime-600"
        />

      </div>

      <div className="mt-10">

        <ReportChart />

      </div>

    </div>
  );
};

export default AdminDashboard;