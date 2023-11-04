declare namespace NodeJS {
    /**
     * dotenv interfaces
     */
    interface ProcessEnv {
        readonly DISCORD_BOT_TOKEN: string;
        readonly DISCORD_BOT_ADMIN_USER_ID: string;
        readonly DISCORD_LATEST_LIST_LENGTH: string;
        readonly DISCORD_FOLLOW_MINUTE: string;
        readonly DISCORD_FOLLOW_CRON: string;
        readonly DISCORD_ACTIVITY_RECORD_CRON: string;
        readonly DISCORD_AUTO_ANNOUNCE_CRON: string;
        readonly DISCORD_UPDATE_CHANNEL_NAME_CRON: string;
        readonly DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE: string;
        readonly DISCORD_AUTO_RE_ANNOUNCEMENT_COUNT_THRESHOLD: string;
        readonly DISCORD_AUTO_ANNOUNCEMENT_MEMBER_THRESHOLD: string;
        readonly DISCORD_ACTIVITY_HISTORY_SAVE_LIMIT_MONTH: string;

        readonly DEV_MODE: string;

        readonly DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT: string;
        readonly DISCORD_FRIEND_CODE_OTHER_COUNT: string;
        readonly DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST: string;
        readonly DISCORD_PRESENCE_IGNORE_NAME_LIST: string;

        readonly DATABASE_URL: string;

        readonly EXPORT_USER_INFO_PATH: string;

        readonly DISCORD_ACTIVITY_NAME: string;
        readonly DISCORD_MESSAGE_IS_INVALID: string;
        readonly DISCORD_MESSAGE_TYPE_INVALID: string;
        readonly DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_EXPORT_TITLE: string;
        readonly DISCORD_MESSAGE_EXPORT_USER_INFO: string;
        readonly DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED: string;
        readonly DISCORD_MESSAGE_EXCEPTION: string;
        readonly DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED: string;
        readonly DISCORD_MESSAGE_NO_PERMISSION: string;
        readonly DISCORD_MESSAGE_COMMAND_IS_REGIST: string;
        readonly DISCORD_MESSAGE_SETTING_IS_NOT_READY: string;
        readonly DISCORD_MESSAGE_SETTING_ROLE_SELECT: string;
        readonly DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_REGIST_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_SEARCH_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_SELECT_GAME_MASTER_FOR_DELETE_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_SELECT_AUTO_ANNOUNCEMENT: string;

        readonly DISCORD_RECRUITMENT_MODAL_TIME: string;
        readonly DISCORD_RECRUITMENT_MODAL_DESCRIPTION: string;
        readonly DISCORD_FRIEND_CODE_MODAL_FRIEND_CODE: string;
        readonly DISCORD_GAME_MASTER_MODAL_DESCRIPTION: string;
        readonly DISCORD_GAME_MASTER_MODAL_PRECENSE_NAME: string;

        readonly DISCORD_RECRUITMENT_THREAD_TITLE: string;
        readonly DISCORD_RECRUITMENT_THREAD_ANNOUNCEMENT: string;
        readonly DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_NEW_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_EDIT_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_DELETE_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_TITLE_SUCCESS_JOIN: string;
        readonly DISCORD_MESSAGE_SUCCESS_JOIN: string;
        readonly DISCORD_MESSAGE_TITLE_SUCCESS_VIEW: string;
        readonly DISCORD_MESSAGE_SUCCESS_VIEW: string;
        readonly DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE: string;
        readonly DISCORD_MESSAGE_SUCCESS_DECLINE: string;
        readonly DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_FOLLOW_RECRUITMENT: string;
        readonly DISCORD_MESSAGE_REGIST_SERVER_INFO: string;
        readonly DISCORD_MESSAGE_REGIST_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_SEARCH_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_SEARCH_FRIEND_CODE_NOT_FOUND: string;
        readonly DISCORD_MESSAGE_DELETE_FRIEND_CODE: string;
        readonly DISCORD_MESSAGE_DELETE_FRIEND_CODE_NOT_FOUND: string;
        readonly DISCORD_MESSAGE_EDIT_GAME_MASTER: string;
        readonly DISCORD_MESSAGE_RESET_GAME_MASTER: string;

        readonly DISCORD_MESSAGE_EMBED_NO_MEMBER: string;
        readonly DISCORD_MESSAGE_EMBED_TITLE: string;
        readonly DISCORD_MESSAGE_EMBED_OWNER: string;
        readonly DISCORD_MESSAGE_EMBED_START_TIME: string;
        readonly DISCORD_MESSAGE_EMBED_JOIN_MEMBERS: string;
        readonly DISCORD_MESSAGE_EMBED_VIEW_MEMBERS: string;

        readonly DISCORD_BUTTUN_JOIN: string;
        readonly DISCORD_BUTTON_DECLINE: string;
        readonly DISCORD_BUTTON_VIEW: string;

        readonly DISCORD_EXPORT_USER_INFO_SPLIT_CHAR: string;
        readonly DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR: string;
        readonly DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME: string;
        readonly DISCORD_EXPORT_USER_INFO_NAME_ITEM_ID: string;
        readonly DISCORD_EXPORT_USER_INFO_HAS_ROLE: string;
        readonly DISCORD_EXPORT_USER_INFO_NO_ROLE: string;

        readonly DISCORD_COMMAND_NEW_RECRUITMENT: string;
        readonly DISCORD_COMMAND_EDIT_RECRUITMENT: string;
        readonly DISCORD_COMMAND_DELETE_RECRUITMENT: string;
        readonly DISCORD_COMMAND_LIST_RECRUITMENT: string;
        readonly DISCORD_COMMAND_USER_INFO_LIST_GET: string;
        readonly DISCORD_COMMAND_REGIST_MASTER: string;
        readonly DISCORD_COMMAND_REGIST_COMMAND: string;
        readonly DISCORD_COMMAND_SEARCH_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_REGIST_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_DELETE_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_EDIT_GAME_MASTER: string;
        readonly DISCORD_COMMAND_RESET_GAME_MASTER: string;

        readonly DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT: string;
        readonly DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT: string;
        readonly DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT: string;
        readonly DISCORD_COMMAND_DESCRIPTION_LIST_RECRUITMENT: string;
        readonly DISCORD_COMMAND_DESCRIPTION_REGIST_MASTER: string;
        readonly DISCORD_COMMAND_DESCRIPTION_USER_INFO_LIST_GET: string;
        readonly DISCORD_COMMAND_DESCRIPTION_SEARCH_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_DESCRIPTION_DELETE_FRIEND_CODE: string;
        readonly DISCORD_COMMAND_DESCRIPTION_EDIT_GAME_MASTER: string;
        readonly DISCORD_COMMAND_DESCRIPTION_RESET_GAME_MASTER: string;

        readonly DISOCRD_UPDATE_CHANNEL_NAME_FORMAT: string;
        readonly DISOCRD_UPDATE_CHANNEL_NAME_FORMAT_REGEXP: string;

        readonly DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME: string;
    }
}