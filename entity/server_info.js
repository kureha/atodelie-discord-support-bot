"use strict";
exports.__esModule = true;
exports.ServerInfo = void 0;
// import constants
var constants_1 = require("../common/constants");
var ServerInfo = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function ServerInfo() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = constants_1.Constants.get_default_date();
    }
    /**
     * convert database select data to instance
     * @param row m_server_info table single row
     * @returns server info instance, return blank instance if error occuered
     */
    ServerInfo.parse_from_db = function (row) {
        var v = new ServerInfo();
        try {
            v.server_id = row.server_id;
            v.channel_id = row.channel_id;
            v.recruitment_target_role = row.recruitment_target_role;
            // follow_time is nullable
            try {
                v.follow_time = new Date(row.follow_time);
            }
            catch (e) {
                v.follow_time = constants_1.Constants.get_default_date();
            }
        }
        catch (e) {
            v = new ServerInfo();
        }
        return v;
    };
    return ServerInfo;
}());
exports.ServerInfo = ServerInfo;
