const Constants = require('./../common/constants');

test("Test for constants", () => {
    var v = new Constants();
    
    expect(v.DISCORD_REPLY_ROLE).not.toBe(undefined);
    expect(v.DISCORD_BOT_TOKEN).not.toBe(undefined);
    expect(v.DISCORD_TOKEN_LENGTH).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    
    expect(v.SQLITE_FILE).not.toBe(undefined);

    expect(v.DISCORD_ACTIVITY_NAME).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_IS_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TYPE_INVALID).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_TOKEN_GENERATE_LIMIT_EXCEEDED).not.toBe(undefined);
    expect(v.DISCORD_MESSAGE_NEW_RECRUITMENT).not.toBe(undefined);
})

