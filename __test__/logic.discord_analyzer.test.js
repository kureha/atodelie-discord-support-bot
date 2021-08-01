const DiscordAnalyzer = require('../logic/discord_analyzer');
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
    expect(v.channel_id).toEqual('CHR');
    expect(v.valid).toEqual(true);
    expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
    expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.name).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.max_number).toEqual(DiscordAnalyzer.MAX_NUMBERS_DEFAULT);
})

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110');
    expect(v.channel_id).toEqual('CHR');
    expect(v.valid).toEqual(true);
    expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
    expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.name).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.max_number).toEqual(3);
})

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> 123 参加', 'CHR', 'SENDER_ID', '868275869540569110');
    expect(v.channel_id).toEqual('CHR');
    expect(v.valid).toEqual(true);
    expect(v.type).toEqual(constants.TYPE_JOIN);
    expect(v.token).toEqual("123");
})

test("Test for get numbers", () => {
    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @3")).toEqual(3);
    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @99")).toEqual(99);

    expect(DiscordAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
});

test("Test for Check decline", () => {
    expect(DiscordAnalyzer.check_decline("12345行けない")).toBe(true);
    expect(DiscordAnalyzer.check_decline("12345 いけない")).toBe(true);
    expect(DiscordAnalyzer.check_decline("12345　行けない")).toBe(true);
    expect(DiscordAnalyzer.check_decline(" 12345いけない")).toBe(true);
    expect(DiscordAnalyzer.check_decline("　12345行けない")).toBe(true);
    expect(DiscordAnalyzer.check_decline("募集　やります")).toBe(false);
    expect(DiscordAnalyzer.check_decline("参加")).toBe(false);
    expect(DiscordAnalyzer.check_decline("参加")).toBe(false);
});

test("Get for decline id", () => {
    expect(DiscordAnalyzer.get_decline_token("12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.get_decline_token("12345 いけない")).toBe("12345");
    expect(DiscordAnalyzer.get_decline_token("12345　行けない")).toBe("12345");
    expect(DiscordAnalyzer.get_decline_token(" 12345いけない")).toBe("12345");
    expect(DiscordAnalyzer.get_decline_token("　12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.get_decline_token("募集　やります")).toBe(undefined);
    expect(DiscordAnalyzer.get_decline_token("参加")).toBe(undefined);
    expect(DiscordAnalyzer.get_decline_token("参加")).toBe(undefined);
});

test("Test for List", () => {
    expect(DiscordAnalyzer.check_type_list("リストください")).toEqual(true);
    expect(DiscordAnalyzer.check_type_list("一覧ください")).toEqual(true);
    expect(DiscordAnalyzer.check_type_list("募集　やります")).toEqual(false);
});
