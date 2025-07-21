"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Uploaded successfully!");
    } catch (error) {
      setMessage("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold text-pink-600">
        Resume Analyzer <span className="text-gray-800">by Rupesh AI</span>
     </h1>

      <p className="text-md md:text-lg text-pink-500 mb-10 text-center max-w-xl">
        You can check your resume ATS score free and chat with AI to improve your ATS score
      </p>


      <div className="bg-pink-50 border border-pink-200 rounded-2xl p-8 shadow-lg w-full max-w-md flex flex-col items-center">

        <div className="border-2 border-dashed border-pink-400 rounded-2xl p-8 shadow-lg bg-white max-w-md mx-auto text-center hover:border-pink-600 transition">
        <label className="cursor-pointer">
            <input type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange} className="hidden" />
            <span className="bg-pink-100 text-pink-700 font-semibold px-4 py-2 rounded-full">Choose File</span>
        </label>
        <p className="mt-2 text-sm text-gray-500">or drag and drop your resume here</p>
        <button onClick={handleUpload} disabled={!file || uploading} className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition font-bold">
             {uploading ? "Uploading..." : "Upload"}
        </button>
        </div>
        {message && <p className="text-green-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
