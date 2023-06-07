"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const reference_1 = require("../../entity/reference");
const discord_message_analyzer_1 = require("../../logic/discord_message_analyzer");
test.each([["", false],
    ["test", false],
    ["12345", false],
    ["ぼしゅうです", false],
    ["ゲームのぼしゅう", false],
    ["ぼしゅう", false],
    ["ゲーム募集します", false],
    ["ゲーム募集", false],
    ["募集", false],
    ["ぼしゅうします 今晩です", true],
    ["ぼしゅうします　今晩です", true],
    ["ぼしゅう　今晩です", true],
    ["募集します 今晩です", true],
    ["募集します　今晩です", true],
    ["募集 今晩です", true],
    ["募集　今晩です", true],
])("Test for CheckReqcruitement, %s -> %s", (mes, result) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment(mes)).toBe(result);
});
test.each([["ぼしゅうします 今晩です", "今晩です"], ["募集　今晩です", "今晩です"]])("Test for get_recruitment_text, %s -> %s", (mes, res) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_text(mes)).toEqual(res);
});
test.each([["募集します @0", 0], ["募集します @3", 3], ["募集します @99", 99], ["募集します @a", undefined], ["募集します", undefined], ["", undefined]])("Test for get numbers, %s -> %i", (mes, num) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers(mes)).toEqual(num);
});
test.each([["リストを下さい", true], ["一覧を下さい", true], ["募集　今晩です", false], ["", false]])("Test for List, %s -> %s", (mes, result) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list(mes)).toEqual(result);
});
test.each([["ユーザ情報取得", true], ["ユーザ情報取得します", true], ["ユーザ情報取得 ", true], ["ユーザ情報取得 a", true], ["ユーザ情報します", false], ["", false]])("Test for user info get list, %s -> %s", (mes, result) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get(mes)).toEqual(result);
});
test("Test for constructor 1", () => {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze('<@!868275869540569110> ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(discord_message_analyzer_1.DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT);
    });
});
test("Test for constructor 2", () => {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    });
});
test("Test for constructor", () => {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze(`<@!868275869540569110>\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）`, 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    }).catch((err) => { console.log(err); });
});
//# sourceMappingURL=logic.discord_analyzer.parse.test.js.map