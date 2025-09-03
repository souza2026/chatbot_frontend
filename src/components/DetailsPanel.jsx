import React from "react";
import "./details.css"; // Import the new CSS file

// Helper: Prettify key names (e.g., contract_name to Contract Name)
function prettifyKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Icon Components
const CloseIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const DetailsIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
        <path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>
    </svg>
);

// Field component using the new CSS classes
const Field = ({ label, value }) => {
  let displayValue;
  if (value === null || value === undefined || value === "") {
    displayValue = <span style={{ color: 'var(--color-text-secondary)' }}>—</span>;
  } else if (typeof value === 'object') {
    displayValue = <pre>{JSON.stringify(value, null, 2)}</pre>;
  } else {
    displayValue = String(value);
  }

  return (
    <div className="field">
      <div className="field-label">{prettifyKey(label)}</div>
      <div className="field-value">{displayValue}</div>
    </div>
  );
};

const DetailsPanel = ({ item, onClose, title = "Details" }) => {
  if (!item) return null;
  const entries = Object.entries(item);

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="details-header">
          <div className="details-title">
            <DetailsIcon />
            {title}
          </div>
          <button
            className="details-close-btn"
            onClick={onClose}
            autoFocus
            aria-label="Close details"
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* Body */}
        <div className="details-body">
          {entries.map(([key, val]) => (
            <Field key={key} label={key} value={val} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;
