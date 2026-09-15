import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserRound,
  Phone,
  MapPin,
  CreditCard,
  Upload,
  Save,
  Loader2,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createProfile,
  updateProfile,
} from "../../api/profileApi";

const ProfileForm = ({ user }) => {
  const isEdit = Boolean(user);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    address: user?.address || "",
    phone: user?.phone || "",
    aadhaarNumber: user?.aadhaarNumber || "",
    voterId: user?.voterId || "",
    idProof: null,
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      age: user?.age || "",
      gender: user?.gender || "",
      address: user?.address || "",
      phone: user?.phone || "",
      aadhaarNumber: user?.aadhaarNumber || "",
      voterId: user?.voterId || "",
      idProof: null,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const fileHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG or PDF files are allowed"
      );

      e.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("File size must be less than 10 MB");

      e.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      idProof: file,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.age) {
      toast.error("Please enter your age");
      return;
    }

    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    if (!formData.aadhaarNumber.trim()) {
      toast.error("Please enter your Aadhaar number");
      return;
    }

    if (!formData.voterId.trim()) {
      toast.error("Please enter your Voter ID");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("address", formData.address.trim());
      data.append("phone", formData.phone.trim());
      data.append(
        "aadhaarNumber",
        formData.aadhaarNumber.trim()
      );
      data.append("voterId", formData.voterId.trim());

      /*
       * IMPORTANT:
       * Backend expects upload.single("idProof")
       */
      if (formData.idProof) {
        data.append("idProof", formData.idProof);
      }

      const response = isEdit
        ? await updateProfile(data)
        : await createProfile(data);

      const message =
        response?.message ||
        response?.data?.message ||
        (isEdit
          ? "Profile updated successfully"
          : "Profile created successfully");

      toast.success(message);

      if (!isEdit) {
        setFormData((previous) => ({
          ...previous,
          idProof: null,
        }));
      }
    } catch (error) {
      console.error("Profile error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to save profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/10";

  const labelClass =
    "mb-2.5 block text-sm font-semibold text-slate-200";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={submitHandler}
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/[0.08] to-teal-500/[0.08] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <UserRound size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              {isEdit ? "Update Profile" : "Create Profile"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isEdit
                ? "Keep your voter profile information up to date."
                : "Complete your voter profile for eligibility verification."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Verification Notice */}
        <div className="mb-8 flex gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Voter Verification
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your profile information is used for voter eligibility
              verification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className={labelClass}>
              Age
            </label>

            <input
              id="age"
              type="number"
              name="age"
              min="18"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className={labelClass}>
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* Aadhaar */}
          <div>
            <label
              htmlFor="aadhaarNumber"
              className={labelClass}
            >
              Aadhaar Number
            </label>

            <div className="relative">
              <CreditCard
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="aadhaarNumber"
                type="text"
                name="aadhaarNumber"
                inputMode="numeric"
                placeholder="Enter Aadhaar number"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                required
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* Voter ID */}
          <div>
            <label htmlFor="voterId" className={labelClass}>
              Voter ID
            </label>

            <input
              id="voterId"
              type="text"
              name="voterId"
              placeholder="Enter Voter ID"
              value={formData.voterId}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label htmlFor="address" className={labelClass}>
            Address
          </label>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-4 top-4 text-slate-500"
            />

            <textarea
              id="address"
              name="address"
              rows={5}
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`${inputClass} resize-none pl-11`}
            />
          </div>
        </div>

        {/* ID Proof */}
        <div className="mt-6">
          <label
            htmlFor="idProof"
            className={labelClass}
          >
            ID Proof
          </label>

          <label
            htmlFor="idProof"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-8 text-center transition hover:border-emerald-400/40 hover:bg-emerald-500/[0.03]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 transition group-hover:scale-105">
              {formData.idProof ? (
                <FileCheck2 size={24} />
              ) : (
                <Upload size={24} />
              )}
            </div>

            <p className="mt-4 text-sm font-semibold text-white">
              {formData.idProof
                ? formData.idProof.name
                : "Choose your ID proof"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              JPG, JPEG, PNG or PDF • Maximum 10 MB
            </p>

            <input
              id="idProof"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={fileHandler}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEdit
                  ? "Update Profile"
                  : "Create Profile"}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default ProfileForm;