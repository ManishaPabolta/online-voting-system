import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  MessageCircle,
} from "lucide-react";

import io from "socket.io-client";

import ChatMessage from "./ChatMessage";

const socket = io(
  import.meta.env.VITE_SOCKET_URL
);

const SupportChat = () => {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        sender: "support",
        text: "Hello 👋 Welcome to VoteSecure Support.",
        time: "Now",
      },
    ]);

  const bottomRef =
    useRef(null);

  useEffect(() => {
    socket.on(
      "receive_message",
      (data) => {
        setMessages(
          (prev) => [
            ...prev,
            data,
          ]
        );
      }
    );

    return () => {
      socket.off(
        "receive_message"
      );
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  const sendMessage =
    async () => {
      if (!message.trim())
        return;

      const newMessage = {
        sender: "user",
        text: message,
        time:
          new Date().toLocaleTimeString(),
      };

      socket.emit(
        "send_message",
        newMessage
      );

      setMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setMessage("");
    };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex items-center gap-4 mb-8">

        <div className="bg-blue-600 p-4 rounded-2xl shadow-xl">
          <MessageCircle
            size={32}
          />
        </div>

        <div>

          <h1 className="text-4xl font-bold">
            Live Support Chat
          </h1>

          <p className="text-gray-400 mt-2">
            Real-time assistance
            for voters
          </p>

        </div>

      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <div className="h-[600px] overflow-y-auto p-6 space-y-5">

          {messages.map(
            (
              message,
              index
            ) => (
              <ChatMessage
                key={index}
                message={
                  message
                }
              />
            )
          )}

          <div ref={bottomRef} />

        </div>

        <div className="border-t border-white/10 p-5 flex items-center gap-4 bg-slate-950/40">

          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage()
            }
            className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 p-4 rounded-2xl shadow-xl"
          >
            <Send size={22} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default SupportChat;