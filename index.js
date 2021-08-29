// create logger
var logger = require('./common/logger');

// read .env file
require('dotenv').config();

// Response for Uptime Robot
const http = require('http')
http
  .createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Discord bot is active now \n')
  })
  .listen(3000)

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  logger.error(`token is not found. process.env.DISCORD_BOT_TOKEN = ${process.env.DISCORD_BOT_TOKEN}`);
  logger.error(process.env);
  process.exit(0)
}

require('./bot.js')
