// import constants
import { Constants } from '../common/constants';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';
import { AnnouncementHistory } from './announcement_history';

/**
 * Announcement Information
 */
export class AnnouncementInfo {
    server_id: string;
    channel_id: string;
    current_game_member_count: number;
    max_total_member_count: number;
    game_name: string;
    game_start_time: Date;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.current_game_member_count = 0;
        this.max_total_member_count = 0;
        this.game_name = '';
        this.game_start_time = Constants.get_default_date();
    }

    /**
     * returns announcement history from this object
     * @returns 
     */
    to_history(): AnnouncementHistory {
        let v = new AnnouncementHistory();

        v.server_id = this.server_id;
        v.channel_id = this.channel_id;
        v.game_name = this.game_name;
        v.announcement_time = new Date();

        return v;
    }

    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): AnnouncementInfo {
        let v = new AnnouncementInfo();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.channel_id = SqliteUtils.get_value(row.channel_id);
            v.current_game_member_count = SqliteUtils.get_value(row.current_game_member_count);
            v.max_total_member_count = SqliteUtils.get_value(row.max_total_member_count);
            v.game_name = SqliteUtils.get_value(row.game_name);
            try {
                v.game_start_time = new Date(row.game_start_time);
            } catch (e) {
                v.game_start_time = Constants.get_default_date();
            }
        } catch (e) {
            // if error, re-create new instance
            v = new AnnouncementInfo();
        }

        return v;
    }
}