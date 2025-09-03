
import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import MessageBubble from "./MessageBubble";
import DetailsPanel from "./DetailsPanel";
import { sendMessage as sendMessageApi } from "../services/api";

// SVG Icons for buttons
const HistoryIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></svg>
);

const NewChatIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const SendIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const PAGE_SIZE = 20;

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am your AI assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatBodyRef = useRef(null);

  // Pagination state for each message index that is a list
  const [pagination, setPagination] = useState({}); // { [msgIndex]: { page: number, totalPages: number } }

  // --- Auto-scroll to bottom ---
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Load history when app starts
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedHistory);
  }, []);

  const preferNameKey = (obj) => {
    const nameKeys = ["company_name", "contract_name", "name", "title"];
    return nameKeys.find((k) => k in obj);
  };

  const preferIdKey = (obj) => {
    const idKeys = ["company_id", "contract_id", "id"];
    return idKeys.find((k) => k in obj);
  };

  // Accepts rows and page, returns items for that page
  const makeListItems = (rows, page = 1) => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return rows.slice(start, end).map((row) => {
      const idKey = preferIdKey(row);
      const nameKey = preferNameKey(row);
      return {
        id: idKey ? row[idKey] : (row.id ?? row.contract_id ?? row.company_id ?? "unknown-id"),
        name: nameKey ? row[nameKey] : (row.name ?? row.contract_name ?? row.company_name ?? "(no name)"),
        full: row,
      };
    });
  };

  const isCountIntent = (text) => /\b(how many|count|number of)\b/i.test(text);
  const isWhichListIntent = (text) => /\b(which|list)\b/i.test(text);

  // Helper: Try to extract a count value from a row object
  const extractCountFromRow = (row) => {
    // Find the first key that looks like a count (e.g., ends with 'count' or is 'count1', etc.)
    if (!row || typeof row !== "object") return null;
    for (const key of Object.keys(row)) {
      if (/count/i.test(key)) {
        return row[key];
      }
    }
    return null;
  };

  // Send message using API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const loadingMsg = { from: "bot", text: { type: "loading" } };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");

    try {
      const response = await sendMessageApi(input);
      setMessages((prev) => {
        const next = [...prev];
        const replaceAt = next.findIndex((m) => m.text?.type === "loading");
        const rows = Array.isArray(response?.rows) ? response.rows : [];

        if (response?.status === "success") {
          if (isCountIntent(userMsg.text)) {
            // Try to extract count from the first row, e.g. rows[0].count1
            let count = null;
            if (rows.length > 0) {
              count = extractCountFromRow(rows[0]);
            }
            // Fallback: if not found, use rows.length
            if (count === null || count === undefined) {
              count = rows.length;
            }
            let subject = /companies?/i.test(userMsg.text)
              ? "companies"
              : /contracts?/i.test(userMsg.text)
              ? "contracts"
              : "items";
            next[replaceAt] = {
              from: "bot",
              text: {
                type: "text",
                value: `There ${count === 1 ? "is" : "are"} ${count} ${subject}.`,
              },
            };
          } else if (isWhichListIntent(userMsg.text) || rows.length > 0) {
            // Pagination: always start at page 1
            const page = 1;
            const totalPages = Math.ceil(rows.length / PAGE_SIZE);
            const items = makeListItems(rows, page);
            const more = rows.length > items.length ? `\n…and ${rows.length - items.length} more.` : "";
            next[replaceAt] = {
              from: "bot",
              text: {
                type: "text",
                value: `Here ${rows.length === 1 ? "is" : "are"} the result${rows.length === 1 ? "" : "s"}:${totalPages > 1 ? ` (page ${page} of ${totalPages})` : ""}`,
                pagination: { page, totalPages, rows }, // store for pagination controls
              },
            };
            next.splice(replaceAt + 1, 0, { from: "bot", text: { type: "list", items, pagination: { page, totalPages, rows } } });
            // Set pagination state for this message index
            setPagination((prevPag) => ({
              ...prevPag,
              [replaceAt + 1]: { page, totalPages, rows }
            }));
          } else {
            next[replaceAt] = { from: "bot", text: { type: "text", value: "No results found." } };
          }
        } else if (response?.status === "error") {
          next[replaceAt] = { from: "bot", text: { type: "text", value: response.message || "Request failed." } };
        } else {
          next[replaceAt] = { from: "bot", text: { type: "text", value: "Unexpected response from server." } };
        }
        return next;
      });
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        const replaceAt = next.findIndex((m) => m.text?.type === "loading");
        if (replaceAt >= 0) {
          next[replaceAt] = { from: "bot", text: { type: "text", value: "Error contacting server." } };
          return next;
        }
        return [...prev, { from: "bot", text: { type: "text", value: "Error contacting server." } }];
      });
    }
  };

  // Pagination controls for a list message
  const handlePageChange = (msgIndex, direction) => {
    setMessages((prevMsgs) => {
      const nextMsgs = [...prevMsgs];
      const listMsg = nextMsgs[msgIndex];
      if (!listMsg || !listMsg.text || !listMsg.text.pagination) return prevMsgs;

      const { page, totalPages, rows } = listMsg.text.pagination;
      let newPage = page;
      if (direction === "next" && page < totalPages) newPage = page + 1;
      if (direction === "prev" && page > 1) newPage = page - 1;
      if (newPage === page) return prevMsgs;

      // Update the list items for the new page
      const items = makeListItems(rows, newPage);
      nextMsgs[msgIndex] = {
        ...listMsg,
        text: {
          ...listMsg.text,
          items,
          pagination: { page: newPage, totalPages, rows }
        }
      };

      // Also update the preceding text message (if present)
      if (
        msgIndex > 0 &&
        nextMsgs[msgIndex - 1] &&
        nextMsgs[msgIndex - 1].from === "bot" &&
        nextMsgs[msgIndex - 1].text &&
        typeof nextMsgs[msgIndex - 1].text === "object" &&
        nextMsgs[msgIndex - 1].text.type === "text" &&
        nextMsgs[msgIndex - 1].text.pagination
      ) {
        nextMsgs[msgIndex - 1] = {
          ...nextMsgs[msgIndex - 1],
          text: {
            ...nextMsgs[msgIndex - 1].text,
            value: `Here ${rows.length === 1 ? "is" : "are"} the result${rows.length === 1 ? "" : "s"}: (page ${newPage} of ${totalPages})`,
            pagination: { page: newPage, totalPages, rows }
          }
        };
      }

      // Update pagination state
      setPagination((prevPag) => ({
        ...prevPag,
        [msgIndex]: { page: newPage, totalPages, rows }
      }));

      return nextMsgs;
    });
  };

  const startNewChat = () => {
    if (messages.length > 1) {
      setChatHistory((prev) => {
        const updated = [...prev, messages];
        localStorage.setItem("chatHistory", JSON.stringify(updated));
        return updated;
      });
    }
    setMessages([{ from: "bot", text: "Hello! I am your AI assistant. How can I help?" }]);
    setPagination({});
  };

  const loadChat = (chat) => {
    setMessages(chat);
    setShowHistory(false);
    setPagination({});
  };

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  // Render MessageBubble and, if it's a list, render pagination controls
  const renderMessage = (msg, i) => {
    // If this is a list message with pagination, show controls
    if (
      msg.from === "bot" &&
      typeof msg.text === "object" &&
      msg.text.type === "list" &&
      msg.text.pagination
    ) {
      const { page, totalPages } = msg.text.pagination;
      return (
        <div key={i}>
          <MessageBubble
            sender={msg.from}
            text={msg.text}
            onItemClick={(item) => setSelected(item)}
          />
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(i, "prev")}
              disabled={page <= 1}
              className="pagination-btn"
            >
              Prev
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(i, "next")}
              disabled={page >= totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      );
    }
    return (
      <MessageBubble
        key={i}
        sender={msg.from}
        text={msg.text}
        onItemClick={(item) => setSelected(item)}
      />
    );
  };

  // Use a React Fragment to return multiple elements
  return (
    <>
      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="chat-header">
            <span>AI Assistant</span>
            <div className="chat-actions">
              <button className="header-btn" onClick={() => setShowHistory(true)}><HistoryIcon /></button>
              <button className="header-btn" onClick={startNewChat}><NewChatIcon /></button>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, i) => renderMessage(msg, i))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={!input.trim()}><SendIcon /></button>
          </div>

          {showHistory && (
            <div className="history-overlay" onClick={() => setShowHistory(false)}>
              <div className="history-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Chat History</h3>
                <div className="history-list">
                  {chatHistory.length === 0 ? (
                    <p className="empty-history">No previous chats</p>
                  ) : (
                    chatHistory.map((chat, idx) => (
                      <div
                        key={idx}
                        className="chat-history-item"
                        onClick={() => loadChat(chat)}
                      >
                        {chat[1]?.text?.slice(0, 30) || "Chat"}...
                      </div>
                    ))
                  )}
                </div>
                <div className="history-actions">
                  <button className="close-btn" onClick={() => setShowHistory(false)}>Close</button>
                  {chatHistory.length > 0 && (
                    <button className="clear-btn" onClick={clearHistory}>Clear All</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ↓↓↓ THIS IS THE FIX ↓↓↓
        Move the DetailsPanel outside of the chat-wrapper div.
      */}
      <DetailsPanel item={selected} onClose={() => setSelected(null)} />
    </>
  );
}