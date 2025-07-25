"use client";
// src/app/page.tsx
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import FilePreviewer from "@/components/FilePreviewer";


export default function Home() {

  const [fileUploaded, setFileUploaded] = useState(true);
  const [resumeData, setResumeData] = useState({
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

                {/* Centered Heading */}
                <h1 className="text-center flex-1">
                  <span className="text-xl font-bold text-[#145a32]">Rupesh AI </span><br></br> <span className="text-2xl font-bold text-[#145a32]"> Resume Analyzer </span>
                </h1>

                {/* Empty div to balance flex spacing */}
                <div style={{ width: '100px' }}></div>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4">
                <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-200">

                  {/* ATS Rating */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">Resume ATS Rating</h2>
                    <p className="text-green-600 text-2xl font-bold">{resumeData.result.ATS_Rating || "N/A"}</p>
                  </div>

                  {/* Skills */}
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

                  {/* Experience */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Experience</h2>
                    <p className="text-gray-600">{resumeData.result.experience || "N/A"}</p>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Education</h2>
                    <p className="text-gray-600 whitespace-pre-line">{resumeData.result.education || "N/A"}</p>
                  </div>

                  {/* Weak Points */}
                  <div>
                    <h2 className="text-lg font-semibold text-yellow-600 mb-1">Weak Points</h2>
                    <p className="text-gray-600">{resumeData.result.weak_points || "N/A"}</p>
                  </div>

                  {/* Strong Points */}
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 mb-1">Strong Points</h2>
                    <p className="text-gray-600">{resumeData.result.strong_points || "N/A"}</p>
                  </div>

                  {/* Suggestions */}
                  {resumeData.result.suggestions && (
                    <div>
                      <h2 className="text-lg font-semibold text-purple-600 mb-1">Suggestions</h2>
                      <p className="text-gray-600">{resumeData.result.suggestions}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* CTA Button */}
              <div className="flex justify-center">
                <button
                  onClick={clearHandler}
                  className="bg-[#145a32] hover:bg-[#599874] text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all w-full"
                >
                  Chat with AI for more suggestions
                </button>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}
