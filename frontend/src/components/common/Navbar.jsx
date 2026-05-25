import {
  Bell,
  LogOut,
  Vote,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <div className="bg-blue-600 p-2 rounded-xl">
            <Vote size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              VoteSecure
            </h1>

            <p className="text-xs text-gray-400">
              Online Voting System
            </p>
          </div>

        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/elections"
            className="hover:text-blue-400 transition"
          >
            Elections
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-400 transition"
              >
                Dashboard
              </Link>

              <Link
                to="/notifications"
                className="relative"
              >

                <Bell size={22} />

                <span className="absolute -top-2 -right-2 bg-red-500 text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  3
                </span>

              </Link>

              <Link
                to="/profile"
                className="bg-white/10 p-2 rounded-full"
              >
                <User size={20} />
              </Link>

              <button
                onClick={logoutHandler}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl flex items-center gap-2 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;