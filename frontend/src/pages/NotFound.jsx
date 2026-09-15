import { motion } from "framer-motion";
import {
  ArrowLeft,
  Compass,
  Home,
  SearchX,
} from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      {/* =====================================================
          BACKGROUND GLOWS
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
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.65,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        {/* ICON */}

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/10 shadow-xl shadow-emerald-500/10"
        >
          <SearchX
            size={38}
            className="text-emerald-400"
          />
        </motion.div>

        {/* 404 */}

        <div className="relative mt-8">
          <motion.h1
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
            className="select-none text-[100px] font-black leading-none tracking-tighter text-transparent sm:text-[150px]"
            style={{
              WebkitTextStroke:
                "2px rgba(16, 185, 129, 0.35)",
            }}
          >
            404
          </motion.h1>

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: "180px",
            }}
            transition={{
              delay: 0.7,
              duration: 0.7,
            }}
            className="mx-auto mt-3 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
          />
        </div>

        {/* HEADING */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.5,
          }}
          className="mt-8 text-3xl font-black tracking-tight text-white sm:text-4xl"
        >
          Page Not Found
        </motion.h2>

        {/* DESCRIPTION */}

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.5,
          }}
          className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base"
        >
          The page you're looking for doesn't exist,
          may have been moved, or is no longer
          available.
        </motion.p>

        {/* BUTTON */}

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
            delay: 0.55,
            duration: 0.5,
          }}
          className="mt-9"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
          >
            <Home size={18} />

            Back To Home

            <ArrowLeft
              size={17}
              className="order-first transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
        </motion.div>

        {/* BOTTOM DECORATION */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-600"
        >
          <Compass
            size={14}
            className="text-emerald-500/60"
          />

          <span>
            Let's get you back on the right path.
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;