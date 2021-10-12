"use strict";
exports.__esModule = true;
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
var reference_1 = require("../entity/reference");
var discord_message_analyzer_1 = require("../logic/discord_message_analyzer");
test("Test for CheckReqcruitement", function () {
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
test("Test for get_recruitment_text", function () {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_text("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_text("募集　やります")).toEqual("やります");
});
test("Test for constructor", function () {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze('<@!868275869540569110> ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(function () {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(discord_message_analyzer_1.DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT);
    });
});
test("Test for constructor", function () {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(function () {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    });
});
test("Test for constructor", function () {
    var v = new discord_message_analyzer_1.DiscordMessageAnalyzer();
    v.analyze("<@!868275869540569110>\r\n \u307C\u3057\u3085\u3046 \r\n21:00\u304B\u3089 @3 \u3082\u30FC\u30FC\u30FC\uFF01\uFF08\u30D0\u30B0\u3060\u3089\u3051\u3058\u3083\u3093\u81EA\u5206\u3067\u4F5C\u3063\u3066\u304A\u304D\u306A\u304C\u3089\u30FC\uFF01\uFF09", 'CHR', 'SENDER_ID', '868275869540569110', new reference_1.Reference(undefined)).then(function () {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    })["catch"](function (err) { console.log(err); });
});
test("Test for get numbers", function () {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @3")).toEqual(3);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @99")).toEqual(99);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
});
test("Test for List", function () {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("リストください")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("一覧ください")).toEqual(true);
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.check_type_list("募集　やります")).toEqual(false);
});
