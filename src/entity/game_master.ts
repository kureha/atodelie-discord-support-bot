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
    presence_name: string;
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
        this.presence_name = Constants.STRING_EMPTY;
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
            v.presence_name = SqliteUtils.get_value(row.presence_name);

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
            v = new GameMaster();
        }

        return v;
    }
}