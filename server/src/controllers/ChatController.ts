import { Request, Response, NextFunction } from "express";
import AiChatHelper from "../helper/AiChatHelper"; 
import { profile } from "console";

class ChatController{

    private aiChatHelperObj:AiChatHelper;

    constructor(){
        this.aiChatHelperObj = new AiChatHelper();
        this.llmPdfUploaderChat = this.llmPdfUploaderChat.bind(this);
    }

    public async llmPdfUploaderChat(req: any, res: Response, next: NextFunction){
        try{ 
            res.json({
                message: 'File uploaded successfully',
                filename: req.file.filename,
                originalname: req.file.originalname,
                path: req.file.path,
              });
        }catch(error: unknown){            
            next(error);
        }
    }

}

export default ChatController;