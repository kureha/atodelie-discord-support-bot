"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// define logger
const logger_1 = require("./common/logger");
// read .env file
require('dotenv').config();
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