import { motion } from "framer-motion";
import {
  BellRing,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import NotificationPanel from "../components/notifications/NotificationPanel";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-5xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

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
            duration: 0.45,
          }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
                <Sparkles size={14} />
                Updates
              </div>

              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, -8, 8, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
                >
                  <BellRing size={24} />
                </motion.div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Notifications
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Stay updated with your latest
                    election activities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            NOTIFICATION PANEL
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.45,
          }}
        >
          <NotificationPanel />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;