import { motion } from "framer-motion";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Vote,
} from "lucide-react";
import { Link } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
      />

      {/* =====================================================
          DECORATIVE DOTS
      ====================================================== */}

      <motion.div
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="pointer-events-none absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-emerald-400"
      />

      <motion.div
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.5,
        }}
        className="pointer-events-none absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-teal-400"
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

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
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-2">
          {/* =================================================
              LEFT BRAND PANEL
          ================================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500/10 via-slate-900 to-teal-500/10 p-10 lg:flex lg:flex-col lg:justify-between">
            {/* Decorative ring */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-emerald-400/10"
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-teal-400/10"
            />

            <div className="relative">
              {/* LOGO */}

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                  <Vote size={24} />
                </div>

                <div>
                  <p className="text-lg font-black text-white">
                    Online Voting
                  </p>

                  <p className="text-xs text-slate-500">
                    Secure Election Platform
                  </p>
                </div>
              </div>

              {/* HERO */}

              <div className="mt-20">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <Sparkles size={14} />
                  Welcome Back
                </div>

                <h1 className="text-4xl font-black leading-tight text-white">
                  Your voice matters.
                  <br />

                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Make it count.
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                  Sign in to access your account and
                  participate in available elections
                  through the secure voting platform.
                </p>
              </div>
            </div>

            {/* SECURITY INFO */}

            <div className="relative mt-12 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Secure Access
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your account credentials are protected.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN AREA
          ================================================== */}

          <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            {/* MOBILE BRAND */}

            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                <Vote size={22} />
              </div>

              <div>
                <p className="font-black text-white">
                  Online Voting
                </p>

                <p className="text-xs text-slate-500">
                  Secure Election Platform
                </p>
              </div>
            </div>

            {/* LOGIN HEADER */}

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <LockKeyhole size={23} />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your credentials to continue.
              </p>
            </div>

            {/* EXISTING LOGIN FORM */}

            <LoginForm />

            {/* BACK TO HOME */}

            <div className="mt-7 text-center">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-400"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="mt-5 text-center text-xs text-slate-600"
        >
          Secure Digital Elections
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;