// import constants
import { Constants } from '../common/constants';
import { logger } from '../common/logger';

// import discord modules
import * as Discord from 'discord.js';

export class UserInfo {
    id: string;
    name: string;

    roles: RoleInfo[];

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = Constants.STRING_EMPTY;
        this.name = Constants.STRING_EMPTY;
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
    static parse_from_discordjs(data: Discord.GuildMember): UserInfo {
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
    id: string;
    name: string;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.id = Constants.STRING_EMPTY;
        this.name = Constants.STRING_EMPTY;
    }

    /**
     * convert user info data to instance
     * @param data User from discord js
     * @returns user info instance, return blank instance if error occuered
     */
    static parse_from_discordjs(data: Discord.Role): RoleInfo {
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

    /**
     * Get role list from guild object
     * @param guild 
     * @returns 
     */
     static parse_list_from_discordjs(guild: Discord.Guild): RoleInfo[] {
        // return value define
        const role_list: RoleInfo[] = [];

        // loop values
        guild.roles.cache.forEach((v: Discord.Role) => {
            role_list.push(RoleInfo.parse_from_discordjs(v));
        });

        // return value
        return role_list;
    }
}