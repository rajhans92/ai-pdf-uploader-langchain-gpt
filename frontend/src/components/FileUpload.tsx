"use client";

import { useState } from "react"

type Props = {
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
  setFileUploaded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FileUpload({setFileUploaded, setResumeData}:Props) {

    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
            setMessage("");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage("File is being uploaded..."); 

        const formData = new FormData();
        formData.append("doc", file);
    
        try {
          const res = await fetch("http://localhost:4000/api/v1/chat/pdfUploader", {
            method: "POST",
            body: formData,
          });
    
          const data = await res.json();
          setFileUploaded(false);
          setMessage(data.message || "Uploaded successfully!");
        } catch (error) {
          setMessage("Upload failed.");
        } finally {
          setUploading(false);
        }
    }

    return (
        <div className="text-center">
          <div className="flex items-center justify-center">
              <div className="bg-[#d4efdf] border border--[#145a32] p-6 rounded-2xl shadow-lg w-lg ">
                    <div className="flex items-center justify-center mt-6">
                      <label className="block mb-4 w-xs font-bold">
                        <input type="file" onChange={handleFileChange} accept=".pdf,.docx" disabled={uploading} name="small-file-input" id="small-file-input" className="block w-full border border-[#7dcea0] shadow-sm rounded-lg text-sm focus:z-10 focus:border-[#145a32] focus:ring-[#145a32] disabled:opacity-50 disabled:pointer-events-none dark:bg-[#7dcea0] dark:border-[#7dcea0] dark:text-[#145a32]
                          file:bg-[#145a32] file:border-0
                          file:me-4
                          file:py-2 file:px-4
                          dark:file:bg-[#145a32] dark:file:text-white" />

                      </label>
                    </div>
                    <div className="mt-4">
                      <button onClick={handleUpload} disabled={uploading} className="bg-[#145a32] hover:bg-[#7dcea0 text-white text-md font-medium py-2 px-6 rounded-2xl mb-2">
                        Upload
                      </button>
                        <div className="block text-[#145a32] text-sm font-bold min-h-[20px]"> {message && <p>{message}</p>} </div>
                    </div>
              </div>
            </div>
        </div>
    )
}