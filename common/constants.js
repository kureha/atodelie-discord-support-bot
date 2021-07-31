module.exports = class Constants {
    constructor () {
        // readed from env file
        require('dotenv').config();

        // common section
        this.DISCORD_COMMON = process.env.DISCORD_COMMON;
        this.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

        // sqlite section
        this.SQLITE_FILE = process.env.SQLITE_FILE;

        // message section
        this.DISCORD_ACTIVITY_NAME = process.env.DISCORD_ACTIVITY_NAME;
        this.DISCORD_MESSAGE_IS_INVALID = process.env.DISCORD_MESSAGE_IS_INVALID;
    }
};