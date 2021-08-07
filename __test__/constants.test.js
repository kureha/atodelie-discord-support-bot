const Constants = require('./../common/constants');

test("Test for constants", () => {
    var v = new Constants();
    
    expect(v.DISCORD_BOT_TOKEN).not.toBe(undefined);
    expect(v.DISCORD_TOKEN_LENGTH).not.toBe(undefined);
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toBe(undefined);
    expect(v.DISCORD_LATEST_LIST_LENGTH).not.toBe(NaN);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    
    expect(v.SQLITE_FILE).not.toBe(undefined);

    expect(v.DISCORD_ACTIVITY_NAME).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_IS_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_EXCEPTION).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_NEW_RECRUITMENT).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_SUCCESS_JOIN).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_SUCCESS_DECLINE).not.toBe(undefined);
    expect(v.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX).not.toBe(undefined);
    expect(v.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX).not.toBe(undefined);
})

