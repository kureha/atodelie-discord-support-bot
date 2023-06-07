"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEntity = void 0;
const friend_code_1 = require("../../entity/friend_code");
const game_master_1 = require("../../entity/game_master");
const participate_1 = require("../../entity/participate");
const recruitment_1 = require("../../entity/recruitment");
const server_info_1 = require("../../entity/server_info");
const version_1 = require("../../entity/version");
const constants_1 = require("../../common/constants");
const user_info_1 = require("../../entity/user_info");
const constants = new constants_1.Constants();
class TestEntity {
    /**
     * Return recruitment object for test
     * @returns
     */
    static get_test_recruitment() {
        const test_rec = new recruitment_1.Recruitment();
        test_rec.id = 1;
        test_rec.server_id = "test_server_id";
        test_rec.message_id = "test_message_id";
        test_rec.token = "test_token";
        test_rec.status = 2;
        test_rec.limit_time = new Date("2099-12-31T11:59:59.000Z");
        test_rec.name = "my_name";
        test_rec.owner_id = "owenr_id";
        test_rec.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;
        return test_rec;
    }
    /**
     * Return participate object for test
     * @returns
     */
    static get_test_participate() {
        const test_par = new participate_1.Participate();
        test_par.id = 1;
        test_par.token = "test_token";
        test_par.status = 2;
        test_par.user_id = "test_user_id";
        test_par.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;
        return test_par;
    }
    /**
     * Return recruitment object for test
     * @returns
     */
    static get_test_server_info() {
        const test_svr = new server_info_1.ServerInfo();
        test_svr.server_id = "test_server_id";
        test_svr.channel_id = "test_channel_id";
        test_svr.recruitment_target_role = "test_role";
        test_svr.follow_time = new Date("2000-01-01T12:00:00.000Z");
        return test_svr;
    }
    /**
     * Return version object for test
     * @returns
     */
    static get_test_version() {
        const test_ver = new version_1.Version();
        test_ver.app_version = "1.1.1.1";
        test_ver.database_version = "2.2.2.2";
        return test_ver;
    }
    /**
     * Return friend code history object for test
     * @returns
     */
    static get_test_friend_code() {
        const test_frc_info = new friend_code_1.FriendCode();
        test_frc_info.server_id = "test_server_id";
        test_frc_info.user_id = "test_user_id";
        test_frc_info.user_name = "test_user_name";
        test_frc_info.game_id = "test_game_id";
        test_frc_info.game_name = "test_game_name";
        test_frc_info.friend_code = "test_friend_code";
        test_frc_info.regist_time = new Date("2099-02-03T01:02:03.000Z");
        test_frc_info.update_time = new Date("2099-12-31T11:59:59.000Z");
        test_frc_info.delete = false;
        return test_frc_info;
    }
    /**
     * Return game master info object for test
     * @returns
     */
    static get_test_game_master_info() {
        const test_gm_info = new game_master_1.GameMaster();
        test_gm_info.server_id = "test_server_id";
        test_gm_info.game_id = "test_game_id";
        test_gm_info.game_name = "test_game_name";
        test_gm_info.regist_time = new Date("2099-02-03T01:02:03.000Z");
        test_gm_info.update_time = new Date("2099-12-31T11:59:59.000Z");
        test_gm_info.delete = false;
        return test_gm_info;
    }
    /**
     * Return user info object for test
     * @returns
     */
    static get_test_user_info(user_idx, role_limit) {
        const test_user_info = new user_info_1.UserInfo();
        test_user_info.id = `test_user_id_${user_idx}`;
        test_user_info.name = `test_user_name_${user_idx}`;
        // add roles
        for (let i = 1; i <= role_limit; i++) {
            let role_info = new user_info_1.RoleInfo();
            role_info.id = `test_role_id_${i}`;
            role_info.name = `test_role_name_${i}`;
            test_user_info.add(role_info);
        }
        return test_user_info;
    }
    /**
     * Return role info for test
     * @param role_limit
     */
    static get_test_role_info(role_limit) {
        const role_list = [];
        // create roles
        for (let i = 1; i <= role_limit; i++) {
            let role_info = new user_info_1.RoleInfo();
            role_info.id = `test_role_id_${i}`;
            role_info.name = `test_role_name_${i}`;
            role_list.push(role_info);
        }
        return role_list;
    }
}
exports.TestEntity = TestEntity;
//# sourceMappingURL=test_entity.js.map