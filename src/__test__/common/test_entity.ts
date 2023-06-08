import { FriendCode } from "../../entity/friend_code";
import { GameMaster } from "../../entity/game_master";
import { Participate } from "../../entity/participate";
import { Recruitment } from "../../entity/recruitment";
import { ServerInfo } from "../../entity/server_info";
import { Version } from "../../entity/version";

import { Constants } from "../../common/constants";
import { RoleInfo, UserInfo } from "../../entity/user_info";
import { ActivityHistory } from "../../entity/activity_history";
import { AnnouncementHistory } from "../../entity/announcement_history";
import { AnnouncementInfo } from "../../entity/announcement_info";
const constants = new Constants();

export class TestEntity {
    /**
     * Return recruitment object for test
     * @returns 
     */
    static get_test_recruitment(): Recruitment {
        const test_rec = new Recruitment();
        test_rec.id = 1;
        test_rec.server_id = "test_server_id";
        test_rec.message_id = "test_message_id";
        test_rec.token = "test_token";
        test_rec.status = 2;
        test_rec.limit_time = new Date("2099-12-31T11:59:59.000Z");
        test_rec.name = "my_name";
        test_rec.owner_id = "owenr_id"
        test_rec.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;

        return test_rec;
    }

    /**
     * Return participate object for test
     * @returns 
     */
    static get_test_participate(): Participate {
        const test_par = new Participate();
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
    static get_test_server_info(): ServerInfo {
        const test_svr = new ServerInfo();

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
    static get_test_version(): Version {
        const test_ver = new Version();

        test_ver.app_version = "1.1.1.1";
        test_ver.database_version = "2.2.2.2";

        return test_ver;
    }

    /**
     * Return friend code history object for test
     * @returns 
     */
    static get_test_friend_code(): FriendCode {
        const test_frc_info = new FriendCode();

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
    static get_test_game_master_info(): GameMaster {
        const test_gm_info = new GameMaster();

        test_gm_info.server_id = "test_server_id";
        test_gm_info.game_id = "test_game_id";
        test_gm_info.game_name = "test_game_name";
        test_gm_info.presence_name = "test_presence_name";
        test_gm_info.regist_time = new Date("2099-02-03T01:02:03.000Z");
        test_gm_info.update_time = new Date("2099-12-31T11:59:59.000Z");
        test_gm_info.delete = false;

        return test_gm_info;
    }

    /**
     * Return user info object for test
     * @returns 
     */
    static get_test_user_info(user_idx: number, role_limit: number): UserInfo {
        const test_user_info = new UserInfo();

        test_user_info.id = `test_user_id_${user_idx}`;
        test_user_info.name = `test_user_name_${user_idx}`;

        // add roles
        for (let i = 1; i <= role_limit; i++) {
            let role_info = new RoleInfo();
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
    static get_test_role_info(role_limit: number): RoleInfo[] {
        const role_list: RoleInfo[] = [];

        // create roles
        for (let i = 1; i <= role_limit; i++) {
            let role_info = new RoleInfo();
            role_info.id = `test_role_id_${i}`;
            role_info.name = `test_role_name_${i}`;
            role_list.push(role_info);
        }

        return role_list;
    }

    /**
     * Return activity for test
     * @param regist_change_timetime 
     * @returns 
     */
    static get_test_activity(change_time: Date): ActivityHistory {
        const v = new ActivityHistory();

        v.server_id = "test-server-id";
        v.channel_id = "test-channel-id";
        v.game_name = "test-game";
        v.member_count = 3;
        v.change_time = change_time;
        v.regist_time = new Date("2099-02-03T01:02:03.000Z");
        v.update_time = new Date("2099-02-03T01:02:03.000Z");
        v.delete = false;

        return v;
    }

    /**
     * Return announcement history for test
     * @param announcement_time 
     * @returns 
     */
    static get_test_announcement_history(announcement_time: Date): AnnouncementHistory {
        const v = new AnnouncementHistory();

        v.server_id = "test-server-id";
        v.channel_id = "test-channel-id";
        v.game_name = "test-game";
        v.announcement_time = announcement_time;

        return v;
    }

    /**
     * Return announcement info for test
     * @param announcement_time 
     * @returns 
     */
    static get_test_announcement_info(announcement_time: Date): AnnouncementInfo {
        const v = new AnnouncementInfo();

        v.server_id = "test-server-id";
        v.channel_id = "test-channel-id";
        v.game_name = "test-game";
        v.current_game_member_count = 1;
        v.max_total_member_count = 1;
        v.game_start_time = announcement_time;

        return v;
    }
}
