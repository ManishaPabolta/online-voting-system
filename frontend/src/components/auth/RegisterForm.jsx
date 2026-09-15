import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  Vote,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { registerUser } from "../../api/authApi";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
      });

      toast.success(
        "Registration successful! OTP sent to your email."
      );

      navigate("/verify-otp", {
        replace: true,
        state: {
          email,
        },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative w-full max-w-md"
    >
      {/* Glow */}
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-500/20 via-teal-400/10 to-emerald-500/20 blur-xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        {/* Decorative Glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 flex flex-col items-center text-center"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 1.5, 0, -1.5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/10"
          >
            <Vote size={30} className="text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create Account
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Create your secure account and participate in online elections.
          </p>
        </motion.div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative space-y-5"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Full Name
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <User
                size={18}
                className="shrink-0 text-slate-500 transition-colors group-focus-within:text-emerald-400"
              />

              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email Address
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Mail
                size={18}
                className="shrink-0 text-slate-500 transition-colors group-focus-within:text-emerald-400"
              />

              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <div className="group flex items-center rounded-xl border border-white/10 bg-slate-800/60 px-4 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Lock
                size={18}
                className="shrink-0 text-slate-500 transition-colors group-focus-within:text-emerald-400"
              />

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:text-emerald-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Use at least 6 characters.
            </p>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-3.5">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <p className="text-xs leading-5 text-slate-400">
              Your account will be verified through an OTP sent to your
              email address.
            </p>
          </div>

          {/* Register Button */}
          <motion.button
            whileHover={!loading ? { scale: 1.015 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-semibold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </motion.button>
        </form>

        {/* Login */}
        <div className="relative mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-teal-400/20 bg-teal-400/5 px-5 py-3 text-sm font-semibold text-teal-300 transition-all duration-300 hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-200"
          >
            <ArrowRight size={17} />
            Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;