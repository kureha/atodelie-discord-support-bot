import { ButtonInteractionRecruitmentController } from "../../controller/button_interaction_recruitment_controller";

// setup for mock
import { TestDiscordMock } from "../common/test_discord_mock";

import { RecruitmentRepository } from "../../db/recruitement";
import { ParticipateRepository } from "../../db/participate";
import { Participate } from "../../entity/participate";
import { Constants } from "../../common/constants";
const constants = new Constants;

import { TestEntity } from "../common/test_entity";
import { ServerInfoRepository } from "../../db/server_info";

import * as fs from 'fs';
const sqlite_file: string = './.data/controller.recruitment.test.sqlite';

// copy test file for test
beforeEach(async () => {
    // delete file if exists
    if (fs.existsSync(sqlite_file)) {
        fs.rmSync(sqlite_file);
    }

    // copy file
    fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, sqlite_file);

    // setup server info
    const repo_server_info = new ServerInfoRepository(sqlite_file);
    await repo_server_info.insert_m_server_info(TestEntity.get_test_server_info());

});

// delete test file alter all
afterAll(() => {
    // delete file if exists
    if (fs.existsSync(sqlite_file)) {
        fs.rmSync(sqlite_file);
    }
});

describe('button interaction recruitment controllertest.', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    
    test.each([
        ["error_custom_id", "test_server_id", "test_user_id", "button interaction recruitment error."],
        ["join-recruite-token=test_token", undefined, "test_user_id", "interaction's guild id is undefined."],
        ["join-recruite-token=test_token_not_found", "test_server_id", "test_user_id", "target m_recruitment is not found."],
    ])('recruitment interaction error test. ((%s, %s, %s) -> %s)', async (custom_id: any, guild_id: any, user_id: any, error_message: string) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // expect
        expect.assertions(1);
        try {
            await ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        } catch (e) {
            expect(e).toContain(error_message);
        }
    });

    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment insert test. ((%s, %s, %s) -> participate status = %s)', async (customId: any, guildId: any, userId: any, expected_status: number) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(customId, guildId, userId);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();
        const test_par_another = TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";

        // insert to database
        const repo_recruitment = new RecruitmentRepository(sqlite_file);
        const repo_participate = new ParticipateRepository(sqlite_file);
        let cnt = await repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = await repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);

        // update recruitment
        let result = await ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);

        // check recruitment
        let participate_list: Participate[] = await repo_participate.get_t_participate(test_rec.token);

        // expected participate
        const test_par_expect = TestEntity.get_test_participate();
        test_par_expect.status = expected_status;

        // expect
        expect(participate_list.length).toEqual(2);
        expect(participate_list).toContainEqual(test_par_expect);
        expect(participate_list).toContainEqual(test_par_another);
    });

    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment update test. ((%s, %s, %s) -> participate status = %s)', async (custom_id: any, guild_id: any, user_id: any, expected_status: number) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();
        const test_par = TestEntity.get_test_participate();
        const test_par_another = TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";

        // insert to database
        const repo_recruitment = new RecruitmentRepository(sqlite_file);
        const repo_participate = new ParticipateRepository(sqlite_file);
        let cnt = await repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = await repo_participate.insert_t_participate(test_par);
        expect(cnt).toEqual(1);
        cnt = await repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);

        // update recruitment
        let result = await ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);

        // check recruitment
        let participate_list: Participate[] = await repo_participate.get_t_participate(test_rec.token);

        // expected participate
        const test_par_expect = TestEntity.get_test_participate();
        test_par_expect.status = expected_status;

        // expect
        expect(participate_list.length).toEqual(2);
        expect(participate_list).toContainEqual(test_par_expect);
        expect(participate_list).toContainEqual(test_par_another);
    });


    test.each([
        ["decline-recruite-token=test_token", "test_server_id", "test_user_id"],
    ])('button interaction recruitment delete test. ((%s, %s, %s) -> participate status = %s)', async (custom_id: any, guild_id: any, user_id: any) => {
        // get mock
        const Mock = TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();

        // setup test entityes
        const test_rec = TestEntity.get_test_recruitment();
        const test_par = TestEntity.get_test_participate();
        const test_par_another = TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";

        // insert to database
        const repo_recruitment = new RecruitmentRepository(sqlite_file);
        const repo_participate = new ParticipateRepository(sqlite_file);
        let cnt = await repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = await repo_participate.insert_t_participate(test_par);
        expect(cnt).toEqual(1);
        cnt = await repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);

        // update recruitment
        let result = await ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);

        // check recruitment
        let participate_list: Participate[] = await repo_participate.get_t_participate(test_rec.token);
        expect(participate_list.length).toEqual(1);
        expect(participate_list).toContainEqual(test_par_another);
    });
});