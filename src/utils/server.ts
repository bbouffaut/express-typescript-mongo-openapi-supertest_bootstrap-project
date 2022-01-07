import express, { NextFunction, Request, Response } from "express";
import { Express } from 'express-serve-static-core';
import morgan from "morgan";
import http, { Server } from 'http';
import YAML from "yamljs";
import { connector, summarise } from "swagger-routes-express";
import * as OpenApiValidator from 'express-openapi-validator'

import * as api_v1 from '@meteo-france-api/api/controllers/v1';
import { OPENAPI_YAML_FILE } from "@meteo-france-api/utils/constants";

import config from '@meteo-france-api/config';
import morganBody from "morgan-body";
import logger from "@meteo-france-api/utils/logger";

interface AppServers {
    expressServer: Express;
    httpServer: http.Server;
}

const createServer = (): AppServers => {

    const yamlSpecFile = OPENAPI_YAML_FILE;
    const apiDefinition = YAML.load(yamlSpecFile);
    const apiSummary = summarise(apiDefinition);
    logger.info(apiSummary);

    const app: Express = express();

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // setup API validator
    const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: true
    }
    
    app.use(OpenApiValidator.middleware(validatorOptions));

    /** Logging */
    if (config.morganLogger) {
        app.use(morgan('dev'));
    }
    
    if (config.morganBodyLogger) {
        morganBody(app, {
            theme: 'darkened',
        });
    }

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
            logger.verbose(`${method}: ${descriptor[0]} : ${descriptor[1].name}`)
        }
    });

    connect(app);

    // error customization, if request is invalid
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        })
    })

    const httpServer: Server = http.createServer(app);

    const result: AppServers = {
        expressServer: app,
        httpServer: httpServer
    }

    return result;

};

export { createServer };