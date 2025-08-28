import React from "react";
import { downloadFile } from "../services/api";

const FileDownload = () => {
  return (
    <div className="flex gap-2 p-3">
      <button onClick={() => downloadFile("csv")} className="bg-green-500 text-white px-3 py-1 rounded-lg">CSV</button>
      <button onClick={() => downloadFile("excel")} className="bg-yellow-500 text-white px-3 py-1 rounded-lg">Excel</button>
      <button onClick={() => downloadFile("pdf")} className="bg-red-500 text-white px-3 py-1 rounded-lg">PDF</button>
    </div>
  );
};

export default FileDownload;