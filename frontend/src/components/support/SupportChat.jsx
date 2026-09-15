import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";

import { io } from "socket.io-client";

import ChatMessage from "./ChatMessage";
import { useAuth } from "../../context/AuthContext";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://learning-rbko.onrender.com";

const SupportChat = () => {
  const { user } = useAuth();

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [isConnected, setIsConnected] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const socketRef =
    useRef(null);

  const bottomRef =
    useRef(null);

  /*
   * =========================================================
   * ADD MESSAGE
   * =========================================================
   */

  const addMessage = useCallback(
    (incomingMessage) => {
      if (!incomingMessage) return;

      const normalizedMessage = {
        ...incomingMessage,

        sender:
          incomingMessage.sender ||
          incomingMessage.role ||
          "support",

        text:
          incomingMessage.text ||
          incomingMessage.message ||
          "",

        time:
          incomingMessage.time ||
          (incomingMessage.createdAt
            ? new Date(
                incomingMessage.createdAt
              ).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : new Date().toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )),
      };

      if (!normalizedMessage.text) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        normalizedMessage,
      ]);
    },
    []
  );

  /*
   * =========================================================
   * SOCKET CONNECTION
   * =========================================================
   */

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);

      /*
       * Current backend supports joining
       * the support room.
       */
      socket.emit(
        "join-support-room",
        {
          userId: user?._id || user?.id,
        }
      );
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = () => {
      setIsConnected(false);
    };

    const handleReceiveMessage = (
      data
    ) => {
      addMessage(data);
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "receive_message",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "receive_message",
        handleReceiveMessage
      );

      socket.disconnect();

      socketRef.current = null;
    };
  }, [user, addMessage]);

  /*
   * =========================================================
   * AUTO SCROLL
   * =========================================================
   */

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  /*
   * =========================================================
   * SEND MESSAGE
   * =========================================================
   */

  const sendMessage = () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) return;

    if (!socketRef.current) {
      return;
    }

    if (!socketRef.current.connected) {
      return;
    }

    const newMessage = {
      sender: "user",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    setIsSending(true);

    /*
     * Current backend uses send_message
     * for support chat communication.
     */
    socketRef.current.emit(
      "send_message",
      newMessage
    );

    /*
     * Immediately show user's message.
     */
    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setMessage("");

    /*
     * Small UI delay so the send state
     * feels natural without blocking chat.
     */
    setTimeout(() => {
      setIsSending(false);
    }, 250);
  };

  /*
   * =========================================================
   * KEYBOARD
   * =========================================================
   */

  const handleKeyDown = (event) => {
    /*
     * Enter = send
     * Shift + Enter = new line
     */
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  /*
   * =========================================================
   * NO USER
   * =========================================================
   */

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
              <MessageCircle
                size={30}
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Login Required
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please login to use support
              chat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
            <MessageCircle
              size={27}
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
              Live Support
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Get real-time assistance for
              your voting queries.
            </p>
          </div>
        </div>

        {/* Connection */}
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
            isConnected
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          {isConnected ? (
            <>
              <Wifi size={14} />
              Connected
            </>
          ) : (
            <>
              <WifiOff size={14} />
              Disconnected
            </>
          )}
        </div>
      </motion.div>

      {/* =====================================================
          CHAT CONTAINER
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
          duration: 0.4,
        }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl"
      >
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/30 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                <MessageCircle
                  size={19}
                />
              </div>

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                VoteSecure Support
              </p>

              <p className="text-xs text-slate-500">
                {isConnected
                  ? "Support connection active"
                  : "Connecting to support..."}
              </p>
            </div>
          </div>

          {isConnected && (
            <CheckCircle2
              size={18}
              className="text-emerald-400"
            />
          )}
        </div>

        {/* =================================================
            MESSAGES
        ================================================== */}

        <div className="h-[500px] overflow-y-auto p-4 sm:h-[600px] sm:p-6">
          <div className="space-y-4">
            {/* Welcome message */}
            {messages.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex justify-start"
              >
                <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[75%]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-400/20 bg-teal-500/10 text-teal-400">
                    <MessageCircle
                      size={15}
                    />
                  </div>

                  <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-200 shadow-lg backdrop-blur-xl sm:px-5 sm:py-4">
                    <p className="text-sm leading-6">
                      Hello 👋 Welcome to
                      VoteSecure Support.
                    </p>

                    <p className="mt-2 text-[10px] text-slate-500">
                      Now
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence initial={false}>
              {messages.map(
                (item, index) => (
                  <ChatMessage
                    key={
                      item?._id ||
                      item?.id ||
                      `${index}-${item?.time}`
                    }
                    message={item}
                  />
                )
              )}
            </AnimatePresence>

            <div
              ref={bottomRef}
              className="h-px"
            />
          </div>
        </div>

        {/* =================================================
            INPUT
        ================================================== */}

        <div className="border-t border-white/10 bg-slate-950/50 p-3 sm:p-5">
          <div className="flex items-end gap-2 sm:gap-3">
            <textarea
              rows={1}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              disabled={!isConnected}
              placeholder={
                isConnected
                  ? "Type your message..."
                  : "Connecting to support..."
              }
              className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                !message.trim() ||
                !isConnected ||
                isSending
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:h-12 sm:w-14"
            >
              {isSending ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[10px] text-slate-600 sm:text-xs">
              Press Enter to send
            </p>

            <p className="text-[10px] text-slate-600 sm:text-xs">
              Shift + Enter for new line
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupportChat;