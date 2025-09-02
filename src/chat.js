

// import React, { useState, useEffect } from "react";
// import "./chat.css";

// export default function Chat() {
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Hello! How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);

//   // Load history on mount
//   useEffect(() => {
//     const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
//     setChatHistory(storedHistory);
//   }, []);

//   // Save updated chat to history when messages change
//   useEffect(() => {
//     if (messages.length > 1) {
//       setChatHistory((prevHistory) => {
//         const updatedHistory = [...prevHistory];
//         updatedHistory[updatedHistory.length - 1] = messages;
//         localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
//         return updatedHistory;
//       });
//     }
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { from: "user", text: input }]);
//     setInput("");
//   };

//   const startNewChat = () => {
//     setChatHistory((prevHistory) => {
//       const updatedHistory = [...prevHistory, messages];
//       localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
//       return updatedHistory;
//     });
//     setMessages([{ from: "bot", text: "Hello! How can I help you today?" }]);
//   };

//   const loadChat = (chat) => {
//     setMessages(chat);
//     setShowHistory(false);
//   };

//   const clearHistory = () => {
//     localStorage.removeItem("chatHistory");
//     setChatHistory([]);
//   };

//   return (
//     <div className="chat-wrapper">
//       {/* Sidebar */}
//       {showHistory && (
//         <div className="chat-history">
//           <h3>Previous Chats</h3>
//           {chatHistory.length === 0 ? (
//             <p className="empty-history">No chats yet</p>
//           ) : (
//             chatHistory.map((chat, idx) => (
//               <div
//                 key={idx}
//                 className="chat-history-item"
//                 onClick={() => loadChat(chat)}
//               >
//                 {chat[1]?.text?.slice(0, 20) || "New Chat"}...
//               </div>
//             ))
//           )}
//           {chatHistory.length > 0 && (
//             <button className="clear-btn" onClick={clearHistory}>
//               🗑️ Clear All
//             </button>
//           )}
//         </div>
//       )}

//       {/* Chat window */}
//       <div className="chat-container">
//         <div className="chat-header">
//           <span>ChatBot</span>
//           <div className="chat-actions">
//             <button onClick={() => setShowHistory(!showHistory)}>
//               📜 History
//             </button>
//             <button onClick={startNewChat}>➕ New</button>
//           </div>
//         </div>

//         <div className="chat-body">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`chat-bubble ${msg.from === "user" ? "user" : "bot"}`}
//             >
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         <div className="chat-input">
//           <input
//             type="text"
//             value={input}
//             placeholder="Type a message..."
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button onClick={sendMessage}>➤</button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import "./chat.css";

// export default function Chat() {
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Hello! How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);

//   // Load history when app starts
//   useEffect(() => {
//     const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
//     setChatHistory(storedHistory);
//   }, []);

//   // Save current chat to history whenever messages update
//   useEffect(() => {
//     if (messages.length > 1) {
//       setChatHistory((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = messages;
//         localStorage.setItem("chatHistory", JSON.stringify(updated));
//         return updated;
//       });
//     }
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { from: "user", text: input }]);
//     setInput("");
//   };

//   const startNewChat = () => {
//     setChatHistory((prev) => {
//       const updated = [...prev, messages];
//       localStorage.setItem("chatHistory", JSON.stringify(updated));
//       return updated;
//     });
//     setMessages([{ from: "bot", text: "Hello! How can I help you today?" }]);
//   };

//   const loadChat = (chat) => {
//     setMessages(chat);
//     setShowHistory(false);
//   };

//   const clearHistory = () => {
//     localStorage.removeItem("chatHistory");
//     setChatHistory([]);
//   };

//   return (
//     <div className="chat-container">
//       {/* Header */}
//       <div className="chat-header">
//         <span>ChatBot</span>
//         <div className="chat-actions">
//           <button onClick={() => setShowHistory(true)}>📜</button>
//           <button onClick={startNewChat}>➕</button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="chat-body">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`chat-bubble ${msg.from === "user" ? "user" : "bot"}`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           placeholder="Type a message..."
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage}>➤</button>
//       </div>

//       {/* History Modal */}
//       {showHistory && (
//         <div className="history-overlay">
//           <div className="history-modal">
//             <h3>Previous Chats</h3>
//             {chatHistory.length === 0 ? (
//               <p className="empty-history">No chats yet</p>
//             ) : (
//               chatHistory.map((chat, idx) => (
//                 <div
//                   key={idx}
//                   className="chat-history-item"
//                   onClick={() => loadChat(chat)}
//                 >
//                   {chat[1]?.text?.slice(0, 25) || "New Chat"}...
//                 </div>
//               ))
//             )}
//             <div className="history-actions">
//               <button onClick={() => setShowHistory(false)}>❌ Close</button>
//               {chatHistory.length > 0 && (
//                 <button className="clear-btn" onClick={clearHistory}>
//                   🗑️ Clear All
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import "./chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history when app starts
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedHistory);
  }, []);

  // Save current chat to history whenever messages update
  useEffect(() => {
    if (messages.length > 1) {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = messages;
        localStorage.setItem("chatHistory", JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages]);

  // Fake bot response generator
  const getBotReply = (userMsg) => {
    if (userMsg.toLowerCase().includes("services")) {
      return "We offer a variety of services including AI chat support, automation, and more!";
    }
    if (userMsg.toLowerCase().includes("hello")) {
      return "Hi there! 👋 How are you doing today?";
    }
    if (userMsg.toLowerCase().includes("bye")) {
      return "Goodbye! Hope to talk to you again soon.";
    }
    return "That’s interesting! Tell me more.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: getBotReply(input) };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  const startNewChat = () => {
    setChatHistory((prev) => {
      const updated = [...prev, messages];
      localStorage.setItem("chatHistory", JSON.stringify(updated));
      return updated;
    });
    setMessages([{ from: "bot", text: "Hello! How can I help you today?" }]);
  };

  const loadChat = (chat) => {
    setMessages(chat);
    setShowHistory(false);
  };

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <span>ChatBot</span>
        <div className="chat-actions">
          <button onClick={() => setShowHistory(true)}>📜</button>
          <button onClick={startNewChat}>➕</button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.from === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="history-overlay">
          <div className="history-modal">
            <h3>Previous Chats</h3>
            {chatHistory.length === 0 ? (
              <p className="empty-history">No chats yet</p>
            ) : (
              chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className="chat-history-item"
                  onClick={() => loadChat(chat)}
                >
                  {chat[1]?.text?.slice(0, 25) || "New Chat"}...
                </div>
              ))
            )}
            <div className="history-actions">
              <button onClick={() => setShowHistory(false)}>❌ Close</button>
              {chatHistory.length > 0 && (
                <button className="clear-btn" onClick={clearHistory}>
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
