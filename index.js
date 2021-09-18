"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// define logger
const logger_1 = require("./common/logger");
// read .env file
require('dotenv').config();
// Response for Uptime Robot
const http_1 = __importDefault(require("http"));
http_1.default.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now \n');
}).listen(3000);
if (process.env['DISCORD_BOT_TOKEN'] == undefined) {
    logger_1.logger.error(`token is not found. process.env.DISCORD_BOT_TOKEN = ${process.env['DISCORD_BOT_TOKEN']}`);
    logger_1.logger.error(process.env);
    process.exit(0);
}
require('./bot.js');
//# sourceMappingURL=index.js.map