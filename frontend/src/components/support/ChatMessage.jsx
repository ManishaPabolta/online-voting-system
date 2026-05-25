const ChatMessage = ({
  message,
}) => {
  const isUser =
    message.sender === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[75%] px-5 py-4 rounded-3xl shadow-xl
        ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white/10 border border-white/10 rounded-bl-md"
        }`}
      >

        <p className="text-sm leading-relaxed">
          {message.text}
        </p>

        <p className="text-xs text-gray-300 mt-2 text-right">
          {message.time}
        </p>

      </div>

    </div>
  );
};

export default ChatMessage;