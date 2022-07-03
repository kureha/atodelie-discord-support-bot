// define logger
import { logger } from './common/logger';

// read .env file
require('dotenv').config();

// Get default port
const DEFAULT_PORT: number = 3000;
let port: number = parseInt(process.env['DISCORD_BOT_PORT'] || `${DEFAULT_PORT}`);
logger.info(`Discord bot port = ${port}`);

// Response for Uptime Robot
import * as http from 'http'
http.createServer((request: any, response: any) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Discord bot is active now \n')
}).listen(port)

// check required params
if (process.env['DISCORD_BOT_TOKEN'] == undefined) {
    logger.error(`token is not found. please check .env file (you copy .env from .env.sample at first). process.env.DISCORD_BOT_TOKEN = ${process.env['DISCORD_BOT_TOKEN']}`);
    logger.error(process.env);
    process.exit(0)
}

if (process.env['DISCORD_BOT_ADMIN_USER_ID'] == undefined) {
    logger.error(`admin user is not found. process.env.DISCORD_BOT_ADMIN_USER_ID = ${process.env['DISCORD_BOT_ADMIN_USER_ID']}`);
    logger.error(process.env);
    process.exit(0)
}

require('./bot.js')
