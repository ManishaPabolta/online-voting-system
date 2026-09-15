import { motion } from "framer-motion";
import {
  ShieldCheck,
  Vote,
} from "lucide-react";

const Loader = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
      {/* Background Glow */}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -20, 0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-20 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-24 w-24 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 border-r-teal-400"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/20"
            >
              <Vote
                size={28}
                className="text-slate-950"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
          className="mt-7 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Vote
              <span className="text-emerald-400">
                Secure
              </span>
            </h1>

            <ShieldCheck
              size={20}
              className="text-emerald-400"
            />
          </div>

          <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
            Secure Online Voting
          </p>
        </motion.div>

        {/* Loading Bar */}

        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{
              x: "300%",
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
          />
        </div>

        <motion.p
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
          className="mt-4 text-sm text-slate-500"
        >
          Securing your session...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;