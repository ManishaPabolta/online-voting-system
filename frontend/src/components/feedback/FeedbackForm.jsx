import {
  useState,
} from "react";

import toast from "react-hot-toast";

import API from "../../api/axios";

const FeedbackForm = () => {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      rating: 5,
      message: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const submitHandler =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await API.post(
            "/feedback",
            formData
          );

        toast.success(
          response.data.message
        );

        setFormData({
          rating: 5,
          message: "",
        });
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Feedback Failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

      <h1 className="text-4xl font-bold mb-3">
        Feedback
      </h1>

      <p className="text-gray-400 mb-8">
        Share your voting
        experience with us
      </p>

      <form
        onSubmit={submitHandler}
        className="space-y-6"
      >

        <div>
          <label className="block mb-3 font-medium">
            Rating
          </label>

          <select
            name="rating"
            value={formData.rating}
            onChange={
              handleChange
            }
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          >
            <option value="5">
              ⭐⭐⭐⭐⭐ Excellent
            </option>

            <option value="4">
              ⭐⭐⭐⭐ Good
            </option>

            <option value="3">
              ⭐⭐⭐ Average
            </option>

            <option value="2">
              ⭐⭐ Poor
            </option>

            <option value="1">
              ⭐ Bad
            </option>

          </select>
        </div>

        <div>
          <label className="block mb-3 font-medium">
            Message
          </label>

          <textarea
            name="message"
            rows="6"
            placeholder="Write your feedback..."
            value={
              formData.message
            }
            onChange={
              handleChange
            }
            required
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-4 rounded-2xl font-bold text-lg"
        >
          {loading
            ? "Submitting..."
            : "Submit Feedback"}
        </button>

      </form>

    </div>
  );
};

export default FeedbackForm;