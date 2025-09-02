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


import React from "react";
import Chat from "./chat";  // Import Chat.js
import "./index.css";       // Import global styles

function App() {
  return (
    <div className="app-container">
      <Chat />
    </div>
  );
}

export default App;
