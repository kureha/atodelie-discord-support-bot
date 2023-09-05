"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleInfo = exports.UserInfo = void 0;
// import constants
const constants_1 = require("../common/constants");
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
        v.id = data.user.id;
        v.name = data.user.username;
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
        v.id = data.id;
        v.name = data.name;
        return v;
    }
    /**
     * Get role list from guild object
     * @param guild
     * @returns
     */
    static parse_list_from_discordjs(guild) {
        // return value define
        const role_list = [];
        // loop values
        guild.roles.cache.forEach((v) => {
            role_list.push(RoleInfo.parse_from_discordjs(v));
        });
        // return value
        return role_list;
    }
}
exports.RoleInfo = RoleInfo;
//# sourceMappingURL=user_info.js.map