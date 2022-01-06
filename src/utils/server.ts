import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import http, { Server } from 'http';
import YAML from "yamljs";
import { connector, summarise } from "swagger-routes-express";
import * as OpenApiValidator from 'express-openapi-validator'

import * as api_v1 from '@meteo-france-api/api/controllers/v1';
import { OPENAPI_YAML_FILE } from "@meteo-france-api/utils/constants";

import config from '@meteo-france-api/config';
import { expressDevLogger } from '@meteo-france-api/utils/express_dev_logger';
import morganBody from "morgan-body";
import logger from "@meteo-france-api/utils/logger";

const createServer = async (): Promise<Server> => {

    const yamlSpecFile = OPENAPI_YAML_FILE
    const apiDefinition = YAML.load(yamlSpecFile)
    const apiSummary = summarise(apiDefinition)
    logger.info(apiSummary)

    const app: Application = express();

    // setup API validator
    const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: false
    }
    
    app.use(OpenApiValidator.middleware(validatorOptions));

    // error customization, if request is invalid
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status).json({
        error: {
            type: 'request_validation',
            message: err.message,
            errors: err.errors
        }
        })
    })

    /** Logging */
    if (config.morganLogger) {
        app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    }
    
    if (config.morganBodyLogger) {
        morganBody(app);
    }

    if (config.appDevLogger) {
        app.use(expressDevLogger);
    }

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /** RULES OF OUR API */
    app.use((req: Request, res: Response, next: NextFunction) => {
        // set the CORS policy
        res.header('Access-Control-Allow-Origin', '*');
        // set the CORS headers
        res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
        // set the CORS method headers
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET');
            return res.status(200).json({});
        }
        next();
    });

   /** Generate Routes */
   const connect = connector(api_v1, apiDefinition, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            logger.verbose(`${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`)
        }
    })

    connect(app);

    const httpServer: Server = http.createServer(app);

    return httpServer;

};

export { createServer };