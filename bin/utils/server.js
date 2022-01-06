"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_routes_express_1 = require("swagger-routes-express");
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const api_v1 = __importStar(require("@meteo-france-api/api/controllers/v1"));
const constants_1 = require("@meteo-france-api/utils/constants");
const config_1 = __importDefault(require("@meteo-france-api/config"));
const express_dev_logger_1 = require("@meteo-france-api/utils/express_dev_logger");
const morgan_body_1 = __importDefault(require("morgan-body"));
const logger_1 = __importDefault(require("@meteo-france-api/utils/logger"));
const createServer = () => {
    const yamlSpecFile = constants_1.OPENAPI_YAML_FILE;
    const apiDefinition = yamljs_1.default.load(yamlSpecFile);
    const apiSummary = (0, swagger_routes_express_1.summarise)(apiDefinition);
    logger_1.default.info(apiSummary);
    const app = (0, express_1.default)();
    // setup API validator
    const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: false
    };
    app.use(OpenApiValidator.middleware(validatorOptions));
    // error customization, if request is invalid
    app.use((err, req, res, next) => {
        res.status(err.status).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        });
    });
    /** Logging */
    if (config_1.default.morganLogger) {
        app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'));
    }
    if (config_1.default.morganBodyLogger) {
        (0, morgan_body_1.default)(app);
    }
    if (config_1.default.appDevLogger) {
        app.use(express_dev_logger_1.expressDevLogger);
    }
    // Body parsing Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    /** RULES OF OUR API */
    app.use((req, res, next) => {
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
    const connect = (0, swagger_routes_express_1.connector)(api_v1, apiDefinition, {
        onCreateRoute: (method, descriptor) => {
            logger_1.default.verbose(`${method}: ${descriptor[0]} : ${descriptor[1].name}`);
        }
    });
    connect(app);
    const httpServer = http_1.default.createServer(app);
    const result = {
        expressServer: app,
        httpServer: httpServer
    };
    return result;
};
exports.createServer = createServer;
