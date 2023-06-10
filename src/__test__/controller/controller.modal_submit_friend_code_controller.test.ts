import { TestDiscordMock } from "../common/test_discord_mock";

import { ModalSubmitFriendCodeController } from '../../controller/modal_submit_friend_code_controller';

import { TestEntity } from '../common/test_entity';
import { FriendCodeRepository } from '../../db/friend_code';
import { FriendCode } from '../../entity/friend_code';
import { FriendCodeHistoryRepository } from '../../db/friend_code_history';
import { DiscordCommon } from "../../logic/discord_common";

const controller = new ModalSubmitFriendCodeController();

describe('regist', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    test.each([
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            true, false, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            false, true, true
        ],
        [
            "DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE-test_custom_id", "test_server_id", "test_user_id", "test_input_friend_code",
            false, false, false
        ],
    ])("test for regist insert (%s, %s, %s, %s, %s, %s) -> %s", async (
        custom_id: any, guild_id: any, user_id: any, input_value: any,
        can_get_friend_code: boolean, is_insert_successed: boolean, expected: boolean,
    ) => {
        // get mock
        const Mock = TestDiscordMock.modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value);
        const interaction = new Mock();

        // set extra mock
        jest.spyOn(FriendCodeRepository.prototype, 'get_t_friend_code')
            .mockImplementationOnce(async () => { return [TestEntity.get_test_friend_code()] });

        if (can_get_friend_code) {
            jest.spyOn(FriendCode, 'search')
                .mockImplementationOnce(() => { return TestEntity.get_test_friend_code() });
        } else {
            jest.spyOn(FriendCode, 'search')
                .mockImplementationOnce(() => { throw `exception!` });
        }

        if (is_insert_successed) {
            jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(async () => { return 1; });
            jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code')
                .mockImplementationOnce(async () => { return 0; });
        } else {
            jest.spyOn(FriendCodeRepository.prototype, 'insert_t_friend_code')
                .mockImplementationOnce(async () => { return 0; });
            jest.spyOn(FriendCodeRepository.prototype, 'update_t_friend_code')
                .mockImplementationOnce(async () => { return 1; });
        }

        jest.spyOn(FriendCodeHistoryRepository.prototype, 'insert_t_friend_code')
            .mockImplementationOnce(async () => { return 1; });

        // set discord common mock
        jest.spyOn(DiscordCommon, 'get_game_master_from_guild')
            .mockImplementationOnce(() => { return [TestEntity.get_test_game_master_info()]; });
        jest.spyOn(DiscordCommon, 'get_game_master_from_list')
            .mockImplementationOnce(() => { return TestEntity.get_test_game_master_info(); });

        // expect
        let result = await controller.regist(interaction);
        expect(result).toEqual(expected);
    });
});