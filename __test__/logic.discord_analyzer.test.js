const DiscordAnalyzer = require('../logic/discord_message_analyzer');
const Constants = require('./../common/constants');
const constants = new Constants();

test("Test for CheckReqcruitement", () => {
    expect(DiscordAnalyzer.check_recruitment("test")).toBe(false);
    expect(DiscordAnalyzer.check_recruitment(5)).toBe(false);

    expect(DiscordAnalyzer.check_recruitment("ゲームのぼしゅうです！！！！！")).toBe(false);
    expect(DiscordAnalyzer.check_recruitment("ぼしゅうします 今晩やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("ぼしゅうする　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("ぼしゅう　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("ゲームのぼしゅう")).toBe(false);
    expect(DiscordAnalyzer.check_recruitment("ぼしゅう")).toBe(false);

    expect(DiscordAnalyzer.check_recruitment("ゲーム募集します")).toBe(false);
    expect(DiscordAnalyzer.check_recruitment("募集します やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("募集します　やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("募集 やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("募集　やります")).toBe(true);
    expect(DiscordAnalyzer.check_recruitment("ゲーム募集")).toBe(false);
    expect(DiscordAnalyzer.check_recruitment("募集")).toBe(false);
});

test("Test for get_recruitment_text", () => {
    expect(DiscordAnalyzer.get_recruitment_text("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(DiscordAnalyzer.get_recruitment_text("募集　やります")).toEqual("やります");
});

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110');
    expect(v.server_id).toEqual('CHR');
    expect(v.valid).toEqual(true);
    expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
    expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.name).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.max_number).toEqual(DiscordAnalyzer.MAX_NUMBERS_DEFAULT);
})

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110');
    expect(v.server_id).toEqual('CHR');
    expect(v.valid).toEqual(true);
    expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
    expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.name).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.max_number).toEqual(3);
})

test("Test for get numbers", () => {
    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @3")).toEqual(3);
    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @99")).toEqual(99);

    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
});

test("Test for List", () => {
    expect(DiscordAnalyzer.check_type_list("リストください")).toEqual(true);
    expect(DiscordAnalyzer.check_type_list("一覧ください")).toEqual(true);
    expect(DiscordAnalyzer.check_type_list("募集　やります")).toEqual(false);
});
