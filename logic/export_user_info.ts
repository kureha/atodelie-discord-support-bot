// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { UserInfo, RoleInfo } from '../entity/user_info';

// import fs module
import * as fs from "fs";
import { logger } from '../common/logger';

export class ExportUserInfo {
    /**
     * get user info list message
     * @param user_info_list
     * @param exceeded_limit is 1000 over?
     * @returns 
     */
    get_user_info_list(user_info_list: UserInfo[], output_file_path: string) {
        // output file buffer
        let output_buffer: string = '';

        // variables
        const split_char: string = constants.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR;
        const line_separator: string = "\r\n";
        const name_item_name: string = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME;
        const has_role_char: string = constants.DISCORD_EXPORT_USER_INFO_HAS_ROLE;
        const not_has_role_char: string = constants.DISCORD_EXPORT_USER_INFO_NO_ROLE;

        // create all role list from user info
        let role_info_list: RoleInfo[] = this.get_role_info_list(user_info_list);

        // create role info list
        let role_info_name_list: string[] = [];
        role_info_list.forEach((r) => {
            role_info_name_list.push(r.name);
        });

        // write header
        output_buffer = `${name_item_name}${split_char}${role_info_name_list.join(split_char)}${line_separator}`;

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
            output_buffer = `${output_buffer}${user_info.name}${split_char}${role_check_list.join(split_char)}${line_separator}`;
        });

        // write buffer to file
        logger.info(`write output buffer to file. : path = ${output_file_path}`);
        fs.writeFileSync(output_file_path, output_buffer);
        logger.info(`write output buffer complete.`);
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