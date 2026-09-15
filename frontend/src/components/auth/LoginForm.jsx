import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  Vote,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();

  // ==========================================
  // AUTH CONTEXT
  // ==========================================

  const { handleLogin } = useAuth();

  // ==========================================
  // STATE
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showVerifyBox, setShowVerifyBox] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const email = formData.email.trim();
    const password = formData.password;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!email || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setShowVerifyBox(false);

      // ----------------------------------------
      // LOGIN API
      // ----------------------------------------

      const response = await loginUser({
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response);

      // ----------------------------------------
      // HANDLE AUTHENTICATION
      // ----------------------------------------
      //
      // AuthContext handles:
      // - token
      // - user
      // - React auth state
      // - /me fallback if required
      //
      // ----------------------------------------

      const loggedInUser = await handleLogin(response);

      // ----------------------------------------
      // VERIFY TOKEN
      // ----------------------------------------

      const token =
        response?.token ||
        response?.data?.token ||
        null;

      if (!token) {
        throw new Error(
          "Authentication token was not received from the server."
        );
      }

      // ----------------------------------------
      // LOGIN SUCCESS
      // ----------------------------------------

      console.log(
        "LOGIN SUCCESS:",
        loggedInUser
      );

      toast.success(
        "Welcome back! Login successful."
      );

      // ----------------------------------------
      // GO TO DASHBOARD
      // ----------------------------------------

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      // ----------------------------------------
      // BACKEND ERROR MESSAGE
      // ----------------------------------------

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to login. Please try again.";

      // ----------------------------------------
      // EMAIL VERIFICATION CHECK
      // ----------------------------------------

      const lowerMessage =
        String(message).toLowerCase();

      if (
        lowerMessage.includes("verify") &&
        lowerMessage.includes("email")
      ) {
        setVerifyEmail(email);
        setShowVerifyBox(true);
      }

      toast.error(message);
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
      {/* ======================================
          DECORATIVE GLOW
      ======================================= */}

      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-500/20 via-teal-400/10 to-emerald-500/20 blur-xl" />

      {/* ======================================
          MAIN CARD
      ======================================= */}

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

        {/* Background Glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

        {/* ====================================
            HEADER
        ===================================== */}

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
            duration: 0.4,
          }}
          className="relative mb-8 flex flex-col items-center text-center"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              boxShadow: [
                "0 0 0 rgba(16,185,129,0)",
                "0 0 30px rgba(16,185,129,0.25)",
                "0 0 0 rgba(16,185,129,0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-500"
          >
            <Vote
              size={30}
              strokeWidth={2.2}
              className="text-white"
            />
          </motion.div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome Back
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Login to continue to your secure online voting account.
          </p>
        </motion.div>

        {/* ====================================
            LOGIN FORM
        ===================================== */}

        <form
          onSubmit={handleSubmit}
          className="relative space-y-5"
        >

          {/* ==================================
              EMAIL
          =================================== */}

          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Mail
                size={18}
                className="shrink-0 text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"
              />

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                required
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>
          </div>

          {/* ==================================
              PASSWORD
          =================================== */}

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Lock
                size={18}
                className="shrink-0 text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"
              />

              <input
                id="login-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:text-emerald-400 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ==================================
              LOGIN BUTTON
          =================================== */}

          <motion.button
            whileHover={
              !loading
                ? { scale: 1.015 }
                : {}
            }
            whileTap={
              !loading
                ? { scale: 0.98 }
                : {}
            }
            type="submit"
            disabled={loading}
            className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-semibold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />

            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                <span>
                  Signing In...
                </span>
              </>
            ) : (
              <>
                <span>
                  Sign In
                </span>

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </motion.button>
        </form>

        {/* ====================================
            EMAIL VERIFICATION
        ===================================== */}

        <AnimatePresence>
          {showVerifyBox && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: 10,
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
              transition={{
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10">
                    <ShieldCheck
                      size={19}
                      className="text-amber-400"
                    />
                  </div>

                  <h3 className="font-semibold text-amber-300">
                    Email Not Verified
                  </h3>

                </div>

                <p className="mb-4 text-sm leading-6 text-slate-400">
                  Your email address has not been verified yet. Verify your OTP to continue.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/verify-otp",
                      {
                        state: {
                          email:
                            verifyEmail,
                        },
                      }
                    )
                  }
                  className="w-full rounded-xl bg-amber-400 py-3 font-semibold text-slate-950 transition-all duration-300 hover:bg-amber-300"
                >
                  Verify Email
                </button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================
            REGISTER
        ===================================== */}

        <div className="relative mt-8 border-t border-white/10 pt-6 text-center">

          <p className="text-sm text-slate-400">
            Don&apos;t have an account?
          </p>

          <Link
            to="/register"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-5 py-3 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            <UserPlus size={17} />
            Create Account
          </Link>

        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;