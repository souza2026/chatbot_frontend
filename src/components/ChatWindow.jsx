import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import { sendMessage } from "../services/api";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me about your contracts 📑" }
  ]);

  const handleSend = async (text) => {
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);

    const response = await sendMessage(text);
    setMessages([...newMessages, { sender: "bot", text: response.reply }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;