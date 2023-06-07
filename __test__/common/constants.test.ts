import { Constants } from './../../common/constants';

test("Test for constants", () => {
    let v = new Constants();

    expect(v.DISCORD_BOT_TOKEN).not.toEqual('');
    expect(v.DISCORD_BOT_ADMIN_USER_ID).not.toEqual('');
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toEqual('');
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toEqual(NaN);
    expect(v.DISCORD_FOLLOW_MINUTE).not.toEqual('');
    expect(v.DISCORD_FOLLOW_MINUTE).not.toEqual(NaN);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toEqual('');
    expect(v.DISCORD_FOLLOW_CRON).not.toEqual('');
    expect(v.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE).not.toEqual(NaN);
    expect(v.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL).toEqual('-60 minutes');

    expect(v.SQLITE_FILE).not.toEqual('');
    expect(v.SQLITE_TEMPLATE_FILE).not.toEqual('');

    expect(v.DISCORD_ACTIVITY_NAME).not.toEqual('');
    expect(v.DISCORD_MESSAGE_IS_INVALID).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toEqual('');
    expect(v.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EXPORT_TITLE).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EXPORT_USER_INFO).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EXCEPTION).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED).not.toEqual('');
    expect(v.DISCORD_MESSAGE_NO_PERMISSION).not.toEqual('');
    expect(v.DISCORD_MESSAGE_SETTING_IS_NOT_READY).not.toEqual('');

    expect(v.DISCORD_RECRUITMENT_THREAD_TITLE).not.toEqual('');
    expect(v.DISCORD_RECRUITMENT_THREAD_ANNOUNCEMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_NEW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EDIT_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_DELETE_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_SUCCESS_JOIN).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN).not.toEqual('');
    expect(v.DISCORD_MESSAGE_SUCCESS_VIEW).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW).not.toEqual('');
    expect(v.DISCORD_MESSAGE_SUCCESS_DECLINE).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE).not.toEqual('');
    expect(v.DISCORD_MESSAGE_FOLLOW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_FOLLOW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_MESSAGE_REGIST_SERVER_INFO).not.toEqual('');

    expect(v.DISCORD_BUTTUN_JOIN).not.toEqual('');
    expect(v.DISCORD_BUTTON_DECLINE).not.toEqual('');
    expect(v.DISCORD_BUTTON_VIEW).not.toEqual('');

    expect(v.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR).not.toEqual('');
    expect(v.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR).not.toEqual('');
    expect(v.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME).not.toEqual('');
    expect(v.DISCORD_EXPORT_USER_INFO_HAS_ROLE).not.toEqual('');
    expect(v.DISCORD_EXPORT_USER_INFO_NO_ROLE).toEqual('');

    expect(v.DISCORD_COMMAND_NEW_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_COMMAND_EDIT_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_COMMAND_DELETE_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_COMMAND_LIST_RECRUITMENT).not.toEqual('');
    expect(v.DISCORD_COMMAND_REGIST_MASTER).not.toEqual('');
    expect(v.DISCORD_COMMAND_USER_INFO_LIST_GET).not.toEqual('');
    expect(v.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME).not.toEqual('');

    expect(v.DISCORD_MESSAGE_EMBED_NO_MEMBER).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EMBED_TITLE).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EMBED_OWNER).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EMBED_START_TIME).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS).not.toEqual('');
    expect(v.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS).not.toEqual('');
})

