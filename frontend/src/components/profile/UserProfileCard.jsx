import { motion } from "framer-motion";
import {
  UserRound,
  Phone,
  MapPin,
  CalendarDays,
  VenusAndMars,
  CreditCard,
  ShieldCheck,
  FileCheck2,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const UserProfileCard = ({ user }) => {
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
        <UserRound
          size={48}
          className="mx-auto text-slate-600"
        />

        <h2 className="mt-4 text-xl font-bold text-white">
          Profile Not Available
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your profile information could not be loaded.
        </p>
      </div>
    );
  }

  const isEligible = Boolean(user?.isEligible);

  const profileStatus =
    user?.status?.toUpperCase() || "PENDING";

  const statusConfig = isEligible
    ? {
        label: "Eligible",
        icon: CheckCircle2,
        className:
          "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
      }
    : {
        label: profileStatus,
        icon:
          profileStatus === "PENDING"
            ? Clock3
            : AlertCircle,
        className:
          "border-amber-400/20 bg-amber-500/10 text-amber-300",
      };

  const StatusIcon = statusConfig.icon;

  const maskAadhaar = (value) => {
    if (!value) return "Not available";

    const cleanValue = String(value).replace(/\s/g, "");

    if (cleanValue.length <= 4) {
      return cleanValue;
    }

    return `XXXX XXXX ${cleanValue.slice(-4)}`;
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = () => {
    const name = user?.name?.trim();

    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  const profileImage =
    user?.profileImage ||
    user?.image ||
    user?.photo ||
    user?.avatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-500/[0.10] via-slate-900/30 to-teal-500/[0.08] p-6 sm:p-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* User */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user?.name || "User"}
                  className="h-20 w-20 rounded-full border-4 border-emerald-400/20 object-cover shadow-xl sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl font-black text-white shadow-xl sm:h-24 sm:w-24 sm:text-3xl">
                  {getInitials()}
                </div>
              )}

              <span
                className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-slate-900 ${
                  isEligible
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />
            </div>

            {/* Name */}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black text-white sm:text-3xl">
                {user?.name || "User"}
              </h1>

              {user?.email && (
                <p className="mt-1 truncate text-sm text-slate-400">
                  {user.email}
                </p>
              )}

              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusConfig.className}`}
                >
                  <StatusIcon size={14} />
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
            <ShieldCheck
              size={20}
              className={
                isEligible
                  ? "text-emerald-400"
                  : "text-slate-500"
              }
            />

            <div>
              <p className="text-xs text-slate-500">
                Verification
              </p>

              <p className="text-sm font-semibold text-white">
                {isEligible
                  ? "Verified Voter"
                  : "Verification Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROFILE INFORMATION
      ====================================================== */}
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your registered voter profile information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <InfoItem
            icon={UserRound}
            label="Full Name"
            value={user?.name}
          />

          {/* Age */}
          <InfoItem
            icon={CalendarDays}
            label="Age"
            value={
              user?.age
                ? `${user.age} years`
                : null
            }
          />

          {/* Gender */}
          <InfoItem
            icon={VenusAndMars}
            label="Gender"
            value={user?.gender}
          />

          {/* Phone */}
          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={user?.phone}
          />

          {/* Voter ID */}
          <InfoItem
            icon={CreditCard}
            label="Voter ID"
            value={user?.voterId}
          />

          {/* Aadhaar */}
          <InfoItem
            icon={ShieldCheck}
            label="Aadhaar Number"
            value={maskAadhaar(user?.aadhaarNumber)}
            secure
          />

          {/* Address */}
          <div className="sm:col-span-2">
            <InfoItem
              icon={MapPin}
              label="Address"
              value={user?.address}
            />
          </div>
        </div>

        {/* =================================================
            ID PROOF
        ================================================== */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-white">
            Identity Verification
          </h2>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                <FileCheck2 size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  ID Proof
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {user?.idProof
                    ? "Identity document submitted"
                    : "No identity document available"}
                </p>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  user?.idProof
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-slate-500/10 text-slate-400"
                }`}
              >
                {user?.idProof ? (
                  <>
                    <CheckCircle2 size={14} />
                    Submitted
                  </>
                ) : (
                  "Not Submitted"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            PROFILE STATUS
        ================================================== */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Profile Verification Status
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {isEligible
                  ? "Your voter profile has been verified and you are eligible to participate in eligible elections."
                  : "Your voter profile is awaiting verification. Eligibility will be available after the verification process is completed."}
              </p>
            </div>
          </div>
        </div>

        {/* Created / Updated */}
        {(user?.createdAt || user?.updatedAt) && (
          <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-600 sm:flex-row sm:justify-between">
            {user?.createdAt && (
              <span>
                Profile created:{" "}
                {formatDate(user.createdAt)}
              </span>
            )}

            {user?.updatedAt && (
              <span>
                Last updated:{" "}
                {formatDate(user.updatedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  secure = false,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition hover:border-emerald-400/20 hover:bg-emerald-500/[0.02]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p
            className={`mt-1 break-words text-sm font-semibold ${
              value
                ? "text-slate-200"
                : "text-slate-600"
            }`}
          >
            {value || "Not available"}

            {secure && value && (
              <span className="ml-2 text-[10px] font-medium text-emerald-500">
                Protected
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;