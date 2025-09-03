// src/components/MessageBubble.jsx
import React from "react";

const Loading = () => (
  <div className="loading-indicator">
    <span />
    <span />
    <span />
  </div>
);

const ListMessage = ({ items, onItemClick }) => (
  <div className="list-message">
    {items.map((it) => (
      <button
        key={String(it.id)}
        className="list-item-btn"
        onClick={() => onItemClick?.(it.full)}
      >
        <div className="name">{it.name ?? "(no name)"}</div>
        <div className="id">{String(it.id)}</div>
      </button>
    ))}
  </div>
);

const MessageBubble = ({ sender, text, onItemClick }) => {
  const isUser = sender === "user";

  let contentNode = null;
  if (typeof text === "object" && text !== null) {
    switch (text.type) {
      case "loading":
        contentNode = <Loading />;
        break;
      case "list":
        contentNode = <ListMessage items={text.items} onItemClick={onItemClick} />;
        break;
      case "text":
        contentNode = text.value;
        break;
      default:
        contentNode = JSON.stringify(text, null, 2);
    }
  } else {
    contentNode = text;
  }

  return (
    <div className={`message-bubble-wrapper ${isUser ? "user" : "bot"}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        {contentNode}
      </div>
    </div>
  );
};

export default MessageBubble;