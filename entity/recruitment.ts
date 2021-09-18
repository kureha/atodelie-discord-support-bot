// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// define participate
import { Participate } from './participate';

export class Recruitment {
    id: number;
    server_id: string;
    message_id: string;
    thread_id: string;
    token: string;
    status: number;
    name: string;
    owner_id: string;
    description: string;
    delete: boolean;
    limit_time: Date;

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
            v.id = row.id;
            v.server_id = row.server_id;
            v.message_id = row.message_id;
            v.thread_id = row.thread_id;
            v.token = row.token;
            v.status = row.status;
            // limit_time is nullable
            try {
                v.limit_time = new Date(row.limit_time);
            } catch (e) {
                v.limit_time = Constants.get_default_date();
            }
            v.name = row.name;
            v.owner_id = row.owner_id;
            v.description = row.description;
            v.delete = row.delete;
        } catch (e) {
            // if error, re-create new instance
            v = new Recruitment();
        }

        return v;
    }
}