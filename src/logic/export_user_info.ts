// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { UserInfo, RoleInfo } from '../entity/user_info';

// import fs module
import * as fs from "fs";

// import logger
import { logger } from '../common/logger';

// import discord modules
import * as Discord from 'discord.js';

export class ExportUserInfo {

    /**
     * parse user info list from discord returned values
     * @param member_info_list Discord's GuildMember Collection (Map) object
     * @returns UserInfo[] parsed object
     */
    parse_user_info(member_info_list: Discord.Collection<string, Discord.GuildMember>): UserInfo[] {
        // result
        let user_info_list: UserInfo[] = [];

        // loop member list
        member_info_list.forEach((user_info: Discord.GuildMember, user_id: string) => {
            // create user info temp valiable
            const user_info_temp: UserInfo = UserInfo.parse_from_discordjs(user_info);

            // loop role list
            user_info.roles.cache.forEach((role_info: Discord.Role, role_id: string) => {
                const role_info_temp: RoleInfo = RoleInfo.parse_from_discordjs(role_info);

                // add role info to result list
                user_info_temp.add(role_info_temp);
            });

            // add user info to result list
            user_info_list.push(user_info_temp);
        });

        // return result
        return user_info_list;
    }

    /**
     * create export user info string
     * @param user_info_list
     * @returns 
     */
    get_output_string(user_info_list: UserInfo[]): string {
        // output file buffer
        let output_buffer: string = '';

        // variables
        const split_char: string = this.parse_escaped_characters(constants.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR);
        const line_separator: string = this.parse_escaped_characters(constants.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR);
        const name_item_name: string = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME;
        const name_item_id: string = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_ID;
        const has_role_char: string = constants.DISCORD_EXPORT_USER_INFO_HAS_ROLE;
        const not_has_role_char: string = constants.DISCORD_EXPORT_USER_INFO_NO_ROLE;

        // create all role list from user info
        const role_info_list: RoleInfo[] = this.get_role_info_list(user_info_list);

        // create role info list
        const output_role_info_list: string[] = [];
        role_info_list.forEach((r) => {
            output_role_info_list.push(`${r.name}(${r.id})`);
        });

        // write header
        const header_string: string = `${name_item_name}${split_char}${name_item_id}${split_char}${output_role_info_list.join(split_char)}${line_separator}`;

        // create strings
        output_buffer = header_string + this.get_output_body_string(user_info_list, role_info_list, split_char, line_separator, has_role_char, not_has_role_char);
        return output_buffer;
    }

    /**
     * output export info to file path
     * @param export_file_path 
     * @param output_buffer 
     */
    export_to_file(export_file_path: string, output_buffer: string) {
        // write buffer to file
        logger.info(`write output buffer to file. : path = ${export_file_path}`);
        fs.writeFileSync(export_file_path, output_buffer);
        logger.info(`write output buffer complete.`);
    }

    /**
     * get non-escaped characters for \t \r \n
     * @param v escapec characters like \\t \\r \\n
     * @returns non-escaped characters
     */
    parse_escaped_characters(v: string): string {
        let r = v;

        // for tab
        let regex: RegExp = /\\t/i
        r = r.replace(regex, "\t");

        // for r
        regex = /\\r/i
        r = r.replace(regex, "\r");

        // for n
        regex = /\\n/i
        r = r.replace(regex, "\n");

        return r;
    }

    /**
     * get output string
     * @param user_info_list user info list
     * @param role_info_list role info list
     * @param split_char split char no needs escaped
     * @param line_separator line separator char which like \r\n
     * @param has_role_char output character who has role
     * @param not_has_role_char output character who has not role
     * @returns output string body
     */
    get_output_body_string(user_info_list: UserInfo[], role_info_list: RoleInfo[], split_char: string, line_separator: string, has_role_char: string, not_has_role_char: string): string {
        // output buffer
        let output_buffer: string = '';

        // create strings
        user_info_list.forEach((user_info: UserInfo) => {
            // let role list
            let role_check_list: string[] = [];

            // write role lists
            role_info_list.forEach((role_info: RoleInfo) => {
                // check role existance
                const exist_check: boolean = user_info.roles.some((r: RoleInfo) => {
                    return r.id === role_info.id;
                });
                if (exist_check == true) {
                    // role exists -> set character
                    role_check_list.push(has_role_char);
                } else {
                    // role not exists -> set blank
                    role_check_list.push(not_has_role_char);
                }
            });

            // write end of line
            output_buffer = `${output_buffer}${user_info.name}${split_char}${user_info.id}${split_char}${role_check_list.join(split_char)}${line_separator}`;
        });

        return output_buffer;
    }

    /**
     * get role info list from user info list
     * @returns 
     */
    get_role_info_list(user_info_list: UserInfo[]): RoleInfo[] {
        let role_info_list: RoleInfo[] = [];

        // build user info list
        user_info_list.forEach((user_info: UserInfo) => {
            user_info.roles.forEach((role_info: RoleInfo) => {
                // check exists
                const exist_check: boolean = role_info_list.some((r: RoleInfo) => {
                    return r.id === role_info.id;
                });

                // if not exists, add to list
                if (exist_check == false && role_info.name != "@everyone") {
                    role_info_list.push(role_info);
                }
            });
        });

        // return result
        return role_info_list;
    }
}