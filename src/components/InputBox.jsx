import React, { useState } from "react";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-3 bg-white border-t">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about contracts..."
        className="flex-1 p-2 border rounded-lg"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Send
      </button>
    </form>
  );
};

export default InputBox;