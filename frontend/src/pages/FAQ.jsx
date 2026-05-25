import {
  useState,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

const FAQ = () => {
  const faqs = [
    {
      question:
        "How does face verification work?",
      answer:
        "The system compares your live captured face with your registered face image.",
    },

    {
      question:
        "Can I vote multiple times?",
      answer:
        "No, each voter can cast only one vote per election.",
    },

    {
      question:
        "Is my vote anonymous?",
      answer:
        "Yes, votes are encrypted and securely stored.",
    },

    {
      question:
        "What happens if my voting link expires?",
      answer:
        "You need to request a new secure voting link.",
    },
  ];

  const [open, setOpen] =
    useState(null);

  return (
    <MainLayout>

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14">

          <h1 className="text-5xl font-black">
            FAQs
          </h1>

          <p className="text-gray-400 mt-4">
            Common questions about
            online voting
          </p>

        </div>

        <div className="space-y-5">

          {faqs.map(
            (faq, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/10 rounded-3xl overflow-hidden"
              >

                <button
                  onClick={() =>
                    setOpen(
                      open === index
                        ? null
                        : index
                    )
                  }
                  className="w-full flex items-center justify-between px-6 py-5"
                >

                  <span className="font-semibold text-lg">
                    {
                      faq.question
                    }
                  </span>

                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      open === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {open ===
                  index && (
                  <div className="px-6 pb-6 text-gray-300">
                    {
                      faq.answer
                    }
                  </div>
                )}

              </div>
            )
          )}

        </div>

      </div>

    </MainLayout>
  );
};

export default FAQ;