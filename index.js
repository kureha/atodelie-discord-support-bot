"use strict";
exports.__esModule = true;
// define logger
var logger_1 = require("./common/logger");
// read .env file
require('dotenv').config();
// Response for Uptime Robot
var http = require("http");
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now \n');
}).listen(3000);
// check required params
if (process.env['DISCORD_BOT_TOKEN'] == undefined) {
    logger_1.logger.error("token is not found. please check .env file (you copy .env from .env.sample at first). process.env.DISCORD_BOT_TOKEN = ".concat(process.env['DISCORD_BOT_TOKEN']));
    logger_1.logger.error(process.env);
    process.exit(0);
}
if (process.env['DISCORD_BOT_ADMIN_USER_ID'] == undefined) {
    logger_1.logger.error("admin user is not found. process.env.DISCORD_BOT_ADMIN_USER_ID = ".concat(process.env['DISCORD_BOT_ADMIN_USER_ID']));
    logger_1.logger.error(process.env);
    process.exit(0);
}
require('./bot.js');
