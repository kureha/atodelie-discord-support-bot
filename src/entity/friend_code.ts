// import constants
import { Constants } from '../common/constants';

// import logger
import { logger } from '../common/logger';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

/**
 * Game friend code class
 */
export class FriendCode {
    server_id: string;
    user_id: string;
    user_name: string;
    game_id: string;
    game_name: string;
    friend_code: string;
    regist_time: Date;
    update_time: Date;
    delete: boolean;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.server_id = Constants.STRING_EMPTY;
        this.user_id = Constants.STRING_EMPTY;
        this.user_name = Constants.STRING_EMPTY;
        this.game_id = Constants.STRING_EMPTY;
        this.game_name = Constants.STRING_EMPTY;
        this.friend_code = Constants.STRING_EMPTY;
        this.regist_time = Constants.get_default_date();
        this.update_time = Constants.get_default_date();
        this.delete = false;
    }

    /**
     * convert database select data to instance
     * @param row t_friend_code table single row
     * @returns friend_code's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): FriendCode {
        let v = new FriendCode();

        try {
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.user_id = SqliteUtils.get_value(row.user_id);
            v.user_name = SqliteUtils.get_value(row.user_name);
            v.game_id = SqliteUtils.get_value(row.game_id);
            v.game_name = SqliteUtils.get_value(row.game_name);
            v.friend_code = SqliteUtils.get_value(row.friend_code);
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
            v = new FriendCode();
        }

        return v;
    }

    /**
     * get friend code from list by game id.
     * if not found, throw error.
     * @param friend_code_list 
     * @param game_id 
     * @returns 
     */
    static search(friend_code_list: FriendCode[], game_id: string): FriendCode {
        let friend_code: FriendCode = new FriendCode();

        // value use for exists or not exists
        const idx_friend_code_not_found: number = -1;
        let idx_friend_code_found: number = idx_friend_code_not_found;

        // search db result list and set
        friend_code_list.forEach((fc: FriendCode, idx: number) => {
            if (fc.game_id == game_id) {
                logger.info(`data found. server_id = ${fc.server_id}, user_id = ${fc.user_id}, game_id = ${fc.game_id}, friend_code = ${fc.friend_code}`);
                friend_code = fc;
                // input founded idx
                idx_friend_code_found = idx;
            }
        });

        // check friend code is exists?
        if (idx_friend_code_found == idx_friend_code_not_found) {
            throw new Error(`data not found from list. game_id = ${game_id}`);
        }

        // return value
        return friend_code;
    }
}