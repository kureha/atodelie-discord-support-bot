"use strict";
exports.__esModule = true;
exports.Participate = void 0;
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
var Participate = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function Participate() {
        this.id = constants.ID_INVALID;
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.user_id = '';
        this.description = '';
        this["delete"] = false;
    }
    /**
     * convert database select data to instance
     * @param row t_participate table single row
     * @returns participate instance, return blank instance if error occuered
     */
    Participate.parse_from_db = function (row) {
        var v = new Participate();
        try {
            v.id = row.id;
            v.token = row.token;
            v.status = row.status;
            v.user_id = row.user_id;
            v.description = row.description;
            v["delete"] = row["delete"];
        }
        catch (e) {
            // if error, re-create new instance
            v = new Participate();
        }
        return v;
    };
    return Participate;
}());
exports.Participate = Participate;
