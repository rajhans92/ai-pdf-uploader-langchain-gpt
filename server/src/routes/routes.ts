import { Router } from "express";
import { upload } from '../helper/FileUploader';
import ChatController from "../controllers/ChatController";

class Routers{

    public readonly router: Router;
    private readonly chatController: ChatController;
    constructor(){
        this.router = Router();
        this.chatController = new ChatController();
        this.initRoutes();
    }

    private initRoutes(){
        this.router.post("/chat/pdfUploader",upload.single('doc'),this.chatController.llmPdfUploaderChat);
    }
}

export default new Routers().router;