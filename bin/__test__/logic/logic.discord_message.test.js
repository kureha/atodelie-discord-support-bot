"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import module
const discord_message_1 = require("../../logic/discord_message");
const test_entity_1 = require("../common/test_entity");
describe("enable_lf", () => {
    test.each([
        ["\n", "\n"],
        ["abc\ndef", "abc\ndef"],
        ['\\n', "\n"],
        ['abc\\n', "abc\n"],
        ['\\ndef', "\ndef"],
        ['abc\\ndef', "abc\ndef"],
        ['abc\\ndef\\nghq', "abc\ndef\nghq"],
        ['abc\\r\\ndef', "abc\ndef"],
        ['abc\\r\\ndef\\r\\nghq', "abc\ndef\nghq"],
    ])("restore lf characer test. %s -> %s", (input, exp) => {
        expect(discord_message_1.DiscordMessage.enable_lf(input)).toEqual(exp);
    });
});
describe("enable_tab test.", () => {
    test.each([
        ["\t", "\t"],
        ["abc\tdef", "abc\tdef"],
        ['\\t', "\t"],
        ['abc\\t', "abc\t"],
        ['\\tdef', "\tdef"],
        ['abc\\tdef', "abc\tdef"],
        ['abc\\tdef\\tghq', "abc\tdef\tghq"],
    ])("restore tab characer test. %s -> %s", (input, exp) => {
        expect(discord_message_1.DiscordMessage.enable_tab(input)).toEqual(exp);
    });
});
describe("get_date_string test.", () => {
    test.each([
        [new Date('2001-02-23T12:34:56.000+09:00'), '2001/2/23 12:34:56'],
        [new Date('2001-01-02T01:02:03.000+09:00'), '2001/1/2 1:02:03'],
        [new Date('2000-01-01T00:00:00.000+09:00'), '2000/1/1 0:00:00'],
        [new Date('2099-12-31T23:59:59.000+09:00'), '2099/12/31 23:59:59'],
    ])("get message date string test. %s -> %s", (input, exp) => {
        expect(discord_message_1.DiscordMessage.get_date_string(input)).toEqual(exp);
    });
});
describe("get_recruitment_thread_title test.", () => {
    test.each([
        ["", "", ""],
        ["no matched now.", "", "no matched now."],
        ["matched value\n = %%TITLE%%.", "replaced", "matched value\n = replaced."],
        ["matched value\n = %%TITLE%%.", "", "matched value\n = ."],
    ])("input value test. (%s, %s) -> %s", (template, title, exp) => {
        // setup mock
        const recruitment = test_entity_1.TestEntity.get_test_recruitment();
        recruitment.name = title;
        // expect
        expect(discord_message_1.DiscordMessage.get_recruitment_thread_title(template, recruitment)).toEqual(exp);
    });
});
describe("get_recruitment_announcement_message test.", () => {
    test.each([
        ["", "", "", ""],
        ["no matched now.", "", "", "no matched now."],
        ["matched value\n = %%DISCORD_REPLY_ROLE%%, %%TOKEN%%.", "replaced", "token", "matched value\n = replaced, token."],
        ["matched value\n = %%DISCORD_REPLY_ROLE%%, %%TOKEN%%.", "", "", "matched value\n = , ."],
    ])("input value test. (%s, %s) -> %s", (template, target_role, token, exp) => {
        // setup mock
        const recruitment = test_entity_1.TestEntity.get_test_recruitment();
        recruitment.name = target_role;
        recruitment.token = token;
        // expect
        expect(discord_message_1.DiscordMessage.get_recruitment_announcement_message(template, target_role, recruitment)).toEqual(exp);
    });
});
describe("get_no_recruitment test.", () => {
    expect(discord_message_1.DiscordMessage.get_no_recruitment().length).not.toBe(0);
});
//# sourceMappingURL=logic.discord_message.test.js.map