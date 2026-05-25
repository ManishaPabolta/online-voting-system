import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  Vote,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "../../api/authApi";

const LoginForm = () => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [
    showVerifyBox,
    setShowVerifyBox,
  ] = useState(false);

  const [
    verifyEmail,
    setVerifyEmail,
  ] = useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await loginUser(formData);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.user
        )
      );

      toast.success(
        "Login Successful"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      const message =
        error.response?.data
          ?.message;

      // EMAIL NOT VERIFIED
      if (
        message ===
        "Please verify your email first"
      ) {

        setVerifyEmail(
          formData.email
        );

        setShowVerifyBox(
          true
        );
      }

      toast.error(
        message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">

      {/* TOP SECTION */}

      <div className="flex flex-col items-center mb-8">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-full mb-4 shadow-lg">

          <Vote
            size={34}
            className="text-white"
          />

        </div>

        <h2 className="text-3xl font-bold text-center text-white">

          Welcome Back

        </h2>

        <p className="text-gray-300 mt-2 text-center">

          Login to continue secure
          online voting

        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label className="block mb-2 text-sm font-medium text-gray-200">

            Email

          </label>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 focus-within:border-blue-500 transition-all">

            <Mail
              size={18}
              className="text-gray-300"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={
                handleChange
              }
              required
              className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div>

          <label className="block mb-2 text-sm font-medium text-gray-200">

            Password

          </label>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 focus-within:border-blue-500 transition-all">

            <Lock
              size={18}
              className="text-gray-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
              className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-gray-400"
            />

          </div>

        </div>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] transition-all duration-300 py-4 rounded-xl font-semibold shadow-lg text-white"
        >

          {loading
            ? "Logging In..."
            : "Login"}

        </button>

      </form>

      {/* VERIFY EMAIL BOX */}

      {showVerifyBox && (

        <div className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-5 animate-pulse">

          <div className="flex items-center gap-3 mb-3">

            <ShieldCheck
              className="text-yellow-400"
              size={22}
            />

            <h3 className="font-semibold text-yellow-300">

              Email Not Verified

            </h3>

          </div>

          <p className="text-sm text-gray-300 mb-4">

            Your account is not verified yet.
            Please verify OTP first to
            continue login.

          </p>

          <button
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 py-3 rounded-xl font-semibold text-black"
          >

            Verify Email

          </button>

        </div>

      )}

      {/* REGISTER SECTION */}

      <div className="mt-8 text-center border-t border-white/10 pt-6">

        <p className="text-gray-300">

          Don’t have an account?

        </p>

        <Link
          to="/register"
          className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg text-white"
        >

          <UserPlus size={18} />

          Register Now

        </Link>

      </div>

    </div>
  );
};

export default LoginForm;