import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquareText,
  Star,
  Send,
  Info,
} from "lucide-react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    rating: 5,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    /*
     * Current backend does not expose a /feedback endpoint.
     * Therefore no fake API request is made here.
     */
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/[0.08] to-teal-500/[0.08] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <MessageSquareText size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">
                Share Your Feedback
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your feedback can help improve the voting experience.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Backend availability notice */}
          <div className="mb-7 flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-4">
            <Info
              size={19}
              className="mt-0.5 shrink-0 text-amber-400"
            />

            <p className="text-xs leading-5 text-slate-400">
              Feedback submission is currently unavailable because
              the connected backend does not provide a feedback API
              endpoint yet.
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="space-y-7"
          >
            {/* Rating */}
            <div>
              <label
                htmlFor="rating"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Rating
              </label>

              <div className="relative">
                <Star
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
                />

                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/70 px-11 py-3.5 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/10"
                >
                  <option value="5">
                    5 — Excellent
                  </option>

                  <option value="4">
                    4 — Good
                  </option>

                  <option value="3">
                    3 — Average
                  </option>

                  <option value="2">
                    2 — Poor
                  </option>

                  <option value="1">
                    1 — Very Poor
                  </option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your feedback..."
                required
                minLength={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/10"
              />

              <div className="mt-2 text-right text-xs text-slate-600">
                {formData.message.length} characters
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-bold text-white opacity-50"
            >
              <Send size={18} />
              Feedback Submission Unavailable
            </button>

            {submitted && (
              <p className="text-center text-sm text-slate-500">
                No feedback was sent because the backend endpoint is
                not available.
              </p>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;