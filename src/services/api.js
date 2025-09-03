import axios from "axios";

const API_URL = "http://127.0.0.1:5001/api/chatbot/ask-gemini";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
      { message },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error communicating with backend:", error);
    
    return { status: "error", message: "Server error. Try again later.", sql: null };
  }
};

// Kept for compatibility if used elsewhere; adjust/remove if not needed
export const downloadFile = async (_format) => {
  console.warn("downloadFile is not supported for the ask-gemini endpoint.");
};
