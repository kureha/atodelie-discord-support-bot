"use strict";
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
const test_entity_1 = require("../common/test_entity");
const server_info_1 = require("../../db/server_info");
const discord_interaction_analyzer_1 = require("../../logic/discord_interaction_analyzer");
const controller = new button_interaction_recruitment_controller_1.ButtonInteractionRecruitmentController();
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
    ])('test for recruitment_interaction, (%s, %s) -> %s', (get_rec_success, is_ins_success, expected) => __awaiter(void 0, void 0, void 0, function* () {
        // get mock
        const Mock = test_discord_mock_1.TestDiscordMock.button_interaction_mock('test-c-id', 'test-g-id', 'test-u-id');
        const interaction = new Mock();
        jest.spyOn(discord_interaction_analyzer_1.DiscordInteractionAnalyzer.prototype, 'analyze')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return new discord_interaction_analyzer_1.DiscordInteractionAnalyzer(); }));
        if (get_rec_success == true) {
            jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_recruitment(); }));
        }
        else {
            jest.spyOn(recruitement_1.RecruitmentRepository.prototype, 'get_m_recruitment')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        }
        if (is_ins_success == true) {
            jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
            jest.spyOn(participate_1.ParticipateRepository.prototype, 'update_t_participate')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
        }
        else {
            jest.spyOn(participate_1.ParticipateRepository.prototype, 'insert_t_participate')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { throw `exception!`; }));
            jest.spyOn(participate_1.ParticipateRepository.prototype, 'update_t_participate')
                .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return 1; }));
        }
        jest.spyOn(participate_1.ParticipateRepository.prototype, 'get_t_participate')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return [test_entity_1.TestEntity.get_test_participate()]; }));
        jest.spyOn(server_info_1.ServerInfoRepository.prototype, 'get_m_server_info')
            .mockImplementationOnce(() => __awaiter(void 0, void 0, void 0, function* () { return test_entity_1.TestEntity.get_test_server_info(); }));
        const result = yield controller.recruitment_interaction(interaction);
        expect(result).toEqual(expected);
    }));
    test.each([
        [true, true, false],
        [false, true, false],
        [true, false, false],
        [false, false, false],
    ])('test for recruitment_interaction for empty guild, (%s, %s) -> %s', (get_rec_success, is_ins_success, expected) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield controller.recruitment_interaction({ customId: 'tid', reply: () => __awaiter(void 0, void 0, void 0, function* () { return true; }) });
        expect(result).toEqual(expected);
    }));
});
//# sourceMappingURL=controller.button_interaction_recruitment_controller.test.js.map