"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const button_interaction_controller_1 = require("../../controller/button_interaction_controller");
// import constants
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants();
const button_interaction_recruitment_controller_1 = require("../../controller/button_interaction_recruitment_controller");
describe("recieve test.", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    test.each([
        [true], [false]
    ])("recieve test", (cmd_check_result) => {
        // setup mocks
        jest.spyOn(button_interaction_controller_1.ButtonInteractionController, 'check_recruitment_interaction').mockImplementationOnce(() => {
            return cmd_check_result;
        });
        jest.spyOn(button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController, 'recruitment_interaction').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        });
        const interaction_mock = {
            customId: "test_id",
            reply: () => { },
        };
        button_interaction_controller_1.ButtonInteractionController.recieve(interaction_mock);
    });
});
describe("check_recruitment_interaction test.", () => {
    test.each([
        [`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}`, true],
        [`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}-test_token`, true],
        [`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`, true],
        [`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}-test_token`, true],
        [`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}`, true],
        [`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}-test_token`, true],
        [` ${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}`, false],
        [` ${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}-test_token`, false],
        [` ${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`, false],
        [` ${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}-test_token`, false],
        [` ${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}`, false],
        [` ${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}-test_token`, false],
        [`invalid`, false],
        [``, false],
    ])("test for check recruitment interaction, %s -> %s", (custom_id, exp) => {
        expect(button_interaction_controller_1.ButtonInteractionController.check_recruitment_interaction(custom_id)).toBe(exp);
    });
});
//# sourceMappingURL=controller.button_interaction_controller.test.js.map