import React from "react";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";
  const content = typeof text === "object" ? JSON.stringify(text, null, 2) : text;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-3 rounded-2xl max-w-xl whitespace-pre-wrap ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
