import axios from "axios";

const API_BASE = "http://localhost:5000"; // Flask backend URL

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE}/chat`, { query: message });
    return response.data;
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return { reply: "Server error. Try again later." };
  }
};

export const downloadFile = async (format) => {
  window.location.href = `${API_BASE}/download?format=${format}`;
};
