module.exports = class Constants {
    constructor () {
        // readed from env file
        require('dotenv').config();

        // common section
        this.DISCORD_REPLY_ROLE = process.env.DISCORD_REPLY_ROLE;
        this.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        this.DISCORD_TOKEN_LENGTH = process.env.DISCORD_TOKEN_LENGTH;

        // sqlite section
        this.SQLITE_FILE = process.env.SQLITE_FILE;

        // message section
        this.DISCORD_ACTIVITY_NAME = process.env.DISCORD_ACTIVITY_NAME;
        this.DISCORD_MESSAGE_IS_INVALID = process.env.DISCORD_MESSAGE_IS_INVALID;
        this.DISCORD_MESSAGE_TYPE_INVALID = process.env.DISCORD_MESSAGE_TYPE_INVALID;
        this.DISCORD_MESSAGE_EXCEPTION = process.env.DISCORD_MESSAGE_EXCEPTION;
        this.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED = process.env.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED;
        this.DISCORD_MESSAGE_NEW_RECRUITMENT = process.env.DISCORD_MESSAGE_NEW_RECRUITMENT;
        this.DISCORD_MESSAGE_SUCCESS_JOIN = process.env.DISCORD_MESSAGE_SUCCESS_JOIN;
        this.DISCORD_MESSAGE_SUCCESS_DECLINE = process.env.DISCORD_MESSAGE_SUCCESS_DECLINE;

        // static values
        this.TYPE_INIT = 0;
        this.TYPE_RECRUITEMENT = 1;
        this.TYPE_JOIN = 2;
        this.TYPE_DECLINE = 3;
        this.TYPE_LIST = 4;

        this.STATUS_DISABLED = 0;
        this.STATUS_ENABLED = 1;

        this.RECRUITMENT_DEFAULT_LIMIT_HOURS = 8;
        this.RECRUITMENT_DEFAULT_MAX_NUMBERS = 6;
        this.RECRUITMENT_DEFAULT_INVALID_CHANNEL = 'ERROR';

        this.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX = 'join-recruite-token=';
        this.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX = 'decline-recruite-token=';
    }
};