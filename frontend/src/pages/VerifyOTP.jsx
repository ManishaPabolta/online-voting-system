import { motion } from "framer-motion";
import {
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import OTPForm from "../components/auth/OTPForm";

const VerifyOTP = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 70, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_38%)]" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          {/* ================= LEFT INFO ================= */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="hidden lg:block"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              <Sparkles size={16} />
              Secure Verification
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Verify your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                account.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Enter the verification code sent to you to securely
              complete the authentication process.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                  <KeyRound size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    OTP Verification
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Confirm your account using the verification code.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                <div className="rounded-xl bg-teal-500/10 p-3 text-teal-400">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    Protected Authentication
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Verification helps protect access to your account.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= OTP FORM ================= */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="w-full"
          >
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-1 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
              <div className="rounded-[22px] border border-white/5 bg-slate-950/70 p-5 sm:p-8">
                <div className="mb-6 flex justify-center lg:hidden">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
                  >
                    <CheckCircle2 size={28} />
                  </motion.div>
                </div>

                <OTPForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;