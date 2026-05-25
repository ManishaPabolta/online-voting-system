import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  Vote,
} from "lucide-react";

import { registerUser } from "../../api/authApi";

const RegisterForm = () => {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
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

      await registerUser(
        formData
      );

      toast.success(
        "Registration Successful"
      );

      navigate("/verify-otp");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

      <div className="flex flex-col items-center mb-8">

        <div className="bg-green-600 p-4 rounded-full mb-4">
          <Vote size={32} />
        </div>

        <h2 className="text-3xl font-bold">
          Create Account
        </h2>

        <p className="text-gray-300 mt-2">
          Join Secure Voting
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2 text-sm">
            Full Name
          </label>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4">

            <User
              size={18}
              className="text-gray-300"
            />

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={
                handleChange
              }
              required
              className="w-full bg-transparent outline-none px-3 py-4"
            />

          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Email
          </label>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4">

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
              className="w-full bg-transparent outline-none px-3 py-4"
            />

          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Password
          </label>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4">

            <Lock
              size={18}
              className="text-gray-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
              className="w-full bg-transparent outline-none px-3 py-4"
            />

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 py-4 rounded-xl font-semibold"
        >
          {loading
            ? "Creating..."
            : "Register"}
        </button>

      </form>

    </div>
  );
};

export default RegisterForm;