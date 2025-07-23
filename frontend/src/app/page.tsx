"use client";
// src/app/page.tsx
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import FilePreviewer from "@/components/FilePreviewer";


export default function Home() {

  const [fileUploaded, setFileUploaded] = useState(false);
  const [resumeData, setResumeData] = useState();


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
            <FileUpload setFileUploaded={setFileUploaded} setResumeData={setResumeData} />
          </div>
        </div>
      )
        : (
          <div className="bg-[#ebf3f1] h-screen grid grid-cols-2">
            <div className="">
              <div className="">
                <FilePreviewer />
              </div>
            </div>
            <div className="p-8">
            <div className="flex items-center justify-between border-b-4 border-[#145a32] pb-4 mb-6">
                {/* Back Button */}
                <button
                  onClick={() => setFileUploaded(true)}
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
            </div>
          </div>
        )
      }
    </>
  )
}
