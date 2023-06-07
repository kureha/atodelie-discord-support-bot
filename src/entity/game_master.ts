// import constants
import { Constants } from '../common/constants';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

/**
 * Game info class
 */
export class GameMaster {
    server_id: string;
    game_id: string;
    game_name: string;
    regist_time: Date;
    update_time: Date;
    delete: boolean;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = Constants.STRING_EMPTY;
        this.game_id = Constants.STRING_EMPTY;
        this.game_name = Constants.STRING_EMPTY;
        this.regist_time = Constants.get_default_date();
        this.update_time = Constants.get_default_date();
        this.delete = false;
    }

    /**
     * convert database select data to instance
     * @param row m_game_master table single row
     * @returns game_master's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): GameMaster {
        let v = new GameMaster();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.game_id = SqliteUtils.get_value(row.game_id);
            v.game_name = SqliteUtils.get_value(row.game_name);
            // regist_time, update_time is nullable
            try {
                v.regist_time = new Date(row.regist_time);
            } catch (e) {
                v.regist_time = Constants.get_default_date();
            }
            try {
                v.update_time = new Date(row.update_time);
            } catch (e) {
                v.update_time = Constants.get_default_date();
            }
            // db delete is number, change boolean
            if (row.delete == true) {
                v.delete = true;
            } else {
                v.delete = false;
            }
        } catch (e) {
            // if error, re-create new instance
            v = new GameMaster();
        }

        return v;
    }
}