import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon,
  color = "emerald",
}) => {
  const themes = {
    emerald: {
      wrapper:
        "from-emerald-500/10 to-emerald-400/5",
      icon:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
      glow:
        "bg-emerald-500/10",
    },

    teal: {
      wrapper:
        "from-teal-500/10 to-teal-400/5",
      icon:
        "border-teal-400/20 bg-teal-400/10 text-teal-400",
      glow:
        "bg-teal-500/10",
    },
  };

  const theme =
    themes[color] || themes.emerald;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.35,
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${theme.wrapper} bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl`}
    >
      {/* Glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${theme.glow} blur-3xl transition-all duration-500 group-hover:scale-150`}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${theme.icon} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      {/* Bottom */}
      <div className="relative mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-xs text-slate-500">
          Live system data
        </span>

        <ArrowUpRight
          size={15}
          className="text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400"
        />
      </div>
    </motion.div>
  );
};

export default StatsCard;