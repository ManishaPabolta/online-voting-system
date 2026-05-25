import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { ShieldCheck } from "lucide-react";

import { verifyOTP } from "../../api/authApi";

const OTPForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await verifyOTP(formData);

      toast.success("OTP Verified Successfully");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      
      <div className="text-center mb-8">
        
        <div className="flex justify-center mb-4">
          <div className="bg-purple-600 p-4 rounded-full">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-3xl font-bold">
          Verify OTP
        </h2>

        <p className="text-gray-300 mt-2">
          Enter your email and OTP
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 outline-none"
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          required
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 outline-none text-center text-2xl tracking-widest"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-4 rounded-xl font-semibold"
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

      </form>

    </div>
  );
};

export default OTPForm;