import { ButtonInteractionController } from "../../controller/button_interaction_controller";

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import discord modules
import * as Discord from 'discord.js';
import { ButtonInteractionRecruitmentController } from "../../controller/button_interaction_recruitment_controller";

describe("recieve test.", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [true], [false]
    ])("recieve test", (cmd_check_result: boolean) => {
        // setup mocks
        jest.spyOn(ButtonInteractionController, 'check_recruitment_interaction').mockImplementationOnce(() => {
            return cmd_check_result;
        });
        jest.spyOn(ButtonInteractionRecruitmentController.prototype, 'recruitment_interaction').mockImplementationOnce(() => {
            return new Promise<boolean>((resolve, reject) => {
                resolve(true);
            });
        });
        const interaction_mock = {
            customId: "test_id",
            reply: (): void => { },
        };

        ButtonInteractionController.recieve(interaction_mock as unknown as Discord.ButtonInteraction);
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
    ])("test for check recruitment interaction, %s -> %s", (custom_id: string, exp: boolean) => {
        expect(ButtonInteractionController.check_recruitment_interaction(custom_id)).toBe(exp);
    });
});
