"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_suggest_recruitment_coontroller_1 = require("../../controller/message_suggest_recruitment_coontroller");
describe('is_contain_timestring', () => {
    test.each([
        ["test for 11:11 start", true],
        ["test for 1234 start", true],
        ["test for a1234b start", true],
        ["test for 123 start", false],
        ["test for 00:00 start", true],
        ["test for 23:59 start", true],
        ["test for 24:00 start", false],
        ["test for 23:61 start", false],
    ])('test for is_contain_timestring, %s -> %s', (input, expected) => {
        const util = new message_suggest_recruitment_coontroller_1.MessageSuggestRecruitmentController();
        expect(expected).toEqual(util.is_contain_timestring(input));
    });
});
//# sourceMappingURL=controller.message_suggest_recruitment_controller.test.js.map