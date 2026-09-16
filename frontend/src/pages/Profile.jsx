import { useCallback, useEffect, useState } from "react";
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
  const [profileNotFound, setProfileNotFound] = useState(false);

  // =========================================================
  // FETCH PROFILE
  // =========================================================

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setProfileNotFound(false);

      const response = await getProfile();

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   profile: {...}
       * }
       */

      const profile =
        response?.profile ??
        response?.data?.profile ??
        null;

      // -------------------------------------------------------
      // PROFILE EXISTS
      // -------------------------------------------------------

      if (profile) {
        setUser(profile);
        setProfileNotFound(false);
        return;
      }

      // -------------------------------------------------------
      // NO PROFILE
      // -------------------------------------------------------

      setUser(null);
      setProfileNotFound(true);
    } catch (error) {
      console.error("FETCH_PROFILE_ERROR:", error);

      setUser(null);

      /*
       * Backend can return 404 when the authenticated
       * user has not created a voter profile yet.
       *
       * In that case, this is NOT a page error.
       * We show the profile creation form instead.
       */

      if (error?.response?.status === 404) {
        setProfileNotFound(true);
        setError("");
        return;
      }

      // -------------------------------------------------------
      // OTHER ERRORS
      // -------------------------------------------------------

      setProfileNotFound(false);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // REAL API ERROR
  // =========================================================

  if (error && !profileNotFound) {
    return (
      <DashboardLayout>
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
        >
          {/* PAGE HEADER */}

          <div className="mb-8 flex items-center gap-4">
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl
                border border-emerald-400/20
                bg-emerald-500/10
                text-emerald-400
              "
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

          {/* ERROR CARD */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              mx-auto
              max-w-xl
              rounded-3xl
              border border-red-400/20
              bg-red-500/[0.05]
              p-8
              text-center
              shadow-2xl
              shadow-black/20
              backdrop-blur-xl
            "
          >
            <div
              className="
                mx-auto
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                border border-red-400/20
                bg-red-500/10
                text-red-400
              "
            >
              <AlertCircle size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Unable to Load Profile
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-emerald-500/30
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RefreshCw size={17} />

              Try Again
            </button>
          </motion.div>
        </motion.div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // MAIN PROFILE PAGE
  // =========================================================

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
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-2xl
              border border-emerald-400/20
              bg-emerald-500/10
              text-emerald-400
            "
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
          PROFILE EXISTS
      ====================================================== */}

      {user && (
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

      {!user && profileNotFound && (
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
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.03]
            p-6
            shadow-xl
            backdrop-blur-xl
            sm:p-10
          "
        >
          {/* INTRO */}

          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mx-auto
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                border border-emerald-400/20
                bg-emerald-500/10
                text-emerald-400
              "
            >
              <UserRoundCheck size={30} />
            </motion.div>

            <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
              Complete Your Profile
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
              Your voter profile has not been created yet.
              Add the required information below to complete
              your profile and continue with the verification
              process.
            </p>
          </div>

          {/* PROFILE FORM */}

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
              delay: 0.15,
              duration: 0.45,
            }}
            className="mx-auto mt-8 max-w-3xl"
          >
            <ProfileForm
              onSuccess={fetchProfile}
            />
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Profile;