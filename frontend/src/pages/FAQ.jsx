import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CircleHelp,
  ShieldCheck,
  Vote,
  UserCheck,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

const FAQ = () => {
  const faqs = [
    {
      question: "How does face verification work?",
      answer:
        "The system compares your live captured face with your registered face image.",
      icon: UserCheck,
    },
    {
      question: "Can I vote multiple times?",
      answer:
        "No, each voter can cast only one vote per election.",
      icon: Vote,
    },
    {
      question: "Is my vote anonymous?",
      answer:
        "Yes, votes are encrypted and securely stored.",
      icon: ShieldCheck,
    },
    {
      question: "What happens if my voting link expires?",
      answer:
        "You need to request a new secure voting link.",
      icon: CircleHelp,
    },
  ];

  const [open, setOpen] = useState(null);

  const toggleFAQ = (index) => {
    setOpen((current) =>
      current === index ? null : index
    );
  };

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
          >
            <CircleHelp
              size={30}
              className="text-emerald-400"
            />
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Find answers to common questions about
            the online voting process.
          </p>
        </motion.div>

        {/* =====================================================
            FAQ LIST
        ====================================================== */}

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = open === index;

            return (
              <motion.div
                key={faq.question}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                }}
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isOpen
                    ? "border-emerald-400/30 bg-emerald-500/[0.06] shadow-lg shadow-emerald-500/5"
                    : "border-white/10 bg-white/[0.03] hover:border-emerald-400/20 hover:bg-white/[0.05]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isOpen
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-800/80 text-emerald-400"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* QUESTION */}

                  <span className="flex-1 pr-2 text-sm font-bold text-white sm:text-base">
                    {faq.question}
                  </span>

                  {/* ARROW */}

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <ChevronDown
                      size={19}
                      className={`transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* ANSWER */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="border-t border-white/10 px-5 pb-6 pt-5 sm:px-6">
                        <div className="ml-0 border-l-2 border-emerald-500/40 pl-4 sm:ml-[60px]">
                          <p className="text-sm leading-7 text-slate-400 sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM INFO
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
            delay: 0.45,
          }}
          className="mt-10 rounded-3xl border border-teal-400/20 bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.05] p-6 text-center sm:p-8"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
            <ShieldCheck size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-white">
            Secure Online Voting
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Please make sure your account and
            eligibility requirements are completed
            before participating in an election.
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FAQ;