import { Request, Response, NextFunction } from "express";
import AiChatHelper from "../helper/AiChatHelper"; 
import path from "path";
import fs from "fs";
import { profile } from "console";

class ChatController{

    private aiChatHelperObj:AiChatHelper;

    constructor(){
        this.aiChatHelperObj = new AiChatHelper();
        this.deleteFolder("tempFolder/");
        this.createTempFolder("tempFolder")
        this.llmPdfUploaderChat = this.llmPdfUploaderChat.bind(this);
        this.llmChat = this.llmChat.bind(this);
    }

    private createTempFolder(folderName: string) {
        // const tempFolderPath = path.join(__dirname, folderName);
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
            console.log("Temporary folder created:", folderName);
        } else {
            console.log("Temporary folder already exists:", folderName);
        }
    }

    private async deleteFolder(filePath: string) {
        
        fs.rmSync(filePath, { recursive: true, force: true })
        if (!fs.existsSync(filePath)) {
            console.error("Error deleting folder ");
        } else {
            console.log("Folder deleted");
        }
    }

    public async llmPdfUploaderChat(req: any, res: Response, next: NextFunction){
        try{ 
            // Check if req.file exists
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            // Get the file extension
            const fileExtension:  string = path.extname(req.file.originalname).toLowerCase();
            console.log("File extension:", fileExtension);

            // Example: Validate file extension
            const allowedExtensions = [".pdf", ".docx"];
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: `Invalid file type. Only ${allowedExtensions.join(", ")} are allowed.` });
            }

            // Process the file (e.g., pass it to your helper)
            const respData = await this.aiChatHelperObj.llmPdfUploaderChat(req.file.path,fileExtension).then((data) => {return data});
            res.json({
                respData
            });
        }catch(error: unknown){            
            next(error);
        }
    }

    public async llmChat(req: Request, res: Response, next: NextFunction){
        try{
            
            // Check if req.file exists
            if (!req.body.filePath) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            if (!fs.existsSync(req.body.filePath)) {
                return res.status(400).json({ message: "No Such File available" });
            } 

            // Get the file extension
            const fileExtension:  string = path.extname(req.body.filePath).toLowerCase();
            console.log("File extension:", fileExtension);

            // Example: Validate file extension
            const allowedExtensions = [".pdf", ".docx"];
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ message: `Invalid file type. Only ${allowedExtensions.join(", ")} are allowed.` });
            }


            let messagesHistory: Array<{ role: string, content: string }> = req.body.messagesHistory || [];
            let filePath: string = req.body.filePath || "";
            
            const responseObj = await this.aiChatHelperObj.callModel(messagesHistory,filePath,fileExtension).then((data) => {return data});
            
            res.status(200).json({system: responseObj});
        }catch(error: unknown){            
            next(error);
        }
    }
}

export default ChatController;