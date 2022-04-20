import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import configuration from "../configuration/configuration";
import dbConnection from "../database/connection";
import authRoutes from "../routes/auth.routes";

class Server {
    public app: Application;
    private port: number | string;
    private apiPaths = {
        auth: "/api/auth",
    };

    constructor() {
        this.app = express();
        this.port = configuration.PORT || 3000;

        // database connection
        this.startDbConnection();

        // middlewares
        this.middlewares();

        // routes
        this.routes();
    }

    async startDbConnection() {
        await dbConnection();
    }

    middlewares() {
        // view server requests
        this.app.use(morgan("dev"));
        // allow cross-origin requests
        this.app.use(cors());
        // parse application/json
        this.app.use(bodyParser.json());
        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    routes() {
        // auth routes
        this.app.use(this.apiPaths.auth, authRoutes);
    }

    start() {
        // start the server
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;
