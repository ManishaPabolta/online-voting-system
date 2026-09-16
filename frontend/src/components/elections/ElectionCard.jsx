import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Vote,
} from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  DRAFT:
    "border-slate-500/30 bg-slate-500/10 text-slate-300",

  UPCOMING:
    "border-teal-400/30 bg-teal-500/10 text-teal-300",

  LIVE:
    "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",

  COMPLETED:
    "border-sky-400/30 bg-sky-500/10 text-sky-300",

  CANCELLED:
    "border-red-400/30 bg-red-500/10 text-red-300",
};

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80";

const formatDate = (date) => {
  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatElectionType = (type) => {
  if (!type) {
    return "Election";
  }

  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ElectionCard = ({ election }) => {
  const status =
    election?.currentState ||
    election?.status ||
    "DRAFT";

  const electionId = election?._id;

  const bannerImage =
    election?.bannerImage || DEFAULT_BANNER;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      {/* ================= IMAGE ================= */}

      <div className="relative h-48 overflow-hidden">
        <img
          src={bannerImage}
          alt={election?.title || "Election"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_BANNER;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Status */}
        <div className="absolute left-4 top-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              statusStyles[status] || statusStyles.DRAFT
            }`}
          >
            {status}
          </span>
        </div>

        {/* Election Type */}
        {election?.electionType && (
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {formatElectionType(election.electionType)}
            </span>
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-6">
        {/* Title */}
        <h2 className="line-clamp-2 text-xl font-bold text-white transition group-hover:text-emerald-300 sm:text-2xl">
          {election?.title || "Untitled Election"}
        </h2>

        {/* Description */}
        {election?.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            {election.description}
          </p>
        )}

        {/* ================= DETAILS ================= */}

        <div className="mt-5 space-y-3">
          {/* Start Date */}
          {election?.startDate && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CalendarDays size={17} />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Starts
                </p>

                <p className="font-medium">
                  {formatDate(election.startDate)}
                </p>
              </div>
            </div>
          )}

          {/* End Date */}
          {election?.endDate && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                <Clock3 size={17} />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Ends
                </p>

                <p className="font-medium">
                  {formatDate(election.endDate)}
                </p>
              </div>
            </div>
          )}

          {/* Candidates */}
          {Array.isArray(election?.candidates) && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                <Vote size={17} />
              </span>

              <div>
                <p className="text-xs text-slate-500">
                  Candidates
                </p>

                <p className="font-medium">
                  {election.candidates.length} candidate
                  {election.candidates.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= ACTION ================= */}

        {electionId ? (
          <Link
            to={`/elections/${electionId}`}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/20"
          >
            View Election

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        ) : (
          <div className="mt-6 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-500">
            Election unavailable
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default ElectionCard;