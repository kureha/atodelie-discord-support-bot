// import constants
import { Constants } from '../common/constants';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

/**
 * Activity class
 */
export class ActivityHistory {
    server_id: string;
    channel_id: string;
    game_name: string;
    member_count: number;
    total_member_count: number;
    change_time: Date;
    regist_time: Date;
    update_time: Date;
    delete: boolean;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = Constants.STRING_EMPTY;
        this.channel_id = Constants.STRING_EMPTY;
        this.game_name = Constants.STRING_EMPTY;
        this.member_count = 0;
        this.total_member_count = 0;
        this.change_time = Constants.get_default_date();
        this.regist_time = Constants.get_default_date();
        this.update_time = Constants.get_default_date();
        this.delete = false;
    }

    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): ActivityHistory {
        let v = new ActivityHistory();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.channel_id = SqliteUtils.get_value(row.channel_id);
            v.game_name = SqliteUtils.get_value(row.game_name);
            v.member_count = SqliteUtils.get_value(row.member_count);
            v.total_member_count = SqliteUtils.get_value(row.total_member_count);

            v.change_time = SqliteUtils.get_date_value(row.change_time);
            v.regist_time = SqliteUtils.get_date_value(row.regist_time);
            v.update_time = SqliteUtils.get_date_value(row.update_time);
            
            // db delete is number, change boolean
            if (row.delete == true) {
                v.delete = true;
            } else {
                v.delete = false;
            }
        } catch (e) {
            // if error, re-create new instance
            v = new ActivityHistory();
        }

        return v;
    }
}