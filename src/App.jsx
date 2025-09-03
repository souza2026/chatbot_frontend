// import React from "react";
// import Chat from "./chat";   // ✅ import chat.js

// function App() {
//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden">
//         <Chat />   {/* ✅ render Chat component */}
//       </div>
//     </div>
//   );
// }

// export default App;


// src/App.jsx
import React from "react";
import ChatWindow from "./components/ChatWindow";
// import "./index.css"; // Ensure this is imported


function App() {
  return (
    <div className="app-container">
      <ChatWindow />
    </div>
  );
}

export default App;
