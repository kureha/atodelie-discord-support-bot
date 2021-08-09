module.exports = class Constants {
    constructor () {
        // readed from env file
        require('dotenv').config();

        // common section
        this.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        this.DISCORD_TOKEN_LENGTH = process.env.DISCORD_TOKEN_LENGTH;
        this.DISCORD_LATEST_LIST_LENGTH = parseInt(process.env.DISCORD_LATEST_LIST_LENGTH);
        if (isNaN(this.DISCORD_LATEST_LIST_LENGTH)) {
            // set default
            this.DISCORD_LATEST_LIST_LENGTH = 3;
        }
        this.DISCORD_FOLLOW_MINUTE = parseInt(process.env.DISCORD_FOLLOW_MINUTE);
        if (isNaN(this.DISCORD_FOLLOW_MINUTE)) {
            // set default
            this.DISCORD_FOLLOW_MINUTE = 30;
        }
        this.DISCORD_FOLLOW_CRON = process.env.DISCORD_FOLLOW_CRON;

        // sqlite section
        this.SQLITE_FILE = process.env.SQLITE_FILE;

        // message section
        this.DISCORD_ACTIVITY_NAME = process.env.DISCORD_ACTIVITY_NAME;
        this.DISCORD_MESSAGE_IS_INVALID = process.env.DISCORD_MESSAGE_IS_INVALID;
        this.DISCORD_MESSAGE_TYPE_INVALID = process.env.DISCORD_MESSAGE_TYPE_INVALID;
        this.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT = process.env.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;
        this.DISCORD_MESSAGE_EXCEPTION = process.env.DISCORD_MESSAGE_EXCEPTION;
        this.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED = process.env.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED;
        this.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT = process.env.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT;
        this.DISCORD_MESSAGE_NEW_RECRUITMENT = process.env.DISCORD_MESSAGE_NEW_RECRUITMENT;
        this.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN = process.env.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN;
        this.DISCORD_MESSAGE_SUCCESS_JOIN = process.env.DISCORD_MESSAGE_SUCCESS_JOIN;
        this.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE = process.env.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE;
        this.DISCORD_MESSAGE_SUCCESS_DECLINE = process.env.DISCORD_MESSAGE_SUCCESS_DECLINE;
        this.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT = process.env.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT;
        this.DISCORD_MESSAGE_FOLLOW_RECRUITMENT = process.env.DISCORD_MESSAGE_FOLLOW_RECRUITMENT;

        // message static values section
        this.DISCORD_MESSAGE_EMBED_NO_MEMBER = process.env.DISCORD_MESSAGE_EMBED_NO_MEMBER;
        this.DISCORD_MESSAGE_EMBED_TITLE = process.env.DISCORD_MESSAGE_EMBED_TITLE;
        this.DISCORD_MESSAGE_EMBED_OWNER = process.env.DISCORD_MESSAGE_EMBED_OWNER;
        this.DISCORD_MESSAGE_EMBED_START_TIME = process.env.DISCORD_MESSAGE_EMBED_START_TIME;
        this.DISCORD_MESSAGE_EMBED_MEMBERS = process.env.DISCORD_MESSAGE_EMBED_MEMBERS;

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
        this.RECRUITMENT_INVALID_CHANNEL_ID = 'TARGET_CHANNEL_ID_IS_NOT_FOUND';
        this.RECRUITMENT_INVALID_ROLE = 'TARGET_ROLE_IS_NOT_FOUND';

        this.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX = 'join-recruite-token=';
        this.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX = 'decline-recruite-token=';
    }

    /**
     * デフォルトとする日時を返却します
     * @returns 2000-01-01 00:00:00の日時
     */
     static get_default_date() {
        const temp_date = new Date();
        temp_date.setFullYear(2000);
        temp_date.setMonth(0);
        temp_date.setDate(1);
        temp_date.setHours(0);
        temp_date.setMinutes(0);
        temp_date.setSeconds(0);
        temp_date.setMilliseconds(0);

        return temp_date;
    }
};