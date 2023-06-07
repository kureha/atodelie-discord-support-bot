"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleInfo = exports.UserInfo = void 0;
// import constants
const constants_1 = require("../common/constants");
const logger_1 = require("../common/logger");
class UserInfo {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants_1.Constants.STRING_EMPTY;
        this.name = constants_1.Constants.STRING_EMPTY;
        // role is blank
        this.roles = [];
    }
    /**
     * add role
     * @param role_info
     */
    add(role_info) {
        this.roles.push(role_info);
    }
    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    static parse_from_discordjs(data) {
        let v = new UserInfo();
        try {
            v.id = data.user.id;
            v.name = data.user.username;
        }
        catch (e) {
            logger_1.logger.error(e);
            v = new UserInfo();
        }
        return v;
    }
}
exports.UserInfo = UserInfo;
class RoleInfo {
    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants_1.Constants.STRING_EMPTY;
        this.name = constants_1.Constants.STRING_EMPTY;
    }
    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    static parse_from_discordjs(data) {
        let v = new RoleInfo();
        try {
            v.id = data.id;
            v.name = data.name;
        }
        catch (e) {
            logger_1.logger.error(e);
            v = new RoleInfo();
        }
        return v;
    }
}
exports.RoleInfo = RoleInfo;
//# sourceMappingURL=user_info.js.map