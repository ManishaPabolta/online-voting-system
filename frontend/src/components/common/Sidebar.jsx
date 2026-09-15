import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Shield,
  User,
  Vote,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../context/NotificationContext";

const Sidebar = ({
  mobileOpen = false,
  onClose,
}) => {
  const {
    user,
    isAdmin,
    logout,
  } = useAuth();

  const {
    unreadCount,
  } = useNotifications();

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Elections",
      path: "/elections",
      icon: Vote,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      label: "Support",
      path: "/support",
      icon: MessageCircle,
    },
  ];

  if (isAdmin) {
    links.push(
      {
        label: "Reports",
        path: "/reports",
        icon: FileText,
      },
      {
        label: "Admin Panel",
        path: "/admin",
        icon: Shield,
      }
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ======================================
          BRAND
      ====================================== */}

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              rotate: -5,
              scale: 1.05,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/10"
          >
            <Vote
              size={21}
              className="text-slate-950"
            />
          </motion.div>

          <div>
            <h2 className="text-lg font-extrabold text-white">
              Vote
              <span className="text-emerald-400">
                Secure
              </span>
            </h2>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Election Platform
            </p>
          </div>
        </div>

        {/* Mobile close */}

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <X size={19} />
        </button>
      </div>

      {/* ======================================
          USER CARD
      ====================================== */}

      <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-extrabold text-slate-950">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={
                  user?.name ||
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

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ||
                "User"}
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[11px] capitalize text-slate-500">
                {user?.role ||
                  "voter"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          NAVIGATION
      ====================================== */}

      <div className="px-3 pt-6">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
          Navigation
        </p>

        <nav className="space-y-1">
          {links.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              return (
                <motion.div
                  key={item.path}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.04,
                  }}
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({
                      isActive,
                    }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                      }`
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute left-0 h-7 w-0.5 rounded-full bg-emerald-400"
                          />
                        )}

                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                            isActive
                              ? "bg-emerald-500/10"
                              : "bg-transparent group-hover:bg-white/5"
                          }`}
                        >
                          <Icon
                            size={18}
                          />
                        </span>

                        <span className="flex-1">
                          {item.label}
                        </span>

                        {item.badge >
                          0 && (
                          <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                            {item.badge >
                            99
                              ? "99+"
                              : item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            }
          )}
        </nav>
      </div>

      {/* ======================================
          SECURITY CARD
      ====================================== */}

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Shield
              size={17}
              className="text-emerald-400"
            />

            <span className="text-xs font-semibold text-emerald-300">
              Secure Session
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Your voting session is protected
            with secure authentication.
          </p>
        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg">
            <LogOut size={18} />
          </span>

          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ======================================
          DESKTOP SIDEBAR
      ====================================== */}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950 lg:block">
        {sidebarContent}
      </aside>

      {/* ======================================
          MOBILE SIDEBAR
      ====================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-[70] w-[85%] max-w-sm border-r border-white/10 bg-slate-950 shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;