import { motion } from "framer-motion";
import { ShieldCheck, Vote, Sparkles } from "lucide-react";

import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
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
            x: [0, -70, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          
          {/* Left section */}
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
              Secure Online Voting
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Create your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                voter account.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Register securely and get access to your online voting
              dashboard. Keep your account information accurate for a
              smooth voting experience.
            </p>

            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <ShieldCheck className="text-emerald-400" size={24} />

                <h3 className="mt-3 font-bold text-white">
                  Secure Registration
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your registration is protected with secure
                  authentication.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <Vote className="text-teal-400" size={24} />

                <h3 className="mt-3 font-bold text-white">
                  Vote Online
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Access eligible elections from your dashboard.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Register form */}
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
                <RegisterForm />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Register;