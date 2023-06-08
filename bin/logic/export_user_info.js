"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportUserInfo = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const user_info_1 = require("../entity/user_info");
// import fs module
const fs = __importStar(require("fs"));
// import logger
const logger_1 = require("../common/logger");
class ExportUserInfo {
    /**
     * parse user info list from discord returned values
     * @param member_info_list Discord's GuildMember Collection (Map) object
     * @returns UserInfo[] parsed object
     */
    parse_user_info(member_info_list) {
        // result
        let user_info_list = [];
        // loop member list
        member_info_list.forEach((user_info, user_id) => {
            // create user info temp valiable
            const user_info_temp = user_info_1.UserInfo.parse_from_discordjs(user_info);
            // loop role list
            user_info.roles.cache.forEach((role_info, role_id) => {
                const role_info_temp = user_info_1.RoleInfo.parse_from_discordjs(role_info);
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
    get_output_string(user_info_list) {
        // output file buffer
        let output_buffer = '';
        // variables
        const split_char = this.parse_escaped_characters(constants.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR);
        const line_separator = this.parse_escaped_characters(constants.DISCORD_EXPORT_USER_INFO_LINE_SEPARATOR);
        const name_item_name = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME;
        const name_item_id = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_ID;
        const has_role_char = constants.DISCORD_EXPORT_USER_INFO_HAS_ROLE;
        const not_has_role_char = constants.DISCORD_EXPORT_USER_INFO_NO_ROLE;
        // create all role list from user info
        const role_info_list = this.get_role_info_list(user_info_list);
        // create role info list
        const output_role_info_list = [];
        role_info_list.forEach((r) => {
            output_role_info_list.push(`${r.name}(${r.id})`);
        });
        // write header
        const header_string = `${name_item_name}${split_char}${name_item_id}${split_char}${output_role_info_list.join(split_char)}${line_separator}`;
        // create strings
        output_buffer = header_string + this.get_output_body_string(user_info_list, role_info_list, split_char, line_separator, has_role_char, not_has_role_char);
        return output_buffer;
    }
    /**
     * output export info to file path
     * @param export_file_path
     * @param output_buffer
     */
    export_to_file(export_file_path, output_buffer) {
        // write buffer to file
        logger_1.logger.info(`write output buffer to file. : path = ${export_file_path}`);
        fs.writeFileSync(export_file_path, output_buffer);
        logger_1.logger.info(`write output buffer complete.`);
    }
    /**
     * get non-escaped characters for \t \r \n
     * @param v escapec characters like \\t \\r \\n
     * @returns non-escaped characters
     */
    parse_escaped_characters(v) {
        let r = v;
        // for tab
        let regex = /\\t/i;
        r = r.replace(regex, "\t");
        // for r
        regex = /\\r/i;
        r = r.replace(regex, "\r");
        // for n
        regex = /\\n/i;
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
    get_output_body_string(user_info_list, role_info_list, split_char, line_separator, has_role_char, not_has_role_char) {
        // output buffer
        let output_buffer = '';
        // create strings
        user_info_list.forEach((user_info) => {
            // let role list
            let role_check_list = [];
            // write role lists
            role_info_list.forEach((role_info) => {
                // check role existance
                const exist_check = user_info.roles.some((r) => {
                    return r.id === role_info.id;
                });
                if (exist_check == true) {
                    // role exists -> set character
                    role_check_list.push(has_role_char);
                }
                else {
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
    get_role_info_list(user_info_list) {
        let role_info_list = [];
        // build user info list
        user_info_list.forEach((user_info) => {
            user_info.roles.forEach((role_info) => {
                // check exists
                const exist_check = role_info_list.some((r) => {
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
exports.ExportUserInfo = ExportUserInfo;
//# sourceMappingURL=export_user_info.js.map