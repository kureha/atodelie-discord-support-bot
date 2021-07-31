const DiscordAnalyzer = require('../logic/discord_analyzer');

test("Test for CheckReqcruitement", () => {
    expect(DiscordAnalyzer.CheckRecruitment("test")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment(5)).toBe(false);

    expect(DiscordAnalyzer.CheckRecruitment("Apexのぼしゅうです！！！！！")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅうします 今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅうする　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅう　今晩やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("Apexのぼしゅう")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("ぼしゅう")).toBe(false);

    expect(DiscordAnalyzer.CheckRecruitment("Apex募集します")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("募集します やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集します　やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集 やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("募集　やります")).toBe(true);
    expect(DiscordAnalyzer.CheckRecruitment("Apex募集")).toBe(false);
    expect(DiscordAnalyzer.CheckRecruitment("募集")).toBe(false);
});

test("Test for GetRecruitmentText", () => {
    expect(DiscordAnalyzer.GetRecruitmentText("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(DiscordAnalyzer.GetRecruitmentText("募集　やります")).toEqual("やります");
});

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', '868275869540569110');
    expect(v.channel_id).toEqual('CHR');
    expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.title).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！） (最大人数 : 6人)');
    expect(v.time).toEqual(DiscordAnalyzer.TIME_DEFAULT);
    expect(v.max_number).toEqual(DiscordAnalyzer.MAX_NUMBERS_DEFAULT);
})

test("Test for constructor", () => {
    /**
    var v = new DiscordAnalyzer('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', '868275869540569110');
    expect(v.channel_id).toEqual('CHR');
    expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.title).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
    expect(v.time).toEqual("21:00");
    expect(v.max_number).toEqual(3);
     */
})

test("Test for constructor", () => {
    var v = new DiscordAnalyzer('<@!868275869540569110> 123 参加', 'CHR', '868275869540569110');
    expect(v.channel_id).toEqual('CHR');
    expect(v.type).toEqual(DiscordAnalyzer.TYPE_JOIN);
    expect(v.id).toEqual("123");
})

test("Test for get times", () => {
    /**
    expect(DiscordAnalyzer.GetRecruitmentTime("24時からやります")).toEqual("00:00");
    expect(DiscordAnalyzer.GetRecruitmentTime("23時からやります")).toEqual("23:00");
    expect(DiscordAnalyzer.GetRecruitmentTime("0時からやります")).toEqual("00:00");
    expect(DiscordAnalyzer.GetRecruitmentTime("25時からやります")).toEqual(undefined);
    expect(DiscordAnalyzer.GetRecruitmentTime("-1時からやります")).toEqual("01:00");

    expect(DiscordAnalyzer.GetRecruitmentTime("24:00からやります")).toEqual("00:00");
    expect(DiscordAnalyzer.GetRecruitmentTime("23:59からやります")).toEqual("23:59");
    expect(DiscordAnalyzer.GetRecruitmentTime("0000からやります")).toEqual("00:00");
    expect(DiscordAnalyzer.GetRecruitmentTime("25:00からやります")).toEqual(undefined);
    expect(DiscordAnalyzer.GetRecruitmentTime("-01:00からやります")).toEqual("01:00");
     */
});

test("Test for get times", () => {
    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @3")).toEqual(3);
    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @99")).toEqual(99);

    expect(DiscordAnalyzer.GetRecruitmentNumbers("募集します @a")).toEqual(undefined);
});

/**
test("Test for Join", () => {
    expect(DiscordAnalyzer.CheckDecline("12345行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("12345 いけない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("12345　行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline(" 12345いけない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("　12345行けない")).toBe(true);
    expect(DiscordAnalyzer.CheckDecline("募集　やります")).toBe(false);
    expect(DiscordAnalyzer.CheckDecline("参加")).toBe(false);
    expect(DiscordAnalyzer.CheckDecline("参加")).toBe(false);
});


test("Get for Join", () => {
    expect(DiscordAnalyzer.GetDeclineId("12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineId("12345 いけない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineId("12345　行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineId(" 12345いけない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineId("　12345行けない")).toBe("12345");
    expect(DiscordAnalyzer.GetDeclineId("募集　やります")).toBe(undefined);
    expect(DiscordAnalyzer.GetDeclineId("参加")).toBe(undefined);
    expect(DiscordAnalyzer.GetDeclineId("参加")).toBe(undefined);
});


test("Test for List", () => {
    expect(DiscordAnalyzer.CheckTypeList("リストください")).toEqual(true);
    expect(DiscordAnalyzer.CheckTypeList("一覧ください")).toEqual(true);
    expect(DiscordAnalyzer.CheckTypeList("募集　やります")).toEqual(false);
});

test("Test for ListMes", () => {
    var res = DiscordAnalyzer.GetEmbedList([
        {
            "id": 1,
            "title": "あああ",
            "user_name": "いいい"
        },
        {
            "id": 1,
            "title": "あああ",
            "user_name": "ううう"
        },
        {
            "id": 2,
            "title": "かかか",
            "user_name": "ききき"
        }
    ]);
    console.log(res);
});
*/