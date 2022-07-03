"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
// define logger
const logger_1 = require("./common/logger");
// read .env file
require('dotenv').config();
// Get default port
const DEFAULT_PORT = 3000;
let port = parseInt(process.env['DISCORD_BOT_PORT'] || `${DEFAULT_PORT}`);
logger_1.logger.info(`Discord bot port = ${port}`);
// Response for Uptime Robot
const http = __importStar(require("http"));
http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now \n');
}).listen(port);
// check required params
if (process.env['DISCORD_BOT_TOKEN'] == undefined) {
    logger_1.logger.error(`token is not found. please check .env file (you copy .env from .env.sample at first). process.env.DISCORD_BOT_TOKEN = ${process.env['DISCORD_BOT_TOKEN']}`);
    logger_1.logger.error(process.env);
    process.exit(0);
}
if (process.env['DISCORD_BOT_ADMIN_USER_ID'] == undefined) {
    logger_1.logger.error(`admin user is not found. process.env.DISCORD_BOT_ADMIN_USER_ID = ${process.env['DISCORD_BOT_ADMIN_USER_ID']}`);
    logger_1.logger.error(process.env);
    process.exit(0);
}
require('./bot.js');
//# sourceMappingURL=index.js.map