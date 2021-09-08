import { DiscordMessageAnalyzer } from '../logic/discord_message_analyzer';

test('test for times analyze', () => {
    let result = DiscordMessageAnalyzer.get_recruitment_date(0, 0);
    if (result) {
        expect(result.getHours()).toEqual(0);
        expect(result.getMinutes()).toEqual(0);
        expect(result.getSeconds()).toEqual(0);

        let now = new Date();
        if (now.getHours() > 0 && now.getMinutes() > 0) {
            now.setDate(now.getDate() + 1);

            expect(result.getFullYear()).toEqual(now.getFullYear());
            expect(result.getMonth()).toEqual(now.getMonth());
            expect(result.getDate()).toEqual(now.getDate());
        } else {
            expect(result.getFullYear()).toEqual(now.getFullYear());
            expect(result.getMonth()).toEqual(now.getMonth());
            expect(result.getDate()).toEqual(now.getDate());
        }
    }
});

test('test for times analyze', () => {
    let result = DiscordMessageAnalyzer.get_recruitment_date(23, 59);
    if (result) {
        expect(result.getHours()).toEqual(23);
        expect(result.getMinutes()).toEqual(59);
        expect(result.getSeconds()).toEqual(0);

        let now = new Date();
        if (now.getHours() > 23 && now.getMinutes() > 59) {
            now.setDate(now.getDate() + 1);

            expect(result.getFullYear()).toEqual(now.getFullYear());
            expect(result.getMonth()).toEqual(now.getMonth());
            expect(result.getDate()).toEqual(now.getDate());
        } else {
            expect(result.getFullYear()).toEqual(now.getFullYear());
            expect(result.getMonth()).toEqual(now.getMonth());
            expect(result.getDate()).toEqual(now.getDate());
        }
    }
});
