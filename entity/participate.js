"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participate = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class Participate {
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
    static parse_from_db(row) {
        let v = new Participate();
        try {
            v.id = row.id;
            v.token = row.token;
            v.status = row.status;
            v.user_id = row.user_id;
            v.description = row.description;
            v.delete = row.delete;
        }
        catch (e) {
            // if error, re-create new instance
            v = new Participate();
        }
        return v;
    }
}
exports.Participate = Participate;
//# sourceMappingURL=participate.js.map