"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const reference_1 = require("../../entity/reference");
const discord_message_analyzer_1 = require("../../logic/discord_message_analyzer");
test("Test for CheckReqcruitement", () => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("test")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("5")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ゲームのぼしゅうです！！！！！")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ぼしゅうします 今晩やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ぼしゅうする　今晩やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ぼしゅう　今晩やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ゲームのぼしゅう")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ぼしゅう")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ゲーム募集します")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("募集します やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("募集します　やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("募集 やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("募集　やります")).toBe(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("ゲーム募集")).toBe(false);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_recruitment("募集")).toBe(false);
});
test("Test for get_recruitment_text", () => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_text("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_text("募集　やります")).toEqual("やります");
});
test("Test for constructor", () => {
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
test("Test for constructor", () => {
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
test("Test for get numbers", () => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @3")).toEqual(3);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @99")).toEqual(99);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
});
test("Test for List", () => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("リストください")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("一覧ください")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("募集　やります")).toEqual(false);
});
test("Test for user info get list", () => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得します")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得 ")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得 a")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報です")).toEqual(false);
});
//# sourceMappingURL=logic.discord_analyzer.test.js.map