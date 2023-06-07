// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class Participate {
    id: number;
    token: string;
    status: number;
    user_id: string;
    description: string;
    delete: boolean;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.user_id = '';
        this.description = '';
        this.delete = false;
    }

    /**
     * convert database select data to instance
     * @param row t_participate table single row
     * @param token token because participate table has not token column
     * @returns participate instance, return blank instance if error occuered
     */
    static parse_from_db(row: any, token: string): Participate {
        let v = new Participate();

        try {
            v.id = SqliteUtils.get_value(row.id);
            v.token = SqliteUtils.get_value(token);
            v.status = SqliteUtils.get_value(row.status);
            v.user_id = SqliteUtils.get_value(row.user_id);
            v.description = SqliteUtils.get_value(row.description);
            // db delete is number, change boolean
            if (row.delete == true) {
                v.delete = true;
            } else {
                v.delete = false;
            }
        } catch (e) {
            // if error, re-create new instance
            v = new Participate();
        }

        return v;
    }


}