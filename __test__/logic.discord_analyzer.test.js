const DiscordAnalyzer = require('../logic/discord_analyzer');
const Constants = require('./../common/constants');
const constants = new Constants();

test("Test for CheckReqcruitement", () => {
    expect(DiscordAnalyzer.CheckRecruitment("test")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment(5)).toBe(false);

    expect(DiscordAnalyzer.CheckRecruitment("ゲームのぼしゅうです！！！！！")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅうします 今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅうする　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅう　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ゲームのぼしゅう")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅう")).toBe(false);

    expect(DiscordAnalyzer.CheckRecruitment("ゲーム募集します")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("募集します やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集します　やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集 やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集　やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ゲーム募集")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("募集")).toBe(false);
});

test("Test for GetRecruitmentText", () => {
    expect(DiscordAnalyzer.GetRecruitmentText("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(DiscordAnalyzer.GetRecruitmentText("募集　やります")).toEqual("やります");
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
    expect(v.id).toEqual("123");
})

test("Test for get numbers", () => {
    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @3")).toEqual(3);
    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @99")).toEqual(99);

    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @a")).toEqual(undefined);
});

test("Test for Check decline", () => {
    expect(DiscordAnalyzer.CheckDecline("12345行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("12345 いけない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("12345　行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline(" 12345いけない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("　12345行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("募集　やります")).toBe(false);
    expect(DiscordAnalyzer.CheckDecline("参加")).toBe(false);
    expect(DiscordAnalyzer.CheckDecline("参加")).toBe(false);
});

test("Get for decline id", () => {
    expect(DiscordAnalyzer.GetDeclineToken("12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineToken("12345 いけない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineToken("12345　行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineToken(" 12345いけない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineToken("　12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineToken("募集　やります")).toBe(undefined);
    expect(DiscordAnalyzer.GetDeclineToken("参加")).toBe(undefined);
    expect(DiscordAnalyzer.GetDeclineToken("参加")).toBe(undefined);
});

test("Test for List", () => {
    expect(DiscordAnalyzer.CheckTypeList("リストください")).toEqual(true);
    expect(DiscordAnalyzer.CheckTypeList("一覧ください")).toEqual(true);
    expect(DiscordAnalyzer.CheckTypeList("募集　やります")).toEqual(false);
});
