const Constants = require('./../common/constants');

test("Test for constants", () => {
    var v = new Constants();
    
    expect(v.DISCORD_BOT_TOKEN).not.toBe(undefined);
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toBe(undefined);
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toBe(NaN);
    expect(v.DISCORD_FOLLOW_MINUTE).not.toBe(undefined);
    expect(v.DISCORD_FOLLOW_MINUTE).not.toBe(NaN);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    expect(v.DISCORD_FOLLOW_CRON).not.toBe(undefined);
    
    expect(v.SQLITE_FILE).not.toBe(undefined);

    expect(v.DISCORD_ACTIVITY_NAME).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_IS_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EXCEPTION).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_NEW_RECRUITMENT).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_SUCCESS_JOIN).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_SUCCESS_DECLINE).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_FOLLOW_RECRUITMENT).not.toBe(undefined);

    expect(v.DISCORD_MESSAGE_EMBED_NO_MEMBER).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EMBED_TITLE).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EMBED_OWNER).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EMBED_START_TIME).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EMBED_MEMBERS).not.toBe(undefined);

    expect(v.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX).not.toBe(undefined);
    expect(v.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX).not.toBe(undefined);
})

