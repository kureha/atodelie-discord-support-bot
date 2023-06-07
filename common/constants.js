"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
    /**
     * constructor, set all value from process.env
     * @constructor
     */
    constructor() {
        var _a;
        // readed from env file
        require('dotenv').config();
        // common section
        this.DISCORD_BOT_TOKEN = process.env['DISCORD_BOT_TOKEN'] || Constants.STRING_EMPTY;
        this.DISCORD_BOT_ADMIN_USER_ID = process.env['DISCORD_BOT_ADMIN_USER_ID'] || Constants.STRING_EMPTY;
        this.DISCORD_LATEST_LIST_LENGTH = parseInt(process.env['DISCORD_LATEST_LIST_LENGTH'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_LATEST_LIST_LENGTH)) {
            // set default
            this.DISCORD_LATEST_LIST_LENGTH = 3;
        }
        this.DISCORD_FOLLOW_MINUTE = parseInt(process.env['DISCORD_FOLLOW_MINUTE'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_FOLLOW_MINUTE)) {
            // set default
            this.DISCORD_FOLLOW_MINUTE = 30;
        }
        this.DISCORD_FOLLOW_CRON = process.env['DISCORD_FOLLOW_CRON'] || Constants.STRING_EMPTY;
        this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = parseInt(process.env['DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE'] || Constants.STRING_EMPTY);
        if (isNaN(this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE)) {
            // set default
            this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = 0;
        }
        // create sql strings
        this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL = `-${this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE} minutes`;
        // sqlite section
        this.SQLITE_FILE = process.env['SQLITE_FILE'] || Constants.STRING_EMPTY;
        this.SQLITE_TEMPLATE_FILE = process.env['SQLITE_TEMPLATE_FILE'] || Constants.STRING_EMPTY;
        // export file section
        this.EXPORT_USER_INFO_PATH = process.env['EXPORT_USER_INFO_PATH'] || Constants.STRING_EMPTY;
        // message section
        this.DISCORD_ACTIVITY_NAME = process.env['DISCORD_ACTIVITY_NAME'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_IS_INVALID = process.env['DISCORD_MESSAGE_IS_INVALID'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TYPE_INVALID = process.env['DISCORD_MESSAGE_TYPE_INVALID'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT = process.env['DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EXPORT_TITLE = process.env['DISCORD_MESSAGE_EXPORT_TITLE'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EXPORT_USER_INFO = process.env['DISCORD_MESSAGE_EXPORT_USER_INFO'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED = process.env['DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EXCEPTION = process.env['DISCORD_MESSAGE_EXCEPTION'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED = process.env['DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_NO_PERMISSION = process.env['DISCORD_MESSAGE_NO_PERMISSION'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_SETTING_IS_NOT_READY = process.env['DISCORD_MESSAGE_SETTING_IS_NOT_READY'] || Constants.STRING_EMPTY;
        this.DISCORD_RECRUITMENT_THREAD_TITLE = process.env['DISCORD_RECRUITMENT_THREAD_TITLE'] || Constants.STRING_EMPTY;
        this.DISCORD_RECRUITMENT_THREAD_ANNOUNCEMENT = process.env['DISCORD_RECRUITMENT_THREAD_ANNOUNCEMENT'] || Constants.STRING_EMPTY;
        // thread recruitment duration (minute)
        this.DISCORD_RECRUITMENT_THREAD_DURATION = 60 * 24;
        this.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT = process.env['DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_NEW_RECRUITMENT = process.env['DISCORD_MESSAGE_NEW_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT = process.env['DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EDIT_RECRUITMENT = process.env['DISCORD_MESSAGE_EDIT_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT = process.env['DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_DELETE_RECRUITMENT = process.env['DISCORD_MESSAGE_DELETE_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN = process.env['DISCORD_MESSAGE_TITLE_SUCCESS_JOIN'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_SUCCESS_JOIN = process.env['DISCORD_MESSAGE_SUCCESS_JOIN'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW = process.env['DISCORD_MESSAGE_TITLE_SUCCESS_VIEW'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_SUCCESS_VIEW = process.env['DISCORD_MESSAGE_SUCCESS_VIEW'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE = process.env['DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_SUCCESS_DECLINE = process.env['DISCORD_MESSAGE_SUCCESS_DECLINE'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT = process.env['DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_FOLLOW_RECRUITMENT = process.env['DISCORD_MESSAGE_FOLLOW_RECRUITMENT'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_REGIST_SERVER_INFO = process.env['DISCORD_MESSAGE_REGIST_SERVER_INFO'] || Constants.STRING_EMPTY;
        this.DISCORD_BUTTUN_JOIN = process.env['DISCORD_BUTTUN_JOIN'] || Constants.STRING_EMPTY;
        this.DISCORD_BUTTON_DECLINE = process.env['DISCORD_BUTTON_DECLINE'] || Constants.STRING_EMPTY;
        this.DISCORD_BUTTON_VIEW = process.env['DISCORD_BUTTON_VIEW'] || Constants.STRING_EMPTY;
        this.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR = process.env['DISCORD_EXPORT_USER_INFO_SPLIT_CHAR'] || Constants.STRING_EMPTY;
        this.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR = process.env['DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR'] || Constants.STRING_EMPTY;
        this.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME = process.env['DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME'] || Constants.STRING_EMPTY;
        this.DISCORD_EXPORT_USER_INFO_HAS_ROLE = process.env['DISCORD_EXPORT_USER_INFO_HAS_ROLE'] || Constants.STRING_EMPTY;
        this.DISCORD_EXPORT_USER_INFO_NO_ROLE = process.env['DISCORD_EXPORT_USER_INFO_NO_ROLE'] || Constants.STRING_EMPTY;
        this.DISCORD_COMMAND_NEW_RECRUITMENT = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_NEW_RECRUITMENT'], ',');
        this.DISCORD_COMMAND_EDIT_RECRUITMENT = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_EDIT_RECRUITMENT'], ',');
        this.DISCORD_COMMAND_DELETE_RECRUITMENT = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_DELETE_RECRUITMENT'], ',');
        this.DISCORD_COMMAND_LIST_RECRUITMENT = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_LIST_RECRUITMENT'], ',');
        this.DISCORD_COMMAND_REGIST_MASTER = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_REGIST_MASTER'], ',');
        this.DISCORD_COMMAND_USER_INFO_LIST_GET = Constants.get_escaped_regexp_string_from_env(process.env['DISCORD_COMMAND_USER_INFO_LIST_GET'], ',');
        this.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME = ((_a = process.env['DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME']) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
        // message static values section
        this.DISCORD_MESSAGE_EMBED_NO_MEMBER = process.env['DISCORD_MESSAGE_EMBED_NO_MEMBER'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EMBED_TITLE = process.env['DISCORD_MESSAGE_EMBED_TITLE'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EMBED_OWNER = process.env['DISCORD_MESSAGE_EMBED_OWNER'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EMBED_START_TIME = process.env['DISCORD_MESSAGE_EMBED_START_TIME'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS = process.env['DISCORD_MESSAGE_EMBED_JOIN_MEMBERS'] || Constants.STRING_EMPTY;
        this.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS = process.env['DISCORD_MESSAGE_EMBED_VIEW_MEMBERS'] || Constants.STRING_EMPTY;
        // static values
        this.ID_INVALID = -1;
        this.TYPE_INIT = 0;
        this.TYPE_RECRUITEMENT = 1;
        this.TYPE_JOIN = 2;
        this.TYPE_DECLINE = 3;
        this.TYPE_LIST = 4;
        this.TYPE_REGIST_MAETER = 21;
        this.TYPE_USER_INFO_LIST_GET = 31;
        this.TYPE_VIEW = 5;
        this.TYPE_EDIT = 6;
        this.TYPE_DELETE = 7;
        this.STATUS_DISABLED = 0;
        this.STATUS_ENABLED = 1;
        this.STATUS_VIEW = 2;
        this.USER_INFO_LIST_LIMIT_NUMBER = 1000;
        this.RECRUITMENT_DEFAULT_LIMIT_HOURS = 8;
        this.RECRUITMENT_DEFAULT_MAX_NUMBERS = 6;
        this.RECRUITMENT_INVALID_CHANNEL_ID = 'TARGET_CHANNEL_ID_IS_NOT_FOUND';
        this.RECRUITMENT_INVALID_ROLE = 'TARGET_ROLE_IS_NOT_FOUND';
        this.RECRUITMENT_DEFAULT_DESCRIPTION = 'joind by interaction button.';
        this.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX = 'join-recruite-token=';
        this.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX = 'decline-recruite-token=';
        this.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX = 'view-recruite-token=';
        this.ERROR_RECRUITMENT_TOKEN = 'ERROR_TOKEN';
        this.REQUIRE_NAME_SQLITE3 = 'sqlite3';
    }
    /**
     * get default data for this system
     * @returns date instance of '2000-01-01 00:00:00'
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
    /**
     * get escape string from env file
     * @param v non-escaped regexp string list
     * @param split_char list split char
     * @returns regexp escaped string (not list)
     */
    static get_escaped_regexp_string_from_env(v, split_char) {
        if (v === undefined) {
            return '';
        }
        else {
            v.split(split_char).forEach(e => {
                e = Constants.escape_regexp(e);
            });
            return v.split(split_char).join('|');
        }
    }
    /**
     * escape string for regexp (e.g. escape user input string)
     * @param v regexp string non-escaped
     * @returns escaped regexp string
     */
    static escape_regexp(v) {
        return v.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
    }
}
exports.Constants = Constants;
Constants.STRING_EMPTY = '';
;
//# sourceMappingURL=constants.js.map