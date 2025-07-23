//src="https://view.officeapps.live.com/op/embed.aspx?src=https://calibre-ebook.com/downloads/demos/demo.docx"
//src="https://example-files.online-convert.com/document/pdf/example.pdf"

export default function FileUpload({fileViewer, htmlContent, fileType}: { fileViewer: string, htmlContent: string , fileType: boolean}) {
    
        const iframeProps = !fileType
        ? { src: fileViewer }
        : { srcDoc: htmlContent };

        return (
            <div className="">
            <iframe
              title="Text Preview"
              className="w-full min-h-screen"
              {...iframeProps} // ✅ spread correct prop (either src or srcDoc)
            />
          </div>
        )

}
