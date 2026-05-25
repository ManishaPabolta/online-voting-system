import {
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  createProfile,
  updateProfile,
} from "../../api/profileApi";

const ProfileForm = ({
  user,
}) => {

  const isEdit = !!user;

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: user?.name || "",

      age: user?.age || "",

      gender:
        user?.gender || "",

      address:
        user?.address || "",

      phone:
        user?.phone || "",

      aadhaarNumber:
        user?.aadhaarNumber || "",

      voterId:
        user?.voterId || "",

      /**
       * IMPORTANT
       * SAME NAME AS:
       * upload.single("idProof")
       */
      idProof: null,
    });

  /**
   * HANDLE INPUT CHANGE
   */
  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  /**
   * HANDLE FILE
   */
  const fileHandler = (e) => {

    setFormData({
      ...formData,

      idProof:
        e.target.files[0],
    });
  };

  /**
   * SUBMIT FORM
   */
  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        /**
         * FORM DATA
         */
        const data =
          new FormData();

        data.append(
          "name",
          formData.name
        );

        data.append(
          "age",
          formData.age
        );

        data.append(
          "gender",
          formData.gender
        );

        data.append(
          "address",
          formData.address
        );

        data.append(
          "phone",
          formData.phone
        );

        data.append(
          "aadhaarNumber",
          formData.aadhaarNumber
        );

        data.append(
          "voterId",
          formData.voterId
        );

        /**
         * FILE
         */
        if (formData.idProof) {

          data.append(
            "idProof",
            formData.idProof
          );
        }

        let response;

        /**
         * CREATE / UPDATE
         */
        if (isEdit) {

          response =
            await updateProfile(
              data
            );

        } else {

          response =
            await createProfile(
              data
            );
        }

        toast.success(
          response.message
        );

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Profile Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <form
      onSubmit={submitHandler}
      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
    >

      <h1 className="text-4xl font-bold mb-10">

        {
          isEdit
            ? "Update Profile"
            : "Create Profile"
        }

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* FULL NAME */}
        <div>

          <label className="block mb-3">
            Full Name
          </label>

          <input
            type="text"

            name="name"

            placeholder="Enter full name"

            value={formData.name}

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* AGE */}
        <div>

          <label className="block mb-3">
            Age
          </label>

          <input
            type="number"

            name="age"

            placeholder="Enter age"

            value={formData.age}

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* GENDER */}
        <div>

          <label className="block mb-3">
            Gender
          </label>

          <select
            name="gender"

            value={formData.gender}

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
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

        {/* PHONE */}
        <div>

          <label className="block mb-3">
            Phone Number
          </label>

          <input
            type="text"

            name="phone"

            placeholder="Enter phone number"

            value={formData.phone}

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* AADHAAR */}
        <div>

          <label className="block mb-3">
            Aadhaar Number
          </label>

          <input
            type="text"

            name="aadhaarNumber"

            placeholder="Enter Aadhaar number"

            value={
              formData.aadhaarNumber
            }

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

        {/* VOTER ID */}
        <div>

          <label className="block mb-3">
            Voter ID
          </label>

          <input
            type="text"

            name="voterId"

            placeholder="Enter voter ID"

            value={
              formData.voterId
            }

            onChange={handleChange}

            required

            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

        </div>

      </div>

      {/* ADDRESS */}
      <div className="mt-6">

        <label className="block mb-3">
          Address
        </label>

        <textarea
          name="address"

          rows="5"

          placeholder="Enter full address"

          value={formData.address}

          onChange={handleChange}

          required

          className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none"
        />

      </div>

      {/* FILE */}
      <div className="mt-6">

        <label className="block mb-3">
          Upload ID Proof
        </label>

        <input
          type="file"

          accept="image/*"

          onChange={fileHandler}

          className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4"
        />

      </div>

      {/* BUTTON */}
      <button
        type="submit"

        disabled={loading}

        className="mt-8 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-4 rounded-2xl font-bold"
      >

        {
          loading
            ? "Saving..."
            : isEdit
            ? "Update Profile"
            : "Create Profile"
        }

      </button>

    </form>
  );
};

export default ProfileForm;