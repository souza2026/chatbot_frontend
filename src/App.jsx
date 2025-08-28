import React from "react";
import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;