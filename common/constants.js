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

        // static values
        this.TYPE_INIT = 0;
        this.TYPE_RECRUITEMENT = 1;
        this.TYPE_JOIN = 2;
        this.TYPE_DECLINE = 3;
        this.TYPE_LIST = 4;

        this.STATUS_DISABLED = 0;
        this.STATUS_ENABLED = 1;
    }
};