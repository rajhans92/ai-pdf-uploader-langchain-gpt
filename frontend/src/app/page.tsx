"use client";
// src/app/page.tsx
import { useState,useEffect } from "react";
import axios from "axios";
import FileUpload from "@/components/FileUpload";
import FilePreviewer from "@/components/FilePreviewer";


type MessageType = {
  role: "user" | "system";
  content: string;
};

export default function Home() {

  const [chatMessages, setChatMessages] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<MessageType[]>([]);
  const [fileUploaded, setFileUploaded] = useState(true);
  const [resumeData, setResumeData] = useState({
    filePath: "",
    result: {
      ATS_Rating: "",
      skills: {},
      experience: "",
      education: "",
      weak_points: "",
      strong_points: "",
      suggestions: ""
    }
  });
  const [fileViewer, setFileViewer] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [fileType, setFileType] = useState(false);

  const clearHandler = () => {
    setFileUploaded(true);
    setResumeData({
      filePath: "",
      result: {
        ATS_Rating: "",
        skills: {},
        experience: "",
        education: "",
        weak_points: "",
        strong_points: "",
        suggestions: ""
      }
    });
    setFileViewer("");
    setHtmlContent("");
    setFileType(false);
  };

  useEffect(() => {
    if(isLoading){
      handleChatSubmit();
    }
  }, [isLoading]);

  const handleChatSubmit = async() => {
    try {
      
      const res = await axios.post('http://localhost:4000/api/v1/chat/llmChat', {
        filePath: resumeData.filePath,
        messagesHistory: chatHistory,
      });
      setChatHistory([...chatHistory,{role:"system",content:res.data.system}])
      
    } catch (err) {
      console.error('API Error:', err);
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {fileUploaded ? (
        <div className="bg-[#ebf3f1] h-screen ">
          <div className="text-center p-6">
            <h1 className="text-4xl font-bold mt-14">
              {/* <span>Rupesh AI - </span>  */}
              <span className="text-[#145a32]">Rupesh AI - Resume Analyzer</span>
            </h1>

            <p className="text-lg text-[#145a32] mt-2">
              You can check your resume ATS score free and chat with AI to improve your ATS score
            </p>
          </div>
          <div className="flex items-center justify-center mt-16">
            <FileUpload setFileUploaded={setFileUploaded} setResumeData={setResumeData} setFileViewer={setFileViewer} setHtmlContent={setHtmlContent} setFileType={setFileType} />
          </div>
        </div>
      )
        : (
          <div className="bg-[#ebf3f1] h-screen grid grid-cols-2">
            <div className="">
              <div className="">
                <FilePreviewer fileViewer={fileViewer} htmlContent={htmlContent} fileType={fileType} />
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between border-b-4 border-[#145a32] pb-4 mb-2">
                {/* Back Button */}
                <button
                  onClick={clearHandler}
                  className="bg-[#145a32] cursor-pointer hover:bg-[#599874] text-white text-xs font-medium py-2 px-6 rounded-2xl"
                >
                  Back
                </button>
 
                <h1 className="text-center flex-1">
                  <span className="text-xl font-bold text-[#145a32]">Rupesh AI </span><br></br> <span className="text-2xl font-bold text-[#145a32]"> Resume Analyzer </span>
                </h1>

                <div style={{ width: '100px' }}></div>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4">
                <div className="bg-[#ddf1e6] p-6 shadow-lg space-y-6 border border-gray-200">
                  <div className="bg-white p-6 shadow-lg space-y-6 border rounded-2xl border-gray-200">

                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">Resume ATS Rating</h2>
                      <p className="text-green-600 text-2xl font-bold">{resumeData.result.ATS_Rating || "N/A"}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.result.skills
                          ? Object.values(resumeData.result.skills).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                            >
                              {String(skill)}
                            </span>
                          ))
                          : "N/A"}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-1">Experience</h2>
                      <p className="text-gray-600">{resumeData.result.experience || "N/A"}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-1">Education</h2>
                      <p className="text-gray-600 whitespace-pre-line">{resumeData.result.education || "N/A"}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-yellow-600 mb-1">Weak Points</h2>
                      <p className="text-gray-600">{resumeData.result.weak_points || "N/A"}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-blue-600 mb-1">Strong Points</h2>
                      <p className="text-gray-600">{resumeData.result.strong_points || "N/A"}</p>
                    </div>

                    {resumeData.result.suggestions && (
                      <div>
                        <h2 className="text-lg font-semibold text-purple-600 mb-1">Suggestions</h2>
                        <p className="text-gray-600">{resumeData.result.suggestions}</p>
                      </div>
                    )}
                  </div>


                  <div className="mt-6 px-4 max-w-3xl mx-auto">
                    {chatHistory && chatHistory.length > 0 && 
                      chatHistory.map((message, index) => (

                        <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                          <div className={`inline-block px-4 py-2 rounded-lg ${message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          </div>
                      ))}  
            
                  </div>
                </div>
              </div>
              {/* CTA Button */}
              <div className="flex justify-center">
                <div className="flex items-center justify-between mt-2 bg-[#7dcea0] border border-[#145a32] rounded-2xl px-4 py-2 shadow-md w-full">
                  <input
                    type="text"
                    placeholder="Ask AI for resume suggestions..."
                    value={chatMessages}
                    onChange={(e) => setChatMessages(e.target.value)}
                    className="flex-1 outline-none text-sm px-2 py-1 bg-transparent text-gray-800"
                  />
                  <button
                    onClick={()=>{ chatMessages.length !=0 && setChatHistory([...chatHistory, { role: "user", content: chatMessages }]); setIsLoading(true); setChatMessages("")}}
                    className="ml-3 bg-[#145a32] cursor-pointer hover:bg-[#599874] text-white px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  >
                    <span className="text-xl">➤</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}
