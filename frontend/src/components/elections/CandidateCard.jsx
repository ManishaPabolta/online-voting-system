import { motion } from "framer-motion";
import { CheckCircle2, Vote } from "lucide-react";

const CandidateCard = ({ candidate, selected, onSelect }) => {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(candidate)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ${
        selected
          ? "border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/10"
          : "border-white/10 bg-white/[0.04] hover:border-teal-400/50 hover:bg-white/[0.07]"
      }`}
    >
      {/* Selected glow */}
      {selected && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
      )}

      <div className="relative">
        {/* Candidate Image */}
        <div className="flex justify-center">
          <div
            className={`relative rounded-full p-1 transition-all duration-300 ${
              selected
                ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                : "bg-white/10 group-hover:bg-gradient-to-br group-hover:from-emerald-400/60 group-hover:to-teal-500/60"
            }`}
          >
            <img
              src={
                candidate?.image ||
                candidate?.photo ||
                "https://via.placeholder.com/300?text=Candidate"
              }
              alt={candidate?.name || "Candidate"}
              className="h-32 w-32 rounded-full object-cover border-4 border-slate-900"
            />

            {selected && (
              <div className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500">
                <CheckCircle2 size={20} className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Candidate Info */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            {candidate?.name || "Unnamed Candidate"}
          </h2>

          {candidate?.party && (
            <p className="mt-2 text-sm font-medium text-slate-400">
              {candidate.party}
            </p>
          )}
        </div>

        {/* Selection State */}
        <div className="mt-6 flex justify-center">
          {selected ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
              <CheckCircle2 size={16} />
              Selected
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition group-hover:border-teal-400/30 group-hover:text-teal-300">
              <Vote size={16} />
              Select Candidate
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default CandidateCard;