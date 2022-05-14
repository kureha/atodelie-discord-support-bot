"use strict";
exports.__esModule = true;
exports.RoleInfo = exports.UserInfo = void 0;
// import constants
var constants_1 = require("../common/constants");
var logger_1 = require("../common/logger");
var constants = new constants_1.Constants();
var UserInfo = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function UserInfo() {
        this.id = constants.ID_INVALID;
        this.name = '';
        // role is blank
        this.roles = [];
    }
    /**
     * add role
     * @param role_info
     */
    UserInfo.prototype.add = function (role_info) {
        this.roles.push(role_info);
    };
    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    UserInfo.parse_from_discordjs = function (data) {
        var v = new UserInfo();
        try {
            v.id = data.user.id;
            v.name = data.user.username;
        }
        catch (e) {
            logger_1.logger.error(e);
            v = new UserInfo();
        }
        return v;
    };
    return UserInfo;
}());
exports.UserInfo = UserInfo;
var RoleInfo = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function RoleInfo() {
        this.id = constants.ID_INVALID;
        this.name = '';
    }
    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    RoleInfo.parse_from_discordjs = function (data) {
        var v = new RoleInfo();
        try {
            v.id = data.id;
            v.name = data.name;
        }
        catch (e) {
            logger_1.logger.error(e);
            v = new RoleInfo();
        }
        return v;
    };
    return RoleInfo;
}());
exports.RoleInfo = RoleInfo;
