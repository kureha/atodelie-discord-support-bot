// import constants
import { Constants } from '../common/constants';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

/**
 * Activity class
 */
export class AnnouncementHistory {
    server_id: string;
    channel_id: string;
    game_name: string;
    announcement_time: Date;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = Constants.STRING_EMPTY;
        this.channel_id = Constants.STRING_EMPTY;
        this.game_name = Constants.STRING_EMPTY;
        this.announcement_time = Constants.get_default_date();
    }

    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): AnnouncementHistory {
        let v = new AnnouncementHistory();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.channel_id = SqliteUtils.get_value(row.channel_id);
            v.game_name = SqliteUtils.get_value(row.game_name);

            v.announcement_time = SqliteUtils.get_date_value(row.announcement_time);
            
        } catch (e) {
            // if error, re-create new instance
            v = new AnnouncementHistory();
        }

        return v;
    }
}