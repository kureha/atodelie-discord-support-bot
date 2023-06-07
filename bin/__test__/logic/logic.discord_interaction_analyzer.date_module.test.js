"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const discord_interaction_analyzer_1 = require("../../logic/discord_interaction_analyzer");
describe("get_recruitment_date test.", () => {
    test.each([
        [0, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T00:00:00.000+09:00")],
        [24, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T00:00:00.000+09:00")],
        [11, 59, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T11:59:00.000+09:00")],
        [12, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T12:00:00.000+09:00")],
        [12, 1, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T12:01:00.000+09:00")],
        [23, 59, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T23:59:00.000+09:00")],
    ])("test for recruitment date test. %s:%s (%s -> %s)", (hour, minute, base_date, exp) => {
        expect(discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_date(hour, minute, base_date)).toEqual(exp);
    });
    test.each([
        [-1, 0, new Date("2010-01-01T12:00:00.000+09:00")],
        [25, 0, new Date("2010-01-01T12:00:00.000+09:00")],
        [0, -1, new Date("2010-01-01T12:00:00.000+09:00")],
        [0, 60, new Date("2010-01-01T12:00:00.000+09:00")],
    ])("test for recruitment date out of range test. %s:%s (%s)", (hour, minute, base_date) => {
        expect(discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_date(hour, minute, base_date)).toEqual(undefined);
    });
    test.each([
        ["test 2048 1234 message", [], 20, 48],
        ["test 2048 1234 2345 message", ["2048", "1234"], 23, 45],
        ["test 2048 1234 message", ["2048"], 12, 34],
        ["test 2099 1234 message", ["2099"], 12, 34],
        ["test 1234 2099 message", ["2099"], 12, 34],
        ["test 1234 2099 message", [], 12, 34],
    ])('test for get time with expects. %s (ignore: %s) -> %s:%s', (input, ignore_list, hour, minute) => {
        expect.assertions(3);
        let result = discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_time(input, ignore_list);
        if (result) {
            expect(result.getHours()).toEqual(hour);
            expect(result.getMinutes()).toEqual(minute);
            expect(result.getSeconds()).toEqual(0);
        }
    });
    test.each([
        ["test 2061 1234 message", []],
        ["test 1234 2061 message", ["2061"]],
    ])('test for get time out of range. %s (ignore: %s) -> %s:%s', (input, ignore_list) => {
        expect(discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_time(input, ignore_list)).toBeUndefined;
    });
});
describe("remove_full_wide_digits test.", () => {
    test.each([
        ["", ""],
        ["１２３４５６７８９０", "1234567890"],
        [" １２３４５６７８９０", " 1234567890"],
        ["１２３４５６７８９０ ", "1234567890 "],
        ["１a２b３c４d５e６f７g８h９i０", "1a2b3c4d5e6f7g8h9i0"],
        ["あいうえお１２３４５かきくけこ", "あいうえお12345かきくけこ"],
        ["1234567890", "1234567890"],
    ])('test for full-width character replace tests, %s -> %s', (input, expected) => {
        expect(discord_interaction_analyzer_1.DiscordInteractionAnalyzer.remove_full_wide_digits(input)).toEqual(expected);
    });
});
describe("get_token test.", () => {
    test.each([
        ["", "", constants.ERROR_RECRUITMENT_TOKEN],
        ["button-id-a1b2c3test", "button-id-", "a1b2c3test"],
        [" button-id-a1b2c3test", " button-id-", "a1b2c3test"],
        ["button-id-a1b2c3test ", "button-id-", "a1b2c3test "],
        ["button-id-a1b2c3test", "a1b2c3test", constants.ERROR_RECRUITMENT_TOKEN],
        [" button-id-a1b2c3test", "button-id-", constants.ERROR_RECRUITMENT_TOKEN],
        ["button-id-a1b2c3test", " button-id-", constants.ERROR_RECRUITMENT_TOKEN],
    ])("get token from button interaction id. button id = %s, prefix string = %s, exp = %s", (input, prefix, exp) => {
        const a = new discord_interaction_analyzer_1.DiscordInteractionAnalyzer();
        expect(a.get_token(input, prefix)).toEqual(exp);
    });
});
//# sourceMappingURL=logic.discord_interaction_analyzer.date_module.test.js.map