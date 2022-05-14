import { Constants } from '../../common/constants';
const constants = new Constants();

import { Reference } from '../../entity/reference';

import { DiscordMessageAnalyzer } from '../../logic/discord_message_analyzer';

test("Test for CheckReqcruitement", () => {
    expect(DiscordMessageAnalyzer.check_recruitment("test")).toBe(false);
    expect(DiscordMessageAnalyzer.check_recruitment("5")).toBe(false);

    expect(DiscordMessageAnalyzer.check_recruitment("ゲームのぼしゅうです！！！！！")).toBe(false);
    expect(DiscordMessageAnalyzer.check_recruitment("ぼしゅうします 今晩やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("ぼしゅうする　今晩やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("ぼしゅう　今晩やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("ゲームのぼしゅう")).toBe(false);
    expect(DiscordMessageAnalyzer.check_recruitment("ぼしゅう")).toBe(false);

    expect(DiscordMessageAnalyzer.check_recruitment("ゲーム募集します")).toBe(false);
    expect(DiscordMessageAnalyzer.check_recruitment("募集します やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("募集します　やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("募集 やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("募集　やります")).toBe(true);
    expect(DiscordMessageAnalyzer.check_recruitment("ゲーム募集")).toBe(false);
    expect(DiscordMessageAnalyzer.check_recruitment("募集")).toBe(false);
});

test("Test for get_recruitment_text", () => {
    expect(DiscordMessageAnalyzer.get_recruitment_text("ぼしゅうします 今晩やります")).toEqual("今晩やります");
    expect(DiscordMessageAnalyzer.get_recruitment_text("募集　やります")).toEqual("やります");
});

test("Test for constructor", () => {
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

test("Test for constructor", () => {
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
    }).catch((err) => {console.log(err)})
});

test("Test for get numbers", () => {
    expect(DiscordMessageAnalyzer.get_recruitment_numbers("募集します @3")).toEqual(3);
    expect(DiscordMessageAnalyzer.get_recruitment_numbers("募集します @99")).toEqual(99);

    expect(DiscordMessageAnalyzer.get_recruitment_numbers("募集します @a")).toEqual(undefined);
});

test("Test for List", () => {
    expect(DiscordMessageAnalyzer.check_type_list("リストください")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_type_list("一覧ください")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_type_list("募集　やります")).toEqual(false);
});

test("Test for user info get list", () => {
    expect(DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得します")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得 ")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報取得 a")).toEqual(true);
    expect(DiscordMessageAnalyzer.check_user_info_list_get("ユーザ情報です")).toEqual(false);
});
