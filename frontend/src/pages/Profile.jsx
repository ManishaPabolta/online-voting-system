import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import UserProfileCard from "../components/profile/UserProfileCard";
import ProfileForm from "../components/profile/ProfileForm";
import Loader from "../components/common/Loader";

import { getProfile } from "../api/profileApi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();

      /*
       * Backend profile response:
       * {
       *   profile: ...
       * }
       */

      const profile =
        response?.profile ??
        response?.data?.profile ??
        null;

      setUser(profile);
    } catch (error) {
      console.error("FETCH_PROFILE_ERROR:", error);

      setUser(null);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <DashboardLayout>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
          >
            <UserRound size={24} />
          </motion.div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your voter profile information.
            </p>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="flex min-h-[45vh] items-center justify-center">
          <Loader />
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {!loading && error && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-red-500/[0.05] p-8 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertCircle size={28} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-white">
            Unable to Load Profile
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </motion.div>
      )}

      {/* =====================================================
          PROFILE EXISTS
      ====================================================== */}

      {!loading && !error && user && (
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="space-y-6"
        >
          <UserProfileCard user={user} />

          <ProfileForm user={user} />
        </motion.div>
      )}

      {/* =====================================================
          PROFILE DOES NOT EXIST
      ====================================================== */}

      {!loading && !error && !user && (
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl sm:p-10"
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
            >
              <UserRoundCheck size={30} />
            </motion.div>

            <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
              Complete Your Profile
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
              Your voter profile has not been created
              yet. Add the required information to
              complete your profile.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <ProfileForm />
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Profile;