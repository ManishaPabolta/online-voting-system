import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  getAllElections,
  createElection,
  deleteElection,
  updateElection,
  publishElection,
  cancelElection,
} from "../api/electionApi";

import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../api/candidateApi";

import API from "../api/axios";

/* =========================================================
   CONSTANTS
========================================================= */

const INITIAL_ELECTION_FORM = {
  title: "",
  description: "",
  electionType: "OTHER",
  startDate: "",
  endDate: "",
  bannerImage: "",
  instructions: "",
  allowResultsBeforeEnd: false,
};

const INITIAL_CANDIDATE_FORM = {
  name: "",
  party: "",
  symbol: "",
  photo: "",
  manifesto: "",
  biography: "",
  experience: "",
  position: "",
  isActive: true,
};

const ELECTION_TYPES = [
  "PRESIDENTIAL",
  "PARLIAMENTARY",
  "ASSEMBLY",
  "LOCAL",
  "COLLEGE",
  "ORGANIZATION",
  "OTHER",
];

const LOCKED_STATUSES = [
  "LIVE",
  "COMPLETED",
  "CANCELLED",
];

const VERIFICATION_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
];

const STATUS_STYLES = {
  DRAFT: {
    label: "Draft",
    className:
      "border-slate-400/20 bg-slate-500/10 text-slate-300",
  },

  UPCOMING: {
    label: "Upcoming",
    className:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
  },

  LIVE: {
    label: "Live",
    className:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  },

  COMPLETED: {
    label: "Completed",
    className:
      "border-teal-400/20 bg-teal-500/10 text-teal-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className:
      "border-red-400/20 bg-red-500/10 text-red-300",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const getElectionsFromResponse = (response) => {
  const data = response?.data || response;

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.elections)) {
    return data.elections;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getCandidatesFromResponse = (response) => {
  const data = response?.data || response;

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.candidates)) {
    return data.candidates;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getUsersFromResponse = (response) => {
  const data = response?.data || response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const formatDate = (date) => {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const offset = parsedDate.getTimezoneOffset();

  const localDate = new Date(
    parsedDate.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const getStatus = (election) => {
  const status = election?.status?.toUpperCase();

  return (
    STATUS_STYLES[status] ||
    STATUS_STYLES.DRAFT
  );
};

const isElectionLocked = (election) => {
  return LOCKED_STATUSES.includes(
    election?.status?.toUpperCase()
  );
};

const getVerificationStatus = (user) => {
  const status =
    user?.voterVerificationStatus ||
    user?.voterProfile?.verificationStatus ||
    "NOT_SUBMITTED";

  return String(status).toUpperCase();
};

const getVerificationStyle = (status) => {
  switch (status) {
    case "VERIFIED":
      return {
        label: "Verified",
        className:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
      };

    case "REJECTED":
      return {
        label: "Rejected",
        className:
          "border-red-400/20 bg-red-500/10 text-red-300",
      };

    case "PENDING":
      return {
        label: "Pending",
        className:
          "border-amber-400/20 bg-amber-500/10 text-amber-300",
      };

    default:
      return {
        label: "Not Submitted",
        className:
          "border-slate-400/20 bg-slate-500/10 text-slate-400",
      };
  }
};

/* =========================================================
   REUSABLE FORM COMPONENTS
========================================================= */

const FieldLabel = ({
  children,
  required = false,
}) => (
  <label className="mb-2 block text-sm font-semibold text-slate-300">
    {children}

    {required && (
      <span className="ml-1 text-red-400">
        *
      </span>
    )}
  </label>
);

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const Textarea = ({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
}) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

/* =========================================================
   CANDIDATE FORM
========================================================= */

const CandidateForm = ({
  election,
  candidateForm,
  setCandidateForm,
  editingCandidateId,
  candidateSubmitting,
  onSubmit,
  onCancel,
}) => {
  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setCandidateForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: "auto",
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      className="overflow-hidden"
    >
      <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.035] p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <UserPlus
                  size={18}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h4 className="font-bold text-white">
                  {editingCandidateId
                    ? "Edit Candidate"
                    : "Add Candidate / Voting Option"}
                </h4>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add as many voting options as required.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={candidateSubmitting}
            className="rounded-xl border border-white/10 p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={(event) =>
            onSubmit(event, election._id)
          }
          className="space-y-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>
                Candidate Name
              </FieldLabel>

              <Input
                name="name"
                value={candidateForm.name}
                onChange={handleChange}
                placeholder="Enter candidate name"
                disabled={candidateSubmitting}
              />
            </div>

            <div>
              <FieldLabel>
                Position
              </FieldLabel>

              <Input
                name="position"
                value={candidateForm.position}
                onChange={handleChange}
                placeholder="e.g. President"
                disabled={candidateSubmitting}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel>
                Candidate Photo URL
              </FieldLabel>

              <div className="relative">
                <ImageIcon
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="url"
                  name="photo"
                  value={candidateForm.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  disabled={candidateSubmitting}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <FieldLabel>
                Party
              </FieldLabel>

              <Input
                name="party"
                value={candidateForm.party}
                onChange={handleChange}
                placeholder="Optional"
                disabled={candidateSubmitting}
              />
            </div>
          </div>

          <div>
            <FieldLabel>
              Symbol
            </FieldLabel>

            <Input
              name="symbol"
              value={candidateForm.symbol}
              onChange={handleChange}
              placeholder="Optional symbol or symbol URL"
              disabled={candidateSubmitting}
            />
          </div>

          <div>
            <FieldLabel>
              Manifesto
            </FieldLabel>

            <Textarea
              name="manifesto"
              value={candidateForm.manifesto}
              onChange={handleChange}
              placeholder="Candidate manifesto"
              rows={4}
              disabled={candidateSubmitting}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <FieldLabel>
                Biography
              </FieldLabel>

              <Textarea
                name="biography"
                value={candidateForm.biography}
                onChange={handleChange}
                placeholder="Candidate biography"
                rows={4}
                disabled={candidateSubmitting}
              />
            </div>

            <div>
              <FieldLabel>
                Experience
              </FieldLabel>

              <Textarea
                name="experience"
                value={candidateForm.experience}
                onChange={handleChange}
                placeholder="Candidate experience"
                rows={4}
                disabled={candidateSubmitting}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <input
              type="checkbox"
              name="isActive"
              checked={candidateForm.isActive}
              onChange={handleChange}
              disabled={candidateSubmitting}
              className="mt-1 h-4 w-4 accent-emerald-500"
            />

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Active Candidate
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Active candidates are available for voting.
              </p>
            </div>
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={candidateSubmitting}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                candidateSubmitting ||
                !candidateForm.name.trim()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {candidateSubmitting ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : editingCandidateId ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {candidateSubmitting
                ? "Saving..."
                : editingCandidateId
                ? "Update Candidate"
                : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* =========================================================
   CANDIDATE ITEM
========================================================= */

const CandidateItem = ({
  candidate,
  onEdit,
  onDelete,
  actionId,
  readOnly,
}) => {
  const isLoading =
    actionId === candidate?._id;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
      }}
      className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {candidate?.photo ? (
            <img
              src={candidate.photo}
              alt={candidate.name || "Candidate"}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <Users size={22} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="break-words font-bold text-white">
              {candidate?.name ||
                "Unnamed Candidate"}
            </h5>

            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${
                candidate?.isActive
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-400/20 bg-slate-500/10 text-slate-500"
              }`}
            >
              {candidate?.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          {candidate?.position && (
            <p className="mt-1 text-xs text-slate-500">
              {candidate.position}
            </p>
          )}

          {candidate?.party && (
            <p className="mt-1 text-xs font-medium text-teal-400">
              {candidate.party}
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => onEdit(candidate)}
              disabled={isLoading}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-emerald-400/20 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
              title="Edit candidate"
            >
              <Edit3 size={15} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(candidate)}
              disabled={isLoading}
              className="rounded-xl border border-red-400/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
              title="Delete candidate"
            >
              {isLoading ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={15} />
              )}
            </button>
          </div>
        )}
      </div>

      {(candidate?.manifesto ||
        candidate?.biography ||
        candidate?.experience ||
        candidate?.symbol) && (
        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2">
          {candidate?.symbol && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Symbol
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.symbol}
              </p>
            </div>
          )}

          {candidate?.experience && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Experience
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.experience}
              </p>
            </div>
          )}

          {candidate?.biography && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Biography
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.biography}
              </p>
            </div>
          )}

          {candidate?.manifesto && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Manifesto
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {candidate.manifesto}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* =========================================================
   VOTER VERIFICATION CARD
========================================================= */

const VoterVerificationCard = ({
  user,
  onVerificationChange,
  actionId,
}) => {
  const profile = user?.voterProfile;

  const status = getVerificationStatus(user);
  const statusStyle =
    getVerificationStyle(status);

  const userName =
    profile?.name ||
    user?.name ||
    "Unnamed User";

  const email =
    user?.email || "No email available";

  const voterId =
    profile?.voterId || "Not assigned";

  const isComplete =
    profile?.isComplete === true ||
    user?.voterProfileComplete === true;

  const isEligible =
    profile?.isEligible === true ||
    user?.voterEligible === true;

  const currentAction =
    actionId?.startsWith(`${user?._id}-`)
      ? actionId
      : null;

  const isVerifying =
    currentAction ===
    `${user?._id}-VERIFIED`;

  const isRejecting =
    currentAction ===
    `${user?._id}-REJECTED`;

  const isPending =
    currentAction ===
    `${user?._id}-PENDING`;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition hover:border-emerald-400/20"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/15 bg-emerald-500/10 text-sm font-bold text-emerald-300">
            {profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              userName
                .charAt(0)
                .toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-bold text-white">
                {userName}
              </h3>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle.className}`}
              >
                {statusStyle.label}
              </span>
            </div>

            <p className="mt-1 break-all text-xs text-slate-500">
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Voter ID
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-slate-200">
            {voterId}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Profile
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              isComplete
                ? "text-emerald-300"
                : "text-amber-300"
            }`}
          >
            {isComplete
              ? "Complete"
              : "Incomplete"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Eligibility
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              isEligible
                ? "text-emerald-300"
                : "text-slate-400"
            }`}
          >
            {isEligible
              ? "Eligible"
              : "Not Eligible"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Verification
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-200">
            {statusStyle.label}
          </p>
        </div>
      </div>

      {/* Additional profile information */}
      {profile && (
        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.age !== undefined &&
            profile.age !== null && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Age
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {profile.age}
                </p>
              </div>
            )}

          {profile.gender && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Gender
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {profile.gender}
              </p>
            </div>
          )}

          {profile.city && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                City
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {profile.city}
              </p>
            </div>
          )}

          {profile.state && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                State
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {profile.state}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Verification warning */}
      {!isComplete && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-500/[0.05] p-3">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-amber-400"
          />

          <p className="text-xs leading-5 text-amber-300/80">
            This voter profile is incomplete. The
            backend will not allow verification until
            the profile is complete.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-4 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            onVerificationChange(
              user,
              "VERIFIED"
            )
          }
          disabled={
            !isComplete ||
            Boolean(currentAction)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isVerifying ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={15} />
          )}

          {isVerifying
            ? "Verifying..."
            : "Verify Voter"}
        </button>

        <button
          type="button"
          onClick={() =>
            onVerificationChange(
              user,
              "REJECTED"
            )
          }
          disabled={Boolean(currentAction)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRejecting ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <XCircle size={15} />
          )}

          {isRejecting
            ? "Rejecting..."
            : "Reject"}
        </button>

        <button
          type="button"
          onClick={() =>
            onVerificationChange(
              user,
              "PENDING"
            )
          }
          disabled={Boolean(currentAction)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Clock3 size={15} />
          )}

          {isPending
            ? "Updating..."
            : "Set Pending"}
        </button>
      </div>
    </motion.div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ManageElections = () => {
  const [elections, setElections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionId, setActionId] =
    useState(null);

  const [candidateActionId, setCandidateActionId] =
    useState(null);

  const [candidateSubmitting, setCandidateSubmitting] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [editingCandidateId, setEditingCandidateId] =
    useState(null);

  const [form, setForm] =
    useState(INITIAL_ELECTION_FORM);

  const [candidateForm, setCandidateForm] =
    useState(INITIAL_CANDIDATE_FORM);

  const [candidateLists, setCandidateLists] =
    useState({});

  const [expandedElection, setExpandedElection] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showCandidateForm, setShowCandidateForm] =
    useState(null);

  const [error, setError] =
    useState("");

  /* =======================================================
     VOTER VERIFICATION STATE
  ======================================================= */

  const [users, setUsers] =
    useState([]);

  const [usersLoading, setUsersLoading] =
    useState(true);

  const [usersRefreshing, setUsersRefreshing] =
    useState(false);

  const [verificationActionId, setVerificationActionId] =
    useState(null);

  const [userSearch, setUserSearch] =
    useState("");

  const [verificationFilter, setVerificationFilter] =
    useState("ALL");

  /* =======================================================
     LOAD ELECTION DATA
  ======================================================= */

  const loadElectionData = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllElections();

      const electionData =
        getElectionsFromResponse(response);

      setElections(electionData);

      const candidateResults =
        await Promise.all(
          electionData.map(
            async (election) => {
              try {
                const candidateResponse =
                  await getCandidates({
                    election: election._id,
                  });

                return {
                  electionId: election._id,
                  candidates:
                    getCandidatesFromResponse(
                      candidateResponse
                    ),
                };
              } catch (candidateError) {
                console.error(
                  `Failed to load candidates for ${election._id}:`,
                  candidateError
                );

                return {
                  electionId: election._id,
                  candidates: [],
                };
              }
            }
          )
        );

      const candidateMap = {};

      candidateResults.forEach(
        ({ electionId, candidates }) => {
          candidateMap[electionId] =
            candidates;
        }
      );

      setCandidateLists(candidateMap);
    } catch (err) {
      console.error(
        "Failed to load elections:",
        err
      );

      setElections([]);
      setCandidateLists({});
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD USERS
  ======================================================= */

  const loadUsers = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setUsersRefreshing(true);
      } else {
        setUsersLoading(true);
      }

      const response =
        await API.get("/users");

      const userData =
        getUsersFromResponse(response);

      setUsers(userData);
    } catch (err) {
      console.error(
        "Failed to load users:",
        err
      );

      setUsers([]);

      if (err?.response?.status !== 429) {
        toast.error(
          getErrorMessage(err)
        );
      }
    } finally {
      setUsersLoading(false);
      setUsersRefreshing(false);
    }
  };

  useEffect(() => {
    loadElectionData();
    loadUsers();
  }, []);

  /* =======================================================
     REFRESH EVERYTHING
  ======================================================= */

  const refreshAll = async () => {
    await Promise.all([
      loadElectionData(),
      loadUsers(true),
    ]);

    toast.success(
      "Admin data refreshed."
    );
  };

  /* =======================================================
     FILTERED USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const search =
      userSearch
        .trim()
        .toLowerCase();

    return users.filter((user) => {
      const profile =
        user?.voterProfile || {};

      const status =
        getVerificationStatus(user);

      const name = String(
        profile?.name ||
          user?.name ||
          ""
      ).toLowerCase();

      const email = String(
        user?.email || ""
      ).toLowerCase();

      const voterId = String(
        profile?.voterId || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        voterId.includes(search);

      const matchesStatus =
        verificationFilter === "ALL" ||
        status === verificationFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    users,
    userSearch,
    verificationFilter,
  ]);

  /* =======================================================
     USER VERIFICATION STATS
  ======================================================= */

  const verificationStats = useMemo(() => {
    let pending = 0;
    let verified = 0;
    let rejected = 0;
    let notSubmitted = 0;

    users.forEach((user) => {
      const status =
        getVerificationStatus(user);

      if (status === "PENDING") {
        pending += 1;
      } else if (
        status === "VERIFIED"
      ) {
        verified += 1;
      } else if (
        status === "REJECTED"
      ) {
        rejected += 1;
      } else {
        notSubmitted += 1;
      }
    });

    return {
      total: users.length,
      pending,
      verified,
      rejected,
      notSubmitted,
    };
  }, [users]);

  /* =======================================================
     VOTER VERIFICATION
  ======================================================= */

  const handleVoterVerification = async (
    user,
    status
  ) => {
    const userId = user?._id;

    if (!userId) {
      toast.error(
        "User ID is missing."
      );
      return;
    }

    const profile =
      user?.voterProfile;

    if (
      status === "VERIFIED" &&
      profile?.isComplete !== true &&
      user?.voterProfileComplete !== true
    ) {
      toast.error(
        "This voter profile is incomplete. Complete the profile before verification."
      );
      return;
    }

    const userName =
      profile?.name ||
      user?.name ||
      user?.email ||
      "this voter";

    const actionText =
      status === "VERIFIED"
        ? "verify"
        : status === "REJECTED"
        ? "reject"
        : "set this voter to pending";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${actionText} "${userName}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setVerificationActionId(
        `${userId}-${status}`
      );

      const response =
        await API.patch(
          `/users/${userId}/voter-verification`,
          {
            status,
          }
        );

      const updatedProfile =
        response?.data?.profile ||
        response?.profile;

      setUsers((previousUsers) =>
        previousUsers.map(
          (currentUser) => {
            if (
              currentUser?._id !==
              userId
            ) {
              return currentUser;
            }

            return {
              ...currentUser,

              voterProfile:
                updatedProfile
                  ? {
                      ...(currentUser.voterProfile ||
                        {}),
                      ...updatedProfile,
                    }
                  : {
                      ...(currentUser.voterProfile ||
                        {}),
                      verificationStatus:
                        status,
                      isEligible:
                        status ===
                        "VERIFIED",
                    },

              voterVerificationStatus:
                updatedProfile?.verificationStatus ||
                status,

              voterEligible:
                updatedProfile?.isEligible ??
                (status ===
                  "VERIFIED"),
            };
          }
        )
      );

      if (status === "VERIFIED") {
        toast.success(
          `${userName} has been verified successfully.`
        );
      } else if (
        status === "REJECTED"
      ) {
        toast.success(
          `${userName} has been rejected.`
        );
      } else {
        toast.success(
          `${userName} verification is now pending.`
        );
      }

      /*
       * Refresh from backend so the UI always
       * reflects the real database state.
       */
      await loadUsers();
    } catch (err) {
      console.error(
        "Voter verification error:",
        err
      );

      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setVerificationActionId(null);
    }
  };

  /* =======================================================
     ELECTION FORM
  ======================================================= */

  const handleElectionChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetElectionForm = () => {
    setForm({
      ...INITIAL_ELECTION_FORM,
    });

    setEditId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditId(null);

    setForm({
      ...INITIAL_ELECTION_FORM,
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CREATE ELECTION
  ======================================================= */

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Election title is required."
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Election start date is required."
      );
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) <=
        new Date(form.startDate)
    ) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response =
        await createElection({
          title: form.title.trim(),

          description:
            form.description.trim(),

          electionType:
            form.electionType,

          startDate:
            form.startDate,

          endDate:
            form.endDate || undefined,

          bannerImage:
            form.bannerImage.trim() ||
            undefined,

          instructions:
            form.instructions.trim() ||
            undefined,

          allowResultsBeforeEnd:
            Boolean(
              form.allowResultsBeforeEnd
            ),
        });

      const createdElection =
        response?.election ||
        response?.data?.election ||
        response?.data ||
        null;

      const createdElectionId =
        createdElection?._id;

      toast.success(
        "Election created successfully."
      );

      setForm({
        ...INITIAL_ELECTION_FORM,
      });

      setShowForm(false);
      setEditId(null);

      await loadElectionData();

      if (createdElectionId) {
        setExpandedElection(
          createdElectionId
        );

        setShowCandidateForm(
          createdElectionId
        );

        setEditingCandidateId(null);

        setCandidateForm({
          ...INITIAL_CANDIDATE_FORM,
        });

        setTimeout(() => {
          const element =
            document.getElementById(
              `election-${createdElectionId}`
            );

          element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 250);
      } else {
        const refreshed =
          await getAllElections();

        const refreshedElections =
          getElectionsFromResponse(
            refreshed
          );

        if (refreshedElections.length > 0) {
          const newest =
            refreshedElections
              .slice()
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt ||
                      b.startDate
                  ) -
                  new Date(
                    a.createdAt ||
                      a.startDate
                  )
              )[0];

          if (newest?._id) {
            setExpandedElection(
              newest._id
            );

            setShowCandidateForm(
              newest._id
            );

            setCandidateForm({
              ...INITIAL_CANDIDATE_FORM,
            });

            setTimeout(() => {
              const element =
                document.getElementById(
                  `election-${newest._id}`
                );

              element?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 250);
          }
        }
      }
    } catch (err) {
      console.error(
        "Create election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     EDIT ELECTION
  ======================================================= */

  const handleEdit = (election) => {
    if (isElectionLocked(election)) {
      toast.error(
        "This election cannot be edited in its current state."
      );
      return;
    }

    setEditId(election._id);

    setForm({
      title: election.title || "",

      description:
        election.description || "",

      electionType:
        election.electionType ||
        "OTHER",

      startDate:
        formatDateTimeLocal(
          election.startDate
        ),

      endDate:
        formatDateTimeLocal(
          election.endDate
        ),

      bannerImage:
        election.bannerImage || "",

      instructions:
        election.instructions || "",

      allowResultsBeforeEnd:
        Boolean(
          election.allowResultsBeforeEnd
        ),
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     UPDATE ELECTION
  ======================================================= */

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editId) return;

    if (!form.title.trim()) {
      setError(
        "Election title is required."
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Election start date is required."
      );
      return;
    }

    if (
      form.endDate &&
      new Date(form.endDate) <=
        new Date(form.startDate)
    ) {
      setError(
        "End date must be after the start date."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await updateElection(editId, {
        title: form.title.trim(),

        description:
          form.description.trim(),

        electionType:
          form.electionType,

        startDate:
          form.startDate,

        endDate:
          form.endDate || undefined,

        bannerImage:
          form.bannerImage.trim() ||
          undefined,

        instructions:
          form.instructions.trim() ||
          undefined,

        allowResultsBeforeEnd:
          Boolean(
            form.allowResultsBeforeEnd
          ),
      });

      toast.success(
        "Election updated successfully."
      );

      resetElectionForm();

      await loadElectionData();
    } catch (err) {
      console.error(
        "Update election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     DELETE ELECTION
  ======================================================= */

  const handleDelete = async (election) => {
    const confirmed =
      window.confirm(
        `Delete "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await deleteElection(
        election._id
      );

      toast.success(
        "Election deleted successfully."
      );

      if (
        expandedElection ===
        election._id
      ) {
        setExpandedElection(null);
      }

      if (
        showCandidateForm ===
        election._id
      ) {
        setShowCandidateForm(null);
      }

      await loadElectionData();
    } catch (err) {
      console.error(
        "Delete election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish = async (election) => {
    const confirmed =
      window.confirm(
        `Publish "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await publishElection(
        election._id
      );

      toast.success(
        "Election published successfully."
      );

      if (
        showCandidateForm ===
        election._id
      ) {
        setShowCandidateForm(null);
      }

      await loadElectionData();
    } catch (err) {
      console.error(
        "Publish election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     CANCEL ELECTION
  ======================================================= */

  const handleCancel = async (election) => {
    const confirmed =
      window.confirm(
        `Cancel "${election?.title || "this election"}"?`
      );

    if (!confirmed) return;

    try {
      setActionId(election._id);
      setError("");

      await cancelElection(
        election._id
      );

      toast.success(
        "Election cancelled successfully."
      );

      if (
        showCandidateForm ===
        election._id
      ) {
        setShowCandidateForm(null);
      }

      await loadElectionData();
    } catch (err) {
      console.error(
        "Cancel election error:",
        err
      );

      const message =
        getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     CANDIDATE FORM
  ======================================================= */

  const openCandidateForm = (
    electionId,
    candidate = null
  ) => {
    const election =
      elections.find(
        (item) =>
          item._id === electionId
      );

    if (
      election &&
      isElectionLocked(election)
    ) {
      toast.error(
        "Candidates cannot be changed after the election becomes live, completed, or cancelled."
      );
      return;
    }

    setError("");

    if (candidate) {
      setEditingCandidateId(
        candidate._id
      );

      setCandidateForm({
        name: candidate.name || "",
        party: candidate.party || "",
        symbol: candidate.symbol || "",
        photo: candidate.photo || "",
        manifesto:
          candidate.manifesto || "",
        biography:
          candidate.biography || "",
        experience:
          candidate.experience || "",
        position:
          candidate.position || "",
        isActive:
          candidate.isActive !== false,
      });
    } else {
      setEditingCandidateId(null);

      setCandidateForm({
        ...INITIAL_CANDIDATE_FORM,
      });
    }

    setExpandedElection(
      electionId
    );

    setShowCandidateForm(
      electionId
    );
  };

  const resetCandidateForm = () => {
    setCandidateForm({
      ...INITIAL_CANDIDATE_FORM,
    });

    setEditingCandidateId(null);
    setShowCandidateForm(null);
  };

  /* =======================================================
     CREATE / UPDATE CANDIDATE
  ======================================================= */

  const handleCandidateSubmit = async (
    event,
    electionId
  ) => {
    event.preventDefault();

    if (!candidateForm.name.trim()) {
      toast.error(
        "Candidate name is required."
      );
      return;
    }

    const election =
      elections.find(
        (item) =>
          item._id === electionId
      );

    if (
      election &&
      isElectionLocked(election)
    ) {
      toast.error(
        "Candidates cannot be changed in this election state."
      );
      return;
    }

    try {
      setCandidateSubmitting(true);

      const payload = {
        election: electionId,

        name:
          candidateForm.name.trim(),

        party:
          candidateForm.party.trim(),

        symbol:
          candidateForm.symbol.trim(),

        photo:
          candidateForm.photo.trim(),

        manifesto:
          candidateForm.manifesto.trim(),

        biography:
          candidateForm.biography.trim(),

        experience:
          candidateForm.experience.trim(),

        position:
          candidateForm.position.trim(),

        isActive:
          Boolean(
            candidateForm.isActive
          ),
      };

      if (editingCandidateId) {
        const updatePayload = {
          name: payload.name,
          party: payload.party,
          symbol: payload.symbol,
          photo: payload.photo,
          manifesto:
            payload.manifesto,
          biography:
            payload.biography,
          experience:
            payload.experience,
          position:
            payload.position,
          isActive:
            payload.isActive,
        };

        await updateCandidate(
          editingCandidateId,
          updatePayload
        );

        toast.success(
          "Candidate updated successfully."
        );
      } else {
        await createCandidate(
          payload
        );

        toast.success(
          "Candidate added successfully."
        );
      }

      setEditingCandidateId(null);

      setCandidateForm({
        ...INITIAL_CANDIDATE_FORM,
      });

      setShowCandidateForm(
        electionId
      );

      setExpandedElection(
        electionId
      );

      await loadElectionData();
    } catch (err) {
      console.error(
        "Candidate save error:",
        err
      );

      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setCandidateSubmitting(false);
    }
  };

  /* =======================================================
     DELETE CANDIDATE
  ======================================================= */

  const handleCandidateDelete = async (
    candidate
  ) => {
    const election =
      elections.find(
        (item) =>
          item._id ===
          candidate?.election
      );

    const electionId =
      typeof candidate?.election ===
      "object"
        ? candidate.election?._id
        : candidate?.election;

    const parentElection =
      election ||
      elections.find(
        (item) =>
          item._id === electionId
      );

    if (
      parentElection &&
      isElectionLocked(
        parentElection
      )
    ) {
      toast.error(
        "Candidates cannot be deleted in this election state."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete candidate "${candidate?.name || "this candidate"}"?`
      );

    if (!confirmed) return;

    try {
      setCandidateActionId(
        candidate._id
      );

      await deleteCandidate(
        candidate._id
      );

      toast.success(
        "Candidate deleted successfully."
      );

      await loadElectionData();
    } catch (err) {
      console.error(
        "Delete candidate error:",
        err
      );

      toast.error(
        getErrorMessage(err)
      );
    } finally {
      setCandidateActionId(null);
    }
  };

  /* =======================================================
     TOGGLE CANDIDATES
  ======================================================= */

  const toggleCandidates = (
    electionId
  ) => {
    setExpandedElection(
      (previous) =>
        previous === electionId
          ? null
          : electionId
    );

    if (
      expandedElection ===
      electionId
    ) {
      setShowCandidateForm(null);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck size={14} />
              Administration
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Admin Control Center
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Manage elections, candidates, voting
              options and voter verification from one
              place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={refreshAll}
              disabled={
                loading ||
                usersRefreshing
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.07] disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ||
                  usersRefreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {loading ||
              usersRefreshing
                ? "Refreshing..."
                : "Refresh All"}
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30"
            >
              <Plus size={18} />
              Create Election
            </button>
          </div>
        </motion.div>

        {/* =================================================
            ERROR
        ================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <span className="flex-1">
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="shrink-0 text-red-400 transition hover:text-red-200"
              >
                <X size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            VOTER VERIFICATION
        ================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.05,
          }}
          className="mb-10"
        >
          {/* Section header */}
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <UserCheck
                    size={19}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Voter Verification
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Verify voter profiles before they
                    can cast votes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadUsers(true)
              }
              disabled={usersRefreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-500/5 hover:text-emerald-300 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  usersRefreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Voters
            </button>
          </div>

          {/* Stats */}
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            <button
              type="button"
              onClick={() =>
                setVerificationFilter(
                  "ALL"
                )
              }
              className={`rounded-2xl border p-4 text-left transition ${
                verificationFilter ===
                "ALL"
                  ? "border-emerald-400/30 bg-emerald-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/15"
              }`}
            >
              <Users
                size={18}
                className="text-slate-400"
              />

              <p className="mt-3 text-xl font-black text-white">
                {verificationStats.total}
              </p>

              <p className="text-xs text-slate-500">
                All Users
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setVerificationFilter(
                  "PENDING"
                )
              }
              className={`rounded-2xl border p-4 text-left transition ${
                verificationFilter ===
                "PENDING"
                  ? "border-amber-400/30 bg-amber-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/15"
              }`}
            >
              <Clock3
                size={18}
                className="text-amber-400"
              />

              <p className="mt-3 text-xl font-black text-white">
                {verificationStats.pending}
              </p>

              <p className="text-xs text-slate-500">
                Pending
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setVerificationFilter(
                  "VERIFIED"
                )
              }
              className={`rounded-2xl border p-4 text-left transition ${
                verificationFilter ===
                "VERIFIED"
                  ? "border-emerald-400/30 bg-emerald-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/15"
              }`}
            >
              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />

              <p className="mt-3 text-xl font-black text-white">
                {verificationStats.verified}
              </p>

              <p className="text-xs text-slate-500">
                Verified
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setVerificationFilter(
                  "REJECTED"
                )
              }
              className={`rounded-2xl border p-4 text-left transition ${
                verificationFilter ===
                "REJECTED"
                  ? "border-red-400/30 bg-red-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/15"
              }`}
            >
              <XCircle
                size={18}
                className="text-red-400"
              />

              <p className="mt-3 text-xl font-black text-white">
                {verificationStats.rejected}
              </p>

              <p className="text-xs text-slate-500">
                Rejected
              </p>
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <ShieldCheck
                size={18}
                className="text-teal-400"
              />

              <p className="mt-3 text-xl font-black text-white">
                {verificationStats.notSubmitted}
              </p>

              <p className="text-xs text-slate-500">
                Not Submitted
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="search"
                value={userSearch}
                onChange={(event) =>
                  setUserSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name, email or voter ID..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/30 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div className="relative">
              <select
                value={
                  verificationFilter
                }
                onChange={(event) =>
                  setVerificationFilter(
                    event.target.value
                  )
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-medium text-slate-300 outline-none focus:border-emerald-400/30 md:w-52"
              >
                <option value="ALL">
                  All Statuses
                </option>

                {VERIFICATION_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
            </div>
          </div>

          {/* Users */}
          {usersLoading ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="text-center">
                <Loader2
                  size={32}
                  className="mx-auto animate-spin text-emerald-400"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading voter profiles...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Users size={25} />
              </div>

              <h3 className="mt-4 font-bold text-white">
                No voters found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                No users match the selected search or
                verification status.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredUsers.map(
                  (user) => (
                    <VoterVerificationCard
                      key={user._id}
                      user={user}
                      actionId={
                        verificationActionId
                      }
                      onVerificationChange={
                        handleVoterVerification
                      }
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* =================================================
            DIVIDER
        ================================================== */}

        <div className="mb-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* =================================================
            ELECTION MANAGEMENT HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <FileText size={14} />
              Election Management
            </div>

            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Manage Elections
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create elections, add unlimited
              candidates or voting options, and manage
              the complete election lifecycle.
            </p>
          </div>
        </motion.div>

        {/* =================================================
            CREATE / UPDATE ELECTION FORM
        ================================================== */}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <FileText
                          size={19}
                          className="text-emerald-400"
                        />
                      </div>

                      <h2 className="text-xl font-bold sm:text-2xl">
                        {editId
                          ? "Update Election"
                          : "Create New Election"}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {editId
                        ? "Update the election configuration."
                        : "Configure the election first. After creation, candidate management will open automatically."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      resetElectionForm
                    }
                    disabled={submitting}
                    className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    <X size={19} />
                  </button>
                </div>

                <form
                  onSubmit={
                    editId
                      ? handleUpdate
                      : handleCreate
                  }
                  className="space-y-5"
                >
                  <div>
                    <FieldLabel required>
                      Election Title
                    </FieldLabel>

                    <Input
                      name="title"
                      value={form.title}
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Enter election title"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <FieldLabel required>
                      Election Type
                    </FieldLabel>

                    <div className="relative">
                      <select
                        name="electionType"
                        value={
                          form.electionType
                        }
                        onChange={
                          handleElectionChange
                        }
                        disabled={submitting}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                      >
                        {ELECTION_TYPES.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                              className="bg-slate-900"
                            >
                              {type}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>
                      Description
                    </FieldLabel>

                    <Textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Describe this election"
                      rows={4}
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>
                        Start Date
                      </FieldLabel>

                      <div className="relative">
                        <CalendarDays
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="datetime-local"
                          name="startDate"
                          value={
                            form.startDate
                          }
                          onChange={
                            handleElectionChange
                          }
                          disabled={submitting}
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>
                        End Date
                      </FieldLabel>

                      <div className="relative">
                        <Clock3
                          size={17}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                          type="datetime-local"
                          name="endDate"
                          value={
                            form.endDate
                          }
                          onChange={
                            handleElectionChange
                          }
                          disabled={submitting}
                          className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>
                      Banner Image URL
                    </FieldLabel>

                    <Input
                      type="url"
                      name="bannerImage"
                      value={
                        form.bannerImage
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="https://example.com/banner.jpg"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      Voting Instructions
                    </FieldLabel>

                    <Textarea
                      name="instructions"
                      value={
                        form.instructions
                      }
                      onChange={
                        handleElectionChange
                      }
                      placeholder="Instructions voters should follow"
                      rows={4}
                      disabled={submitting}
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <input
                      type="checkbox"
                      name="allowResultsBeforeEnd"
                      checked={
                        form.allowResultsBeforeEnd
                      }
                      onChange={
                        handleElectionChange
                      }
                      disabled={submitting}
                      className="mt-1 h-4 w-4 accent-emerald-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Allow results before
                        election ends
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        This setting controls whether
                        results can be shown before the
                        election ends.
                      </p>
                    </div>
                  </label>

                  {!editId && (
                    <div className="flex gap-3 rounded-2xl border border-teal-400/15 bg-teal-500/[0.05] p-4">
                      <Info
                        size={18}
                        className="mt-0.5 shrink-0 text-teal-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-teal-300">
                          Candidates are added after creation
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Once this election is created,
                          the Candidate / Voting Options
                          section will open automatically.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={
                        resetElectionForm
                      }
                      disabled={submitting}
                      className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : editId ? (
                        <Save size={18} />
                      ) : (
                        <Plus size={18} />
                      )}

                      {submitting
                        ? "Saving..."
                        : editId
                        ? "Update Election"
                        : "Create Election"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================================================
            ELECTION LIST HEADER
        ================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              All Elections
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {elections.length} election
              {elections.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {/* =================================================
            ELECTION LOADING
        ================================================== */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-emerald-400"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading elections...
              </p>
            </div>
          </div>
        ) : elections.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
              <FileText size={28} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No elections found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Create your first election to start
              managing the voting process.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white"
            >
              <Plus size={17} />
              Create Election
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {elections.map(
              (election, index) => {
                const status =
                  getStatus(election);

                const isActionLoading =
                  actionId ===
                  election._id;

                const candidates =
                  candidateLists[
                    election._id
                  ] || [];

                const isExpanded =
                  expandedElection ===
                  election._id;

                const isLocked =
                  isElectionLocked(
                    election
                  );

                return (
                  <motion.div
                    id={`election-${election._id}`}
                    key={election._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                    className={`overflow-hidden rounded-3xl border bg-white/[0.04] shadow-xl backdrop-blur-xl transition ${
                      isExpanded
                        ? "border-emerald-400/30 shadow-emerald-500/5"
                        : "border-white/10 hover:border-emerald-400/20"
                    }`}
                  >
                    {/* Election Card */}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                              {election.title ||
                                "Untitled Election"}
                            </h3>

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {election.description ||
                              "No description provided."}
                          </p>

                          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.025] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <FileText size={13} />

                            {election.electionType ||
                              "OTHER"}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-950/30 px-3 py-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                election.isPublished
                                  ? "bg-emerald-400"
                                  : "bg-slate-600"
                              }`}
                            />

                            <span className="text-xs font-semibold text-slate-400">
                              {election.isPublished
                                ? "Published"
                                : "Not published"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <CalendarDays
                              size={14}
                            />
                            Start
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-200">
                            {formatDate(
                              election.startDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {formatDateTime(
                              election.startDate
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Clock3 size={14} />
                            End
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-200">
                            {formatDate(
                              election.endDate
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {formatDateTime(
                              election.endDate
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Candidate summary */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-500/[0.05] px-3 py-2">
                          <Users
                            size={15}
                            className="text-emerald-400"
                          />

                          <span className="text-xs font-semibold text-slate-300">
                            {candidates.length}{" "}
                            candidate
                            {candidates.length !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        </div>

                        {election.allowResultsBeforeEnd && (
                          <div className="inline-flex items-center gap-2 rounded-xl border border-teal-400/10 bg-teal-500/[0.05] px-3 py-2">
                            <Check
                              size={14}
                              className="text-teal-400"
                            />

                            <span className="text-xs font-semibold text-slate-400">
                              Early results allowed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Candidate Management */}
                    <div className="border-t border-white/10 bg-slate-950/20">
                      <button
                        type="button"
                        onClick={() =>
                          toggleCandidates(
                            election._id
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Users
                              size={17}
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-200">
                              Candidates / Voting Options
                            </p>

                            <p className="text-xs text-slate-600">
                              {isLocked
                                ? "Candidate management is locked"
                                : "Add, edit and manage voting options"}
                            </p>
                          </div>
                        </div>

                        <motion.div
                          animate={{
                            rotate:
                              isExpanded
                                ? 180
                                : 0,
                          }}
                        >
                          <ChevronDown
                            size={18}
                            className="text-slate-500"
                          />
                        </motion.div>
                      </button>

                      <AnimatePresence
                        initial={false}
                      >
                        {isExpanded && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/5 p-5 sm:p-6">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h4 className="font-bold text-white">
                                    {candidates.length}{" "}
                                    Candidate
                                    {candidates.length !==
                                    1
                                      ? "s"
                                      : ""}
                                  </h4>

                                  <p className="mt-1 text-xs text-slate-600">
                                    {isLocked
                                      ? "This election can no longer be modified."
                                      : "Add any number of candidates or voting options."}
                                  </p>
                                </div>

                                {!isLocked && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openCandidateForm(
                                        election._id
                                      )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                                  >
                                    <Plus
                                      size={15}
                                    />
                                    Add Candidate
                                  </button>
                                )}
                              </div>

                              <AnimatePresence>
                                {showCandidateForm ===
                                  election._id && (
                                  <CandidateForm
                                    election={
                                      election
                                    }
                                    candidateForm={
                                      candidateForm
                                    }
                                    setCandidateForm={
                                      setCandidateForm
                                    }
                                    editingCandidateId={
                                      editingCandidateId
                                    }
                                    candidateSubmitting={
                                      candidateSubmitting
                                    }
                                    onSubmit={
                                      handleCandidateSubmit
                                    }
                                    onCancel={
                                      resetCandidateForm
                                    }
                                  />
                                )}
                              </AnimatePresence>

                              {candidates.length ===
                              0 ? (
                                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
                                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                    <Users
                                      size={26}
                                    />
                                  </div>

                                  <p className="mt-3 text-sm font-semibold text-slate-400">
                                    No candidates added yet
                                  </p>

                                  {!isLocked && (
                                    <>
                                      <p className="mt-1 text-xs text-slate-600">
                                        Add the first
                                        candidate / voting
                                        option using the
                                        button above.
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          openCandidateForm(
                                            election._id
                                          )
                                        }
                                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                                      >
                                        <Plus
                                          size={15}
                                        />
                                        Add First Candidate
                                      </button>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <motion.div
                                  layout
                                  className="mt-5 grid gap-3 md:grid-cols-2"
                                >
                                  <AnimatePresence>
                                    {candidates.map(
                                      (
                                        candidate
                                      ) => (
                                        <CandidateItem
                                          key={
                                            candidate._id
                                          }
                                          candidate={
                                            candidate
                                          }
                                          actionId={
                                            candidateActionId
                                          }
                                          readOnly={
                                            isLocked
                                          }
                                          onEdit={() =>
                                            openCandidateForm(
                                              election._id,
                                              candidate
                                            )
                                          }
                                          onDelete={
                                            handleCandidateDelete
                                          }
                                        />
                                      )
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Election Actions */}
                    <div className="border-t border-white/10 bg-slate-950/30 p-4">
                      <div className="flex flex-wrap gap-2">
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:border-emerald-400/20 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
                          >
                            <Edit3
                              size={15}
                            />
                            Edit
                          </button>
                        )}

                        {election.status ===
                          "DRAFT" && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePublish(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
                          >
                            {isActionLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2
                                size={15}
                              />
                            )}

                            Publish
                          </button>
                        )}

                        {[
                          "DRAFT",
                          "UPCOMING",
                          "LIVE",
                        ].includes(
                          election.status
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(
                                election
                              )
                            }
                            disabled={
                              isActionLoading
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
                          >
                            <XCircle
                              size={15}
                            />
                            Cancel
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              election
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={15}
                            />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageElections;