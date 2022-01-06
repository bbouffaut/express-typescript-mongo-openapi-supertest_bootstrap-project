"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@meteo-france-api/utils/server");
const config_1 = __importDefault(require("./config"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /** Server */
        const httpServer = yield (0, server_1.createServer)();
        httpServer.listen(config_1.default.port, () => console.log(`The server is running on port ${config_1.default.port}`));
    }
    catch (e) {
        const error = e;
        console.error(`Error occured: ${error.message}`);
    }
});
main();
