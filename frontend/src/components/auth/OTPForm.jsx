import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Mail,
  KeyRound,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import {
  verifyOTP,
  resendOTP,
} from "../../api/authApi";

const OTPForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // STATE
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
  });

  // ==========================================
  // UPDATE EMAIL FROM ROUTE STATE
  // ==========================================

  useEffect(() => {
    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
      }));
    }
  }, [location.state]);

  // ==========================================
  // COOLDOWN TIMER
  // ==========================================

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp") {
      const numericValue = value
        .replace(/\D/g, "")
        .slice(0, 6);

      setFormData((prev) => ({
        ...prev,
        otp: numericValue,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOTP = async () => {
    const email = formData.email.trim();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (resending || cooldown > 0) {
      return;
    }

    try {
      setResending(true);

      const response = await resendOTP(email);

      console.log(
        "RESEND OTP RESPONSE:",
        response
      );

      // Clear old OTP after a new OTP is generated
      setFormData((prev) => ({
        ...prev,
        otp: "",
      }));

      // 60 second resend cooldown
      setCooldown(60);

      toast.success(
        response?.message ||
          "A new OTP has been sent to your email."
      );
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const otp = formData.otp.trim();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    if (otp.length !== 6) {
      toast.error(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOTP({
        email,
        otp,
      });

      console.log(
        "VERIFY OTP RESPONSE:",
        response
      );

      toast.success(
        response?.message ||
          "Email verified successfully!"
      );

      // ========================================
      // GO BACK TO LOGIN
      // ========================================

      navigate("/login", {
        replace: true,
        state: {
          verifiedEmail: email,
        },
      });
    } catch (error) {
      console.error(
        "OTP ERROR:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "OTP verification failed.";

      if (status === 400) {
        toast.error(message);
      } else if (status === 404) {
        toast.error(
          "No account was found with this email."
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
      className="relative w-full max-w-md"
    >
      {/* Glow */}

      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-teal-500/20 via-emerald-500/10 to-teal-500/20 blur-xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

        {/* Background Glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* ======================================
            HEADER
        ======================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="relative mb-8 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/10"
          >
            <ShieldCheck
              size={30}
              className="text-white"
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Verify Your Email
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Enter the 6-digit OTP sent to your registered email.
          </p>
        </motion.div>

        {/* ======================================
            FORM
        ======================================= */}

        <form
          onSubmit={handleSubmit}
          className="relative space-y-5"
        >
          {/* EMAIL */}

          <div>
            <label
              htmlFor="otp-email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Mail
                size={18}
                className="shrink-0 text-slate-500 transition-colors group-focus-within:text-emerald-400"
              />

              <input
                id="otp-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading || resending}
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>

          {/* OTP */}

          <div>
            <label
              htmlFor="otp-code"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Verification Code
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <KeyRound
                size={18}
                className="shrink-0 text-slate-500 transition-colors group-focus-within:text-emerald-400"
              />

              <input
                id="otp-code"
                type="text"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                required
                disabled={loading || resending}
                className="w-full bg-transparent px-3 py-4 text-center text-xl font-semibold tracking-[0.45em] text-white outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-500 disabled:opacity-70"
              />
            </div>

            <div className="mt-2 flex justify-between px-1 text-xs text-slate-500">
              <span>
                6 digits required
              </span>

              <span>
                {formData.otp.length}/6
              </span>
            </div>
          </div>

          {/* ====================================
              VERIFY BUTTON
          ===================================== */}

          <motion.button
            whileHover={
              !loading && !resending
                ? { scale: 1.015 }
                : {}
            }
            whileTap={
              !loading && !resending
                ? { scale: 0.98 }
                : {}
            }
            type="submit"
            disabled={loading || resending}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-semibold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck size={19} />

                Verify OTP
              </>
            )}
          </motion.button>
        </form>

        {/* ======================================
            RESEND OTP
        ======================================= */}

        <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">

          <p className="text-sm text-slate-400">
            Didn&apos;t receive the OTP?
          </p>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={
              loading ||
              resending ||
              cooldown > 0
            }
            className="mx-auto mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Sending OTP...
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw size={16} />

                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw size={16} />

                Resend OTP
              </>
            )}
          </button>

        </div>

        {/* ======================================
            BACK
        ======================================= */}

        <button
          type="button"
          onClick={() => navigate("/login")}
          disabled={loading || resending}
          className="mx-auto mt-6 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} />

          Back to Login
        </button>

      </div>
    </motion.div>
  );
};

export default OTPForm;