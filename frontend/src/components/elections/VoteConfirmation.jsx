import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const VoteConfirmation = ({ voteId }) => {
  const copyVoteId = async () => {
    if (!voteId) return;

    try {
      await navigator.clipboard.writeText(voteId);
      toast.success("Vote tracking ID copied");
    } catch {
      toast.error("Unable to copy tracking ID");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6 text-center shadow-2xl shadow-emerald-500/5 backdrop-blur-xl sm:p-10"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 180,
        }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/20"
      >
        <CheckCircle2 size={44} className="text-white" />
      </motion.div>

      {/* Heading */}
      <h1 className="mt-7 text-3xl font-black text-white sm:text-4xl">
        Vote Successfully Cast
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
        Your vote has been securely recorded in the voting system.
        Keep your tracking ID for your records.
      </p>

      {/* Tracking ID */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
          <ShieldCheck size={17} className="text-emerald-400" />
          Vote Tracking ID
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="min-w-0 flex-1 break-all text-sm font-bold text-emerald-300 sm:text-base">
            {voteId || "Generating..."}
          </p>

          {voteId && (
            <button
              type="button"
              onClick={copyVoteId}
              className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Copy vote tracking ID"
            >
              <Copy size={17} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VoteConfirmation;