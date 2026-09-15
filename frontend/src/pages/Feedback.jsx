import { motion } from "framer-motion";
import { MessageSquareHeart } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import FeedbackForm from "../components/feedback/FeedbackForm";

const Feedback = () => {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
            <MessageSquareHeart size={15} />
            Your Feedback
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Share Your Feedback
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Your feedback helps improve the online
            voting experience and make the platform
            easier to use.
          </p>
        </motion.div>

        {/* =====================================================
            FEEDBACK FORM
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.45,
          }}
        >
          <FeedbackForm />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;