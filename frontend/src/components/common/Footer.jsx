import {
  ArrowUpRight,
  ShieldCheck,
  Vote,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import { motion } from "framer-motion";

const Footer = () => {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      {/* Background glow */}

      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          {/* Brand */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/10 transition-transform duration-300 group-hover:scale-105">
                <Vote
                  size={22}
                  className="text-slate-950"
                />
              </div>

              <div>
                <h2 className="text-lg font-extrabold">
                  Vote
                  <span className="text-emerald-400">
                    Secure
                  </span>
                </h2>

                <p className="text-xs text-slate-500">
                  Digital Elections
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              A secure and transparent digital
              voting platform designed for
              trustworthy elections.
            </p>
          </motion.div>

          {/* Quick Links */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Quick Links
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Link
                to="/"
                className="text-slate-400 transition-colors hover:text-emerald-400"
              >
                Home
              </Link>

              <Link
                to="/elections"
                className="text-slate-400 transition-colors hover:text-emerald-400"
              >
                Elections
              </Link>

              <Link
                to="/faq"
                className="text-slate-400 transition-colors hover:text-emerald-400"
              >
                FAQ
              </Link>

              <Link
                to="/support"
                className="text-slate-400 transition-colors hover:text-emerald-400"
              >
                Support
              </Link>
            </div>
          </motion.div>

          {/* Security */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2.5">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Secure Voting
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Your vote matters.
                  </p>
                </div>
              </div>

              <Link
                to="/elections"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Explore Elections
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-slate-500">
            © {currentYear} VoteSecure. All
            rights reserved.
          </p>

          <p className="text-xs text-slate-600">
            Secure • Transparent • Reliable
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;