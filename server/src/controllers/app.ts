import "dotenv/config";
import express,{Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ErrorHandler from "../middlewares/errorHandler";
import Routers from '../routes/routes';
import { log } from 'node:console';

class App{

    private readonly app: Application;
    private readonly port: Number;
    private readonly host: string;

    constructor(){
        this.app = express();
        this.host = process.env.host || "http://localhost";
        this.port = parseInt(process.env.PORT || "4000");
        this.init();
    }

    private init(){
        this.initConfig();
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandling();
    }

    private initConfig(){
        console.log("Setup Config....");     
    }

    private initMiddlewares(){
        console.log("Setup Middlewares....");
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));    
    }

    private initRoutes(){
        console.log("Setup Routes....");
        this.app.use(`/api/${process.env.apiVersion}`, Routers);
    }

    private initErrorHandling(){
        console.log("Setup Handlers....");
        this.app.use(ErrorHandler.error);
    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log(`Server is running on ${this.host}:${this.port}`);
        })
    }
}

export default App;