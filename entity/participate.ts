// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

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
     * @returns participate instance, return blank instance if error occuered
     */
    static parse_from_db(row: any): Participate {
        let v = new Participate();

        try {
            v.id = row.id;
            v.token = row.token;
            v.status = row.status;
            v.user_id = row.user_id;
            v.description = row.description;
            v.delete = row.delete;
        } catch (e) {
            // if error, re-create new instance
            v = new Participate();
        }

        return v;
    }
}