// src/app/page.tsx

import FileUpload from "@/components/FileUpload";


export default function Home() {
  return( 
    <div className="bg-[#e9f7ef] h-screen flex items-center justify-center p-6">  
      <FileUpload />    
    </div>
  )
}
