// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// define participate
import { Participate } from './participate';

// import sqlite utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class Recruitment {
    id: number;
    server_id: string;
    message_id: string;
    thread_id: string;
    token: string;
    status: number;
    limit_time: Date;
    name: string;
    owner_id: string;
    description: string;
    regist_time: Date;
    update_time: Date;
    delete: boolean;

    user_list: Participate[];

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.message_id = '';
        this.thread_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.regist_time = Constants.get_default_date();
        this.update_time = Constants.get_default_date();
        this.delete = false;

        // insert participate array
        this.user_list = [];
    }

    /**
     * convert database select data to instance
     * @param row m_recruitment table single row
     * @returns recruitment's instance, return blank instance if error occured
     */
    static parse_from_db(row: any): Recruitment {
        let v = new Recruitment();

        try {
            v.id = SqliteUtils.get_value(row.id);
            v.server_id = SqliteUtils.get_value(row.server_id);
            v.message_id = SqliteUtils.get_value(row.message_id);
            v.thread_id = SqliteUtils.get_value(row.thread_id);
            v.token = SqliteUtils.get_value(row.token);
            v.status = SqliteUtils.get_value(row.status);

            v.limit_time = SqliteUtils.get_date_value(row.limit_time);

            v.name = SqliteUtils.get_value(row.name);
            v.owner_id = SqliteUtils.get_value(row.owner_id);
            v.description = SqliteUtils.get_value(row.description);

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
            v = new Recruitment();
        }

        return v;
    }
}