"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_interaction_recruitment_controller_1 = require("../../controller/button_interaction_recruitment_controller");
// setup for mock
const test_discord_mock_1 = require("../common/test_discord_mock");
const recruitement_1 = require("../../db/recruitement");
const participate_1 = require("../../db/participate");
const constants_1 = require("../../common/constants");
const constants = new constants_1.Constants;
const test_entity_1 = require("../common/test_entity");
const server_info_1 = require("../../db/server_info");
const fs = __importStar(require("fs"));
const sqlite_file = './.data/controller.recruitment.test.sqlite';
// copy test file for test
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // delete file if exists
    if (fs.existsSync(sqlite_file)) {
        fs.rmSync(sqlite_file);
    }
    // copy file
    fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, sqlite_file);
    // setup server info
    const repo_server_info = new server_info_1.ServerInfoRepository(sqlite_file);
    yield repo_server_info.insert_m_server_info(test_entity_1.TestEntity.get_test_server_info());
}));
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
    ])('recruitment interaction error test. ((%s, %s, %s) -> %s)', (custom_id, guild_id, user_id, error_message) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // expect
        expect.assertions(1);
        try {
            yield button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        }
        catch (e) {
            expect(e).toContain(error_message);
        }
    }));
    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment insert test. ((%s, %s, %s) -> participate status = %s)', (customId, guildId, userId, expected_status) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(customId, guildId, userId);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        const test_par_another = test_entity_1.TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";
        // insert to database
        const repo_recruitment = new recruitement_1.RecruitmentRepository(sqlite_file);
        const repo_participate = new participate_1.ParticipateRepository(sqlite_file);
        let cnt = yield repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = yield repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);
        // update recruitment
        let result = yield button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);
        // check recruitment
        let participate_list = yield repo_participate.get_t_participate(test_rec.token);
        // expected participate
        const test_par_expect = test_entity_1.TestEntity.get_test_participate();
        test_par_expect.status = expected_status;
        // expect
        expect(participate_list.length).toEqual(2);
        expect(participate_list).toContainEqual(test_par_expect);
        expect(participate_list).toContainEqual(test_par_another);
    }));
    test.each([
        ["join-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_ENABLED],
        ["view-recruite-token=test_token", "test_server_id", "test_user_id", constants.STATUS_VIEW],
    ])('button interaction recruitment update test. ((%s, %s, %s) -> participate status = %s)', (custom_id, guild_id, user_id, expected_status) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        const test_par = test_entity_1.TestEntity.get_test_participate();
        const test_par_another = test_entity_1.TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";
        // insert to database
        const repo_recruitment = new recruitement_1.RecruitmentRepository(sqlite_file);
        const repo_participate = new participate_1.ParticipateRepository(sqlite_file);
        let cnt = yield repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = yield repo_participate.insert_t_participate(test_par);
        expect(cnt).toEqual(1);
        cnt = yield repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);
        // update recruitment
        let result = yield button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);
        // check recruitment
        let participate_list = yield repo_participate.get_t_participate(test_rec.token);
        // expected participate
        const test_par_expect = test_entity_1.TestEntity.get_test_participate();
        test_par_expect.status = expected_status;
        // expect
        expect(participate_list.length).toEqual(2);
        expect(participate_list).toContainEqual(test_par_expect);
        expect(participate_list).toContainEqual(test_par_another);
    }));
    test.each([
        ["decline-recruite-token=test_token", "test_server_id", "test_user_id"],
    ])('button interaction recruitment delete test. ((%s, %s, %s) -> participate status = %s)', (custom_id, guild_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock(custom_id, guild_id, user_id);
        const interaction = new Mock();
        // setup test entityes
        const test_rec = test_entity_1.TestEntity.get_test_recruitment();
        const test_par = test_entity_1.TestEntity.get_test_participate();
        const test_par_another = test_entity_1.TestEntity.get_test_participate();
        test_par_another.user_id = "test_user_id_another";
        // insert to database
        const repo_recruitment = new recruitement_1.RecruitmentRepository(sqlite_file);
        const repo_participate = new participate_1.ParticipateRepository(sqlite_file);
        let cnt = yield repo_recruitment.insert_m_recruitment(test_rec);
        expect(cnt).toEqual(1);
        cnt = yield repo_participate.insert_t_participate(test_par);
        expect(cnt).toEqual(1);
        cnt = yield repo_participate.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);
        // update recruitment
        let result = yield button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController.recruitment_interaction(interaction, sqlite_file);
        expect(result).toEqual(true);
        // check recruitment
        let participate_list = yield repo_participate.get_t_participate(test_rec.token);
        expect(participate_list.length).toEqual(1);
        expect(participate_list).toContainEqual(test_par_another);
    }));
});
//# sourceMappingURL=controller.button_interaction_recruitment_controller.test.js.map