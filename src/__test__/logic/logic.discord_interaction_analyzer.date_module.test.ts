// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

import { DiscordInteractionAnalyzer } from '../../logic/discord_interaction_analyzer';

describe('analyze', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        ["join-recruite-token=test_token", 'test-uid', "test-token", constants.TYPE_JOIN, constants.STATUS_ENABLED, false],
        ["view-recruite-token=test_token", 'test-uid', "test-token", constants.TYPE_VIEW, constants.STATUS_VIEW, false],
        ["decline-recruite-token=test_token", 'test-uid', "test-token", constants.TYPE_DECLINE, constants.STATUS_DISABLED, true],
    ])('test for analyze, (%s, %s, %s) -> %s, %s, %s', async (
        custom_id: string, user_id: string, token: string,
        expected_type: number, expected_status: number, expected_delete: boolean
    ) => {
        // setup mock
        jest.spyOn(DiscordInteractionAnalyzer.prototype, 'get_token')
            .mockImplementationOnce(() => { return token; });

        const analyzer = new DiscordInteractionAnalyzer();
        const result = await analyzer.analyze(custom_id, user_id);

        expect(result.user_id).toEqual(user_id);
        expect(result.token).toEqual(token);
        expect(result.type).toEqual(expected_type);
        expect(result.status).toEqual(expected_status);
        expect(result.delete).toEqual(expected_delete);
    });
    test.each([
        ["error-recruite-token=test_token", 'test-uid', "test-token", constants.TYPE_JOIN, constants.STATUS_ENABLED, false],
        ["", 'test-uid', "test-token", constants.TYPE_VIEW, constants.STATUS_VIEW, false],
    ])('test for analyze for exception,  (%s, %s, %s) -> %s, %s, %s', async (
        custom_id: string, user_id: string, token: string,
        expected_type: number, expected_status: number, expected_delete: boolean
    ) => {
        // setup mock
        jest.spyOn(DiscordInteractionAnalyzer.prototype, 'get_token')
            .mockImplementationOnce(() => { return token; });

        expect(async () => {
            const analyzer = new DiscordInteractionAnalyzer();
            await analyzer.analyze(custom_id, user_id);
        }).rejects.toThrowError(/^this interaction dosen't match join recruitment./);

    });
});

describe('setter', () => {
    test.each([[1, 'test'], [0, '']])('setter test (%s, %s)', (id: number, token: string) => {
        const analyzer = new DiscordInteractionAnalyzer();
        analyzer.set_id(id);
        analyzer.set_token(token);
        expect(analyzer.id).toEqual(id);
        expect(analyzer.token).toEqual(token);
    });
});

describe("get_token.", () => {
    test.each(
        [
            ["", "", constants.ERROR_RECRUITMENT_TOKEN],
            ["button-id-a1b2c3test", "button-id-", "a1b2c3test"],
            [" button-id-a1b2c3test", " button-id-", "a1b2c3test"],
            ["button-id-a1b2c3test ", "button-id-", "a1b2c3test "],
            ["button-id-a1b2c3test", "a1b2c3test", constants.ERROR_RECRUITMENT_TOKEN],
            [" button-id-a1b2c3test", "button-id-", constants.ERROR_RECRUITMENT_TOKEN],
            ["button-id-a1b2c3test", " button-id-", constants.ERROR_RECRUITMENT_TOKEN],
        ]
    )("test for get_token, (%s, %s) -> %s", (
        input: string, prefix: string, exp: string) => {
        const a = new DiscordInteractionAnalyzer();
        expect(a.get_token(input, prefix)).toEqual(exp);
    });
});

describe("get_join_participate", () => {
    test.each([
        [1, 'token', 2, 'uid', 'desc', false],
        [1, 'token', 2, 'uid', 'desc', true],
    ])('test for get_join_participate, (%s, %s, %s, %s, %s, %s)', (
        id: number, token: string, status: number, user_id: string, description: string, deleted: boolean
    ) => {
        let analyzer = new DiscordInteractionAnalyzer();
        analyzer.set_id(id);
        analyzer.set_token(token);
        analyzer.status = status;
        analyzer.user_id = user_id;
        analyzer.description = description;
        analyzer.delete = deleted;

        const result = analyzer.get_join_participate();

        expect(result.id).toBe(id);
        expect(result.token).toBe(token);
        expect(result.status).toBe(status);
        expect(result.user_id).toBe(user_id);
        expect(result.description).toBe(description);
        expect(result.delete).toBe(deleted);
    });
});

describe("get_recruitment_date", () => {
    test.each([
        [0, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T00:00:00.000+09:00")],
        [24, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T00:00:00.000+09:00")],
        [11, 59, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-02T11:59:00.000+09:00")],
        [12, 0, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T12:00:00.000+09:00")],
        [12, 1, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T12:01:00.000+09:00")],
        [23, 59, new Date("2010-01-01T12:00:00.000+09:00"), new Date("2010-01-01T23:59:00.000+09:00")],
    ])("test for recruitment date test. %s:%s (%s -> %s)", (
        hour: number, minute: number, base_date: Date, exp: Date
    ) => {
        expect(DiscordInteractionAnalyzer.get_recruitment_date(hour, minute, base_date)).toEqual(exp);
    });

    test.each([
        [-1, 0, new Date("2010-01-01T12:00:00.000+09:00")],
        [25, 0, new Date("2010-01-01T12:00:00.000+09:00")],
        [0, -1, new Date("2010-01-01T12:00:00.000+09:00")],
        [0, 60, new Date("2010-01-01T12:00:00.000+09:00")],
    ])("test for recruitment date out of range test. %s:%s (%s)", (
        hour: number, minute: number, base_date: Date
    ) => {
        expect(DiscordInteractionAnalyzer.get_recruitment_date(hour, minute, base_date)).toEqual(undefined);
    });

    test.each([
        ["test 2048 1234 message", [], 20, 48],
        ["test 2048 1234 2345 message", ["2048", "1234"], 23, 45],
        ["test 2048 1234 message", ["2048"], 12, 34],
        ["test 2099 1234 message", ["2099"], 12, 34],
        ["test 1234 2099 message", ["2099"], 12, 34],
        ["test 1234 2099 message", [], 12, 34],
    ])('test for get time with expects. %s (ignore: %s) -> %s:%s', (input: string, ignore_list: string[], hour: number, minute: number) => {
        expect.assertions(3);
        let result = DiscordInteractionAnalyzer.get_recruitment_time(input, ignore_list);
        if (result) {
            expect(result.getHours()).toEqual(hour);
            expect(result.getMinutes()).toEqual(minute);
            expect(result.getSeconds()).toEqual(0);
        }
    });

    test.each([
        ["test 2061 1234 message", []],
        ["test 1234 2061 message", ["2061"]],
    ])('test for get time out of range. %s (ignore: %s) -> %s:%s', (input: string, ignore_list: string[]) => {
        expect(DiscordInteractionAnalyzer.get_recruitment_time(input, ignore_list)).toBeUndefined;
    });
});

describe("remove_full_wide_digits", () => {
    test.each([
        ["", ""],
        ["１２３４５６７８９０", "1234567890"],
        [" １２３４５６７８９０", " 1234567890"],
        ["１２３４５６７８９０ ", "1234567890 "],
        ["１a２b３c４d５e６f７g８h９i０", "1a2b3c4d5e6f7g8h9i0"],
        ["あいうえお１２３４５かきくけこ", "あいうえお12345かきくけこ"],
        ["1234567890", "1234567890"],
    ])('test for full-width character replace tests, %s -> %s', (input: string, expected: string) => {
        expect(DiscordInteractionAnalyzer.remove_full_wide_digits(input)).toEqual(expected)
    });
});