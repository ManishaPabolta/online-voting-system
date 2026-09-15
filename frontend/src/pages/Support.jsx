import { motion } from "framer-motion";
import {
  Headphones,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import SupportChat from "../components/support/SupportChat";

const Support = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
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
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

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
                <Headphones size={28} />
              </motion.div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Support Center
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Need help? Connect with the support team through
                  the chat below.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <MessageCircle
                  size={22}
                  className="text-teal-400"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <ShieldCheck
                  size={22}
                  className="text-emerald-400"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= SUPPORT CHAT ================= */}
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
          <SupportChat />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Support;