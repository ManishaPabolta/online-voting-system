import { motion } from "framer-motion";
import { Bot, UserRound } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isUser = message?.sender === "user";

  const text =
    message?.text ||
    message?.message ||
    "";

  const time =
    message?.time ||
    (message?.createdAt
      ? new Date(
          message.createdAt
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "");

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${
          isUser
            ? "flex-row-reverse"
            : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
            isUser
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
              : "border-teal-400/20 bg-teal-500/10 text-teal-400"
          }`}
        >
          {isUser ? (
            <UserRound size={15} />
          ) : (
            <Bot size={15} />
          )}
        </div>

        {/* Message */}
        <div
          className={`rounded-3xl px-4 py-3 shadow-lg sm:px-5 sm:py-4 ${
            isUser
              ? "rounded-br-md border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
              : "rounded-bl-md border border-white/10 bg-white/[0.06] text-slate-200 backdrop-blur-xl"
          }`}
        >
          <p className="break-words text-sm leading-6">
            {text}
          </p>

          {time && (
            <p
              className={`mt-2 text-[10px] ${
                isUser
                  ? "text-emerald-50/80"
                  : "text-slate-500"
              }`}
            >
              {time}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;