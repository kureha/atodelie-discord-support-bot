"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
    /**
     * constructor, set all value from process.env
     * @constructor
     */
    constructor() {
        // readed from env file
        require('dotenv').config();
        /** load fron env section */
        // common section
        this.DISCORD_BOT_TOKEN = this.v(process.env.DISCORD_BOT_TOKEN);
        this.DISCORD_BOT_ADMIN_USER_ID = this.v(process.env.DISCORD_BOT_ADMIN_USER_ID);
        this.DISCORD_LATEST_LIST_LENGTH = parseInt(this.v(process.env.DISCORD_LATEST_LIST_LENGTH));
        if (isNaN(this.DISCORD_LATEST_LIST_LENGTH)) {
            // set default
            this.DISCORD_LATEST_LIST_LENGTH = 3;
        }
        this.DISCORD_FOLLOW_MINUTE = parseInt(this.v(process.env.DISCORD_FOLLOW_MINUTE));
        if (isNaN(this.DISCORD_FOLLOW_MINUTE)) {
            // set default
            this.DISCORD_FOLLOW_MINUTE = 30;
        }
        this.DISCORD_FOLLOW_CRON = this.v(process.env.DISCORD_FOLLOW_CRON);
        this.DISCORD_ACTIVITY_RECORD_CRON = this.v(process.env.DISCORD_ACTIVITY_RECORD_CRON);
        this.DISCORD_AUTO_ANNOUNCE_CRON = this.v(process.env.DISCORD_AUTO_ANNOUNCE_CRON);
        this.DISCORD_UPDATE_CHANNEL_NAME_CRON = this.v(process.env.DISCORD_UPDATE_CHANNEL_NAME_CRON);
        this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = parseInt(this.v(process.env.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE));
        if (isNaN(this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE)) {
            // set default
            this.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE = 0;
        }
        this.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD = parseInt(this.v(process.env.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD));
        if (isNaN(this.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD)) {
            // set default
            this.DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD = 24 * 60;
        }
        this.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD = parseInt(this.v(process.env.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD));
        if (isNaN(this.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD)) {
            // set default
            this.DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD = 2;
        }
        this.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH = parseInt(this.v(process.env.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH));
        if (isNaN(this.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH)) {
            // set default
            this.DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH = 1;
        }
        // get dev mode
        if (this.v(process.env.DEV_MODE).toLowerCase() == 'true') {
            this.DEV_MODE = true;
        }
        else {
            this.DEV_MODE = false;
        }
        this.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT = this.v(process.env.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT);
        this.DISCORD_FRIEND_CODE_OTHER_COUNT = parseInt(this.v(process.env.DISCORD_FRIEND_CODE_OTHER_COUNT));
        if (isNaN(this.DISCORD_FRIEND_CODE_OTHER_COUNT)) {
            // set default
            this.DISCORD_FRIEND_CODE_OTHER_COUNT = 0;
        }
        this.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST = this.v(process.env.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST).split(',');
        this.DISCORD_PRESENCE_IGNORE_NAME_LIST = this.v(process.env.DISCORD_PRESENCE_IGNORE_NAME_LIST).split(',');
        // export file section
        this.EXPORT_USER_INFO_PATH = this.v(process.env.EXPORT_USER_INFO_PATH);
        // message section
        this.DISCORD_ACTIVITY_NAME = this.v(process.env.DISCORD_ACTIVITY_NAME);
        this.DISCORD_MESSAGE_IS_INVALID = this.v(process.env.DISCORD_MESSAGE_IS_INVALID);
        this.DISCORD_MESSAGE_TYPE_INVALID = this.v(process.env.DISCORD_MESSAGE_TYPE_INVALID);
        this.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT);
        this.DISCORD_MESSAGE_EXPORT_TITLE = this.v(process.env.DISCORD_MESSAGE_EXPORT_TITLE);
        this.DISCORD_MESSAGE_EXPORT_USER_INFO = this.v(process.env.DISCORD_MESSAGE_EXPORT_USER_INFO);
        this.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED = this.v(process.env.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED);
        this.DISCORD_MESSAGE_EXCEPTION = this.v(process.env.DISCORD_MESSAGE_EXCEPTION);
        this.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED = this.v(process.env.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED);
        this.DISCORD_MESSAGE_NO_PERMISSION = this.v(process.env.DISCORD_MESSAGE_NO_PERMISSION);
        this.DISCORD_MESSAGE_COMMAND_IS_REGIST = this.v(process.env.DISCORD_MESSAGE_COMMAND_IS_REGIST);
        this.DISCORD_MESSAGE_SETTING_IS_NOT_READY = this.v(process.env.DISCORD_MESSAGE_SETTING_IS_NOT_READY);
        this.DISCORD_MESSAGE_SETTING_ROLE_SELECT = this.v(process.env.DISCORD_MESSAGE_SETTING_ROLE_SELECT);
        this.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_REGIST_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_REGIST_FRIEND_CODE);
        this.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_SEARCH_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_SEARCH_FRIEND_CODE);
        this.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_DELETE_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_DELETE_FRIEND_CODE);
        this.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT = this.v(process.env.DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT);
        this.DISCORD_RECRUITMENT_MODAL_TIME = this.v(process.env.DISCORD_RECRUITMENT_MODAL_TIME);
        this.DISCORD_RECRUITMENT_MODAL_DESCRIPTION = this.v(process.env.DISCORD_RECRUITMENT_MODAL_DESCRIPTION);
        this.DISCORD_FRIEND_CODE_MODAL_FRIEND_CODE = this.v(process.env.DISCORD_FRIEND_CODE_MODAL_FRIEND_CODE);
        this.DISCORD_GAME_MASTER_MODAL_DESCRIPTION = this.v(process.env.DISCORD_GAME_MASTER_MODAL_DESCRIPTION);
        this.DISCORD_GAME_MASTER_MODAL_PRECENSE_NAME = this.v(process.env.DISCORD_GAME_MASTER_MODAL_PRECENSE_NAME);
        this.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT);
        this.DISCORD_MESSAGE_NEW_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_NEW_RECRUITMENT);
        this.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT);
        this.DISCORD_MESSAGE_EDIT_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_EDIT_RECRUITMENT);
        this.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT);
        this.DISCORD_MESSAGE_DELETE_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_DELETE_RECRUITMENT);
        this.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN = this.v(process.env.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN);
        this.DISCORD_MESSAGE_SUCCESS_JOIN = this.v(process.env.DISCORD_MESSAGE_SUCCESS_JOIN);
        this.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW = this.v(process.env.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW);
        this.DISCORD_MESSAGE_SUCCESS_VIEW = this.v(process.env.DISCORD_MESSAGE_SUCCESS_VIEW);
        this.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE = this.v(process.env.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE);
        this.DISCORD_MESSAGE_SUCCESS_DECLINE = this.v(process.env.DISCORD_MESSAGE_SUCCESS_DECLINE);
        this.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT);
        this.DISCORD_MESSAGE_FOLLOW_RECRUITMENT = this.v(process.env.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
        this.DISCORD_MESSAGE_REGIST_SERVER_INFO = this.v(process.env.DISCORD_MESSAGE_REGIST_SERVER_INFO);
        this.DISCORD_MESSAGE_REGIST_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_REGIST_FRIEND_CODE);
        this.DISCORD_MESSAGE_SEARCH_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_SEARCH_FRIEND_CODE);
        this.DISCORD_MESSAGE_SEARCH_FRIEND_CODE_NOT_FOUND = this.v(process.env.DISCORD_MESSAGE_SEARCH_FRIEND_CODE_NOT_FOUND);
        this.DISCORD_MESSAGE_DELETE_FRIEND_CODE = this.v(process.env.DISCORD_MESSAGE_DELETE_FRIEND_CODE);
        this.DISCORD_MESSAGE_DELETE_FRIEND_CODE_NOT_FOUND = this.v(process.env.DISCORD_MESSAGE_DELETE_FRIEND_CODE_NOT_FOUND);
        this.DISCORD_MESSAGE_EDIT_GAME_MASTER = this.v(process.env.DISCORD_MESSAGE_EDIT_GAME_MASTER);
        this.DISCORD_BUTTUN_JOIN = this.v(process.env.DISCORD_BUTTUN_JOIN);
        this.DISCORD_BUTTON_DECLINE = this.v(process.env.DISCORD_BUTTON_DECLINE);
        this.DISCORD_BUTTON_VIEW = this.v(process.env.DISCORD_BUTTON_VIEW);
        this.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR = this.v(process.env.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR);
        this.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR = this.v(process.env.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR);
        this.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME = this.v(process.env.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME);
        this.DISCORD_EXPORT_USER_INFO_NAME_ITEM_ID = this.v(process.env.DISCORD_EXPORT_USER_INFO_NAME_ITEM_ID);
        this.DISCORD_EXPORT_USER_INFO_HAS_ROLE = this.v(process.env.DISCORD_EXPORT_USER_INFO_HAS_ROLE);
        this.DISCORD_EXPORT_USER_INFO_NO_ROLE = this.v(process.env.DISCORD_EXPORT_USER_INFO_NO_ROLE);
        this.DISCORD_COMMAND_NEW_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_NEW_RECRUITMENT);
        this.DISCORD_COMMAND_EDIT_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_EDIT_RECRUITMENT);
        this.DISCORD_COMMAND_DELETE_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_DELETE_RECRUITMENT);
        this.DISCORD_COMMAND_LIST_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_LIST_RECRUITMENT);
        this.DISCORD_COMMAND_REGIST_MASTER = this.v(process.env.DISCORD_COMMAND_REGIST_MASTER);
        this.DISCORD_COMMAND_REGIST_COMMAND = this.v(process.env.DISCORD_COMMAND_REGIST_COMMAND);
        this.DISCORD_COMMAND_USER_INFO_LIST_GET = this.v(process.env.DISCORD_COMMAND_USER_INFO_LIST_GET);
        this.DISCORD_COMMAND_SEARCH_FRIEND_CODE = this.v(process.env.DISCORD_COMMAND_SEARCH_FRIEND_CODE);
        this.DISCORD_COMMAND_REGIST_FRIEND_CODE = this.v(process.env.DISCORD_COMMAND_REGIST_FRIEND_CODE);
        this.DISCORD_COMMAND_DELETE_FRIEND_CODE = this.v(process.env.DISCORD_COMMAND_DELETE_FRIEND_CODE);
        this.DISCORD_COMMAND_EDIT_GAME_MASTER = this.v(process.env.DISCORD_COMMAND_EDIT_GAME_MASTER);
        this.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT);
        this.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT);
        this.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT);
        this.DISCORD_COMMAND_DESCRIPTION_EDIT_GAME_MASTER = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_EDIT_GAME_MASTER);
        this.DISCORD_COMMAND_DESCRIPTION_LIST_RECRUITMENT = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_LIST_RECRUITMENT);
        this.DISCORD_COMMAND_DESCRIPTION_REGIST_MASTER = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_REGIST_MASTER);
        this.DISCORD_COMMAND_DESCRIPTION_USER_INFO_LIST_GET = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_USER_INFO_LIST_GET);
        this.DISCORD_COMMAND_DESCRIPTION_SEARCH_FRIEND_CODE = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_SEARCH_FRIEND_CODE);
        this.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE = this.v(process.env.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE);
        this.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT = this.v(process.env.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT);
        this.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT_REGEXP = this.v(process.env.DISOCRD_UPDATE_CHANNEL_NAME_FORMAT_REGEXP);
        this.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME = this.v(process.env.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME).split(',');
        // message static values section
        this.DISCORD_MESSAGE_EMBED_NO_MEMBER = this.v(process.env.DISCORD_MESSAGE_EMBED_NO_MEMBER);
        this.DISCORD_MESSAGE_EMBED_TITLE = this.v(process.env.DISCORD_MESSAGE_EMBED_TITLE);
        this.DISCORD_MESSAGE_EMBED_OWNER = this.v(process.env.DISCORD_MESSAGE_EMBED_OWNER);
        this.DISCORD_MESSAGE_EMBED_START_TIME = this.v(process.env.DISCORD_MESSAGE_EMBED_START_TIME);
        this.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS = this.v(process.env.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS);
        this.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS = this.v(process.env.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS);
        /** input static values section */
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
        this.DiSCORD_SELECT_MENU_LIMIT_LENGTH = 25;
        this.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT = 'REQRUITMENT_MODAL_NEW_RECRUITMENT';
        this.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT = 'REQRUITMENT_MODAL_EDIT_RECRUITMENT';
        this.DISCORD_MODAL_CUSTOM_ID_DELETE_RECRUITMENT = 'REQRUITMENT_MODAL_DELETE_RECRUITMENT';
        this.DISCORD_MODAL_CUSTOM_ID_LIST_RECRUITMENT = 'REQRUITMENT_MODAL_LIST_RECRUITMENT';
        this.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER = 'REQRUITMENT_MODAL_REGIST_RECRUITMENT';
        this.DISCORD_MODAL_CUSTOM_ID_EXPORT_RECRUITMENT = 'REQRUITMENT_MODAL_EXPORT_RECRUITMENT';
        this.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST = 'DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST';
        this.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST = 'DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST';
        this.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST = 'DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST';
        this.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE = 'DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE';
        this.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST = 'DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST';
        this.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER = 'DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER';
        this.DISCORD_MODAL_TIME_ID = 'time';
        this.DISCORD_MODAL_DESCRIPTION_ID = 'description';
        this.DISCORD_MODAL_FRIEND_CODE_ID = 'friend-code';
        this.DISCORD_MODAL_GAME_MASTER_PRESENCE_NAME_ID = 'game-master-presence-name';
        this.RECRUITMENT_DEFAULT_LIMIT_HOURS = 8;
        this.RECRUITMENT_DEFAULT_MAX_NUMBERS = 6;
        this.RECRUITMENT_INVALID_CHANNEL_ID = 'TARGET_CHANNEL_ID_IS_NOT_FOUND';
        this.RECRUITMENT_INVALID_ROLE = 'TARGET_ROLE_IS_NOT_FOUND';
        this.RECRUITMENT_DEFAULT_DESCRIPTION = 'joined by interaction button.';
        this.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX = 'join-recruite-token=';
        this.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX = 'decline-recruite-token=';
        this.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX = 'view-recruite-token=';
        this.ERROR_RECRUITMENT_TOKEN = 'ERROR_TOKEN';
    }
    /**
     * get value from env, not undefined
     * @param env
     * @returns if env is undefined, return blank.
     */
    v(env) {
        if (env == undefined) {
            return Constants.STRING_EMPTY;
        }
        else {
            return env;
        }
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
     * escape string for regexp (e.g. escape user input string)
     * @param v regexp string non-escaped
     * @returns escaped regexp string
     */
    static escape_regexp(v) {
        return v.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
    }
}
exports.Constants = Constants;
/**
 * reference for blank string
 */
Constants.STRING_EMPTY = '';
;
//# sourceMappingURL=constants.js.map