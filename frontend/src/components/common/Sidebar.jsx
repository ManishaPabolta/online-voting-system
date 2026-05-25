import {
  LayoutDashboard,
  Vote,
  User,
  Bell,
  MessageCircle,
  FileText,
  Shield,
} from "lucide-react";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-white/10 p-6">

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-blue-500">
          VoteSecure
        </h1>

        <p className="text-gray-400 mt-2 text-sm">
          Secure Digital Elections
        </p>

      </div>

      <nav className="flex flex-col gap-3">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/elections"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <Vote size={20} />
          Elections
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <User size={20} />
          Profile
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <Bell size={20} />
          Notifications
        </Link>

        <Link
          to="/support"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <MessageCircle size={20} />
          Support
        </Link>

        <Link
          to="/reports"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <FileText size={20} />
          Reports
        </Link>

        <Link
          to="/admin"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
        >
          <Shield size={20} />
          Admin
        </Link>

      </nav>

    </aside>
  );
};

export default Sidebar;