// src/app/page.tsx

import FileUpload from "@/components/FileUpload";


export default function Home() {
  return (
    <div className="bg-[#e9f7ef]">
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold mt-8">
          {/* <span>Rupesh AI - </span>  */}
          <span className="text-[#145a32]">Rupesh AI - Resume Analyzer</span>
        </h1>

        <p className="text-lg text-[#145a32]">
          You can check your resume ATS score free and chat with AI to improve your ATS score
        </p>
      </div>
      <div className="h-screen flex items-center justify-center">
        <FileUpload />
      </div>
    </div>
  )
}
