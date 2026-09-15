import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  Vote,
  X,
} from "lucide-react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../context/NotificationContext";

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const {
    unreadCount,
  } = useNotifications();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  // ==========================================
  // CLOSE MOBILE MENU ON RESIZE
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU ON ESCAPE
  // ==========================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const navClass = ({ isActive }) =>
    `relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-slate-300 hover:bg-white/5 hover:text-emerald-400"
    }`;

  const mobileNavClass = ({
    isActive,
  }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-slate-300 hover:bg-white/5"
    }`;

  return (
    <>
      <motion.nav
        initial={{
          y: -80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ======================================
              LOGO
          ====================================== */}

          <Link
            to="/"
            onClick={closeMobile}
            className="group flex shrink-0 items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: -5,
                scale: 1.05,
              }}
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/10"
            >
              <Vote
                size={21}
                className="relative z-10 text-slate-950"
              />

              <motion.div
                animate={{
                  x: ["-120%", "150%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute inset-y-0 w-1/3 skew-x-12 bg-white/30 blur-sm"
              />
            </motion.div>

            <div className="hidden xs:block">
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Vote
                <span className="text-emerald-400">
                  Secure
                </span>
              </h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
                Digital Elections
              </p>
            </div>
          </Link>

          {/* ======================================
              DESKTOP NAV
          ====================================== */}

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink
              to="/elections"
              className={navClass}
            >
              Elections
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  className={navClass}
                >
                  Dashboard
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={navClass}
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* ======================================
              RIGHT ACTIONS
          ====================================== */}

          <div className="hidden items-center gap-2 lg:flex">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className={navClass}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  className="ml-1 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-500/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* Notifications */}

                <Link
                  to="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-all duration-300 hover:bg-white/5 hover:text-emerald-400"
                  aria-label="Notifications"
                >
                  <Bell size={20} />

                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{
                          scale: 0,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-400 px-1 text-[9px] font-extrabold text-slate-950"
                      >
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Profile */}

                <div className="relative ml-1">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (previous) =>
                          !previous
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-extrabold text-slate-950">
                      {user?.profileImage ? (
                        <img
                          src={
                            user.profileImage
                          }
                          alt={
                            user.name ||
                            "Profile"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (
                          user?.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <span className="hidden max-w-24 truncate text-sm font-medium text-slate-200 xl:block">
                      {user?.name ||
                        "User"}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`text-slate-500 transition-transform ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.97,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                          scale: 0.97,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                      >
                        <div className="mb-2 border-b border-white/10 px-3 py-3">
                          <p className="truncate text-sm font-semibold text-white">
                            {user?.name ||
                              "User"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {user?.email ||
                              ""}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-emerald-400"
                        >
                          <User size={17} />
                          Profile
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() =>
                            setProfileOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-emerald-400"
                        >
                          <LayoutDashboard
                            size={17}
                          />
                          Dashboard
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(
                              false
                            );
                            logout();
                          }}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut
                            size={17}
                          />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* ======================================
              MOBILE MENU BUTTON
          ====================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (previous) =>
                  !previous
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-emerald-500/20 hover:text-emerald-400 lg:hidden"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {/* ========================================
            MOBILE MENU
        ======================================== */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              className="overflow-hidden border-t border-white/10 lg:hidden"
            >
              <motion.div
                initial={{
                  y: -10,
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  y: -10,
                }}
                className="mx-auto max-w-7xl space-y-2 px-4 py-4 sm:px-6"
              >
                <NavLink
                  to="/elections"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <Vote size={18} />
                  Elections
                </NavLink>

                {isAuthenticated && (
                  <>
                    <NavLink
                      to="/dashboard"
                      onClick={closeMobile}
                      className={
                        mobileNavClass
                      }
                    >
                      <LayoutDashboard
                        size={18}
                      />
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/profile"
                      onClick={closeMobile}
                      className={
                        mobileNavClass
                      }
                    >
                      <User size={18} />
                      Profile
                    </NavLink>

                    <NavLink
                      to="/notifications"
                      onClick={closeMobile}
                      className={
                        mobileNavClass
                      }
                    >
                      <Bell size={18} />
                      Notifications

                      {unreadCount > 0 && (
                        <span className="ml-auto rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                          {unreadCount >
                          99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </NavLink>

                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        onClick={
                          closeMobile
                        }
                        className={
                          mobileNavClass
                        }
                      >
                        <ShieldCheck
                          size={18}
                        />
                        Admin
                      </NavLink>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        closeMobile();
                        logout();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut
                        size={18}
                      />
                      Logout
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/login"
                      onClick={
                        closeMobile
                      }
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={
                        closeMobile
                      }
                      className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;