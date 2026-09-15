import { motion } from "framer-motion";
import {
  BarChart3,
  FileBarChart,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ReportChart from "../components/dashboard/ReportChart";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ================= PAGE HEADER ================= */}
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
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl sm:p-8"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
              >
                <BarChart3 size={28} />
              </motion.div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Sparkles size={13} />
                    Analytics
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Election Reports
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-base">
                  View election analytics and voting statistics.
                </p>
              </div>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:block">
              <FileBarChart
                size={26}
                className="text-teal-400"
              />
            </div>
          </div>
        </motion.div>

        {/* ================= REPORT CHART ================= */}
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
            duration: 0.55,
            delay: 0.1,
          }}
        >
          <ReportChart />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;