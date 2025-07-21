// src/app/page.tsx

import FileUpload from "@/components/FileUpload";


export default function Home() {
  return (
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
        <FileUpload />
      </div>
    </div>
  )
}
