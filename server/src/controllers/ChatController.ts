import { Request, Response, NextFunction } from "express";
import AiChatHelper from "../helper/AiChatHelper"; 
import path from "path";
import { profile } from "console";

class ChatController{

    private aiChatHelperObj:AiChatHelper;

    constructor(){
        this.aiChatHelperObj = new AiChatHelper();
        this.llmPdfUploaderChat = this.llmPdfUploaderChat.bind(this);
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
                fileName: req.file.filename,
                merssage: respData
            });
        }catch(error: unknown){            
            next(error);
        }
    }

}

export default ChatController;