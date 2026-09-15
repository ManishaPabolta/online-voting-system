import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Vote,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Face Verification",
    description:
      "Secure voter identity verification helps ensure that the right voter participates in the election.",
    badge: "Identity",
  },
  {
    icon: Vote,
    title: "Secure Voting",
    description:
      "Cast your vote through a protected voting process designed for reliable and secure participation.",
    badge: "Protected",
  },
  {
    icon: Users,
    title: "Election Results",
    description:
      "Access election information and results through a clear and transparent voting experience.",
    badge: "Transparent",
  },
];

const Home = () => {
  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        {/* =====================================================
            BACKGROUND DECORATIONS
        ====================================================== */}

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
        />

        {/* =====================================================
            HERO SECTION
        ====================================================== */}

        <section className="relative grid min-h-[calc(100vh-120px)] items-center gap-14 py-14 lg:grid-cols-2 lg:gap-20 lg:py-20">
          {/* ===================================================
              LEFT CONTENT
          ==================================================== */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* BADGE */}

            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-300 shadow-lg shadow-emerald-500/5">
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />

                Secure Digital Elections

                <Sparkles size={14} />
              </div>
            </motion.div>

            {/* HEADING */}

            <motion.h1
              variants={itemVariants}
              className="mt-7 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl"
            >
              Your Voice.
              <br />

              <span className="relative inline-block">
                Your Vote.
                <motion.span
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: "100%",
                  }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                  }}
                  className="absolute -bottom-2 left-0 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                />
              </span>

              <br />

              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                Your Choice.
              </span>
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg"
            >
              A modern online voting platform designed
              to make election participation secure,
              simple, and accessible from anywhere.
            </motion.p>

            {/* BUTTONS */}

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
              >
                <span className="relative z-10">
                  Get Started
                </span>

                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
              </Link>

              <Link
                to="/elections"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 font-bold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-500/5"
              >
                View Elections

                <ChevronRight
                  size={18}
                  className="text-emerald-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            {/* TRUST POINTS */}

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
            >
              {[
                "Secure voting",
                "Verified voters",
                "Transparent process",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ===================================================
              RIGHT VISUAL
          ==================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative mx-auto w-full max-w-xl"
          >
            {/* OUTER GLOW */}

            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-10 rounded-full bg-emerald-500/20 blur-3xl"
            />

            {/* MAIN CARD */}

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7"
            >
              {/* CARD HEADER */}

              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                    <Vote
                      size={22}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      Digital Election
                    </p>

                    <p className="text-xs text-slate-500">
                      Secure voting platform
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Secure
                </div>
              </div>

              {/* CENTER VOTING VISUAL */}

              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden">
                {/* ROTATING RINGS */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-64 w-64 rounded-full border border-dashed border-emerald-400/20"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-48 w-48 rounded-full border border-teal-400/20"
                />

                {/* FLOATING DOTS */}

                <motion.span
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute left-[18%] top-[25%] h-2 w-2 rounded-full bg-emerald-400"
                />

                <motion.span
                  animate={{
                    y: [0, 15, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                  className="absolute right-[20%] top-[35%] h-2 w-2 rounded-full bg-teal-400"
                />

                {/* CENTER ICON */}

                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 shadow-2xl shadow-emerald-500/20"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
                    <Vote
                      size={38}
                      className="text-white"
                    />
                  </div>
                </motion.div>
              </div>

              {/* BOTTOM STATUS */}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck size={17} />
                    <span className="text-xs font-bold">
                      Verification
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Identity Protected
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-teal-400">
                    <Vote size={17} />
                    <span className="text-xs font-bold">
                      Voting
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    Secure Process
                  </p>
                </div>
              </div>
            </motion.div>

            {/* FLOATING SECURITY CARD */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1,
              }}
              className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck
                  size={18}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Secure
                </p>
                <p className="text-[11px] text-slate-500">
                  Protected voting
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section className="relative pb-16 pt-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-8"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
              Why choose our platform
            </p>

            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Built for secure participation
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/20 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-emerald-500/5"
                >
                  {/* HOVER GLOW */}

                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                        <Icon size={24} />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      Learn more
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;