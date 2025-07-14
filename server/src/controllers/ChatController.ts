import { Request, Response, NextFunction } from "express";
import AiChatHelper from "../helper/AiChatHelper"; 
import { profile } from "console";

class ChatController{

    private aiChatHelperObj:AiChatHelper;

    constructor(){
        this.aiChatHelperObj = new AiChatHelper();
        this.llmPdfUploaderChat = this.llmPdfUploaderChat.bind(this);
    }

    public async llmPdfUploaderChat(req: Request, res: Response, next: NextFunction){
        try{
            
            
        }catch(error: unknown){            
            next(error);
        }
    }

}

export default ChatController;