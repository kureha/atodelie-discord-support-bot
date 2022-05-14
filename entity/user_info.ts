// import constants
import { Constants } from '../common/constants';
import { logger } from '../common/logger';
const constants = new Constants();

export class UserInfo {
    id: number;
    name: string;

    roles: RoleInfo[];

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.name = '';
        // role is blank
        this.roles = [];
    }

    /**
     * add role
     * @param role_info 
     */
    add(role_info: RoleInfo) {
        this.roles.push(role_info);
    }

    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    static parse_from_discordjs(data: any): UserInfo {
        let v = new UserInfo();

        try {
            v.id = data.user.id;
            v.name = data.user.username;
        } catch (e) {
            logger.error(e);
            v = new UserInfo();
        }

        return v;
    }
}

export class RoleInfo {
    id: number;
    name: string;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.name = '';
    }


    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    static parse_from_discordjs(data: any): RoleInfo {
        let v = new RoleInfo();

        try {
            v.id = data.id;
            v.name = data.name;
        } catch (e) {
            logger.error(e);
            v = new RoleInfo();
        }

        return v;
    }
}