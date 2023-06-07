// import constants
import { Constants } from '../common/constants';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class ServerInfo {
    server_id: string;
    channel_id: string;
    recruitment_target_role: string;
    follow_time: Date;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = Constants.get_default_date();
    }

    /**
     * convert database select data to instance
     * @param row m_server_info table single row
     * @returns server info instance, return blank instance if error occuered
     */
    static parse_from_db(row: any): ServerInfo {
        let v = new ServerInfo();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.channel_id = SqliteUtils.get_value(row.channel_id);
            v.recruitment_target_role = SqliteUtils.get_value(row.recruitment_target_role);
            // follow_time is nullable
            try {
                v.follow_time = new Date(row.follow_time);
            } catch (e) {
                v.follow_time = Constants.get_default_date();
            }
        } catch (e) {
            v = new ServerInfo();
        }

        return v;
    }
}