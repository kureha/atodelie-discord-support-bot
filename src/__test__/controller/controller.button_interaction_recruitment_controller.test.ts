import { ButtonInteractionRecruitmentController } from "../../controller/button_interaction_recruitment_controller";

// setup for mock
import { TestDiscordMock } from "../common/test_discord_mock";

import { RecruitmentRepository } from "../../db/recruitement";
import { ParticipateRepository } from "../../db/participate";

import { TestEntity } from "../common/test_entity";
import { ServerInfoRepository } from "../../db/server_info";
import { DiscordInteractionAnalyzer } from "../../logic/discord_interaction_analyzer";

// import discord modules
import * as Discord from 'discord.js';

const controller = new ButtonInteractionRecruitmentController();

describe('recruitment_interaction.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [true, true, true],
        [false, true, false],
        [true, false, true],
        [false, false, false],
    ])('test for recruitment_interaction, (%s, %s) -> %s', async (
        get_rec_success: boolean,
        is_ins_success: boolean,
        expected: boolean
    ) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();

        jest.spyOn(DiscordInteractionAnalyzer.prototype, 'analyze')
            .mockImplementationOnce(async () => { return new DiscordInteractionAnalyzer(); });

        if (get_rec_success == true) {
            jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment')
                .mockImplementationOnce(async () => { return TestEntity.get_test_recruitment(); });
        } else {
            jest.spyOn(RecruitmentRepository.prototype, 'get_m_recruitment')
                .mockImplementationOnce(async () => { throw `exception!` });
        }
        if (is_ins_success == true) {
            jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate')
                .mockImplementationOnce(async () => { return 1; });
            jest.spyOn(ParticipateRepository.prototype, 'update_t_participate')
                .mockImplementationOnce(async () => { throw `exception!` });
        } else {
            jest.spyOn(ParticipateRepository.prototype, 'insert_t_participate')
                .mockImplementationOnce(async () => { throw `exception!` });
            jest.spyOn(ParticipateRepository.prototype, 'update_t_participate')
                .mockImplementationOnce(async () => { return 1 });
        }
        jest.spyOn(ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(async () => { return [TestEntity.get_test_participate()]; });

        jest.spyOn(ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(async () => { return TestEntity.get_test_server_info(); });

        const result = await controller.recruitment_interaction(interaction);
        expect(result).toEqual(expected);
    });

    test.each([
        [true, true, false],
        [false, true, false],
        [true, false, false],
        [false, false, false],
    ])('test for recruitment_interaction for empty guild, (%s, %s) -> %s', async (
        get_rec_success: boolean,
        is_ins_success: boolean,
        expected: boolean
    ) => {
        const result = await controller.recruitment_interaction({ customId: 'tid', reply: async () => { return true; } } as unknown as Discord.ButtonInteraction);
        expect(result).toEqual(expected);
    });
});