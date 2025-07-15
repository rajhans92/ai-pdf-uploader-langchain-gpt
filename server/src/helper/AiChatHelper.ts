import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";
import mammoth from "mammoth";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


class AiChatHelper{

    private readonly model: ChatOpenAI;
    
    constructor(){
        this.model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0
        });

        
    }
    
    public async llmPdfUploaderChat( filePath: string, fileExtension: string){
        let doc: string = "";
        if(fileExtension === ".pdf"){
            const loader = new PDFLoader(filePath);
            const docs = await loader.load();
            doc = docs.map((d: Document) => d.pageContent).join("\n");
        }
        else if(fileExtension === ".docx"){
            const buffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer });
            doc = result.value ;
        }
        console.log("doc =>", doc);
        return "true";
    }

    public async callModel(messagesHistory: Array<{role: string, content: string}>){
        let messageArr:Array<{role: string, content: string}> = [
            { role: "system", content: "Your are a good AI assistent!" }
        ];
        
        messageArr.push(...messagesHistory);
        const result = await this.model.invoke(messagesHistory);
        
        return result.content;
    }
    

}

export default AiChatHelper;