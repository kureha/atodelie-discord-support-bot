import { Constants } from '../../common/constants';
const constants = new Constants();

import { Reference } from '../../entity/reference';

import { DiscordMessageAnalyzer } from '../../logic/discord_message_analyzer';

test.each(
    [["test", false],
    ["5", false],
    ["ゲームのぼしゅうです！！！！！", false],
    ["ゲームのぼしゅう", false],
    ["ぼしゅう", false],
    ["ゲーム募集します", false],
    ["ゲーム募集", false],
    ["募集", false],
    ["ぼしゅうします 今晩やります", true],
    ["ぼしゅうする　今晩やります", true],
    ["ぼしゅう　今晩やります", true],
    ["募集します やります", true],
    ["募集します　やります", true],
    ["募集 やります", true],
    ["募集　やります", true],
    ]
)("Test for CheckReqcruitement, %s -> %s", (mes: string, result: boolean) => {
    expect(DiscordMessageAnalyzer.check_recruitment(mes)).toBe(result);
});

test.each(
    [["ぼしゅうします 今晩やります", "今晩やります"], ["募集　やります", "やります"]]
)("Test for get_recruitment_text, %s -> %s", (mes: string, res: string) => {
    expect(DiscordMessageAnalyzer.get_recruitment_text(mes)).toEqual(res);
});

test.each(
    [["募集します @3", 3], ["募集します @99", 99]]
)("Test for get numbers, %s -> %i", (mes: string, num: number) => {
    expect(DiscordMessageAnalyzer.get_recruitment_numbers(mes)).toEqual(num);
});

test("Test for get invalid numbers", () => {
    expect(DiscordMessageAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
})

test.each(
    [["リストください", true], ["一覧ください", true], ["募集　やります", false]]
)("Test for List, %s -> %s", (mes: string, result: boolean) => {
    expect(DiscordMessageAnalyzer.check_type_list(mes)).toEqual(result);
});

test.each(
    [["ユーザ情報取得", true], ["ユーザ情報取得します", true], ["ユーザ情報取得 ", true], ["ユーザ情報取得 a", true], ["ユーザ情報です", false]]
)("Test for user info get list, %s -> %s", (mes: string, result: boolean) => {
    expect(DiscordMessageAnalyzer.check_user_info_list_get(mes)).toEqual(result);
});

test("Test for constructor 1", () => {
    var v = new DiscordMessageAnalyzer();
    v.analyze('<@!868275869540569110> ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT);
    });
});

test("Test for constructor 2", () => {
    var v = new DiscordMessageAnalyzer()
    v.analyze('<@!868275869540569110> ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）', 'CHR', 'SENDER_ID', '868275869540569110', new Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('ぼしゅう 21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    })
});

test("Test for constructor", () => {
    var v = new DiscordMessageAnalyzer()
    v.analyze(`<@!868275869540569110>\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）`, 'CHR', 'SENDER_ID', '868275869540569110', new Reference(undefined)).then(() => {
        expect(v.server_id).toEqual('CHR');
        expect(v.valid).toEqual(true);
        expect(v.type).toEqual(constants.TYPE_RECRUITEMENT);
        expect(v.message).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.name).toEqual('\r\n ぼしゅう \r\n21:00から @3 もーーー！（バグだらけじゃん自分で作っておきながらー！）');
        expect(v.max_number).toEqual(3);
    }).catch((err) => { console.log(err) })
});
