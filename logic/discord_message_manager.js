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
exports.DiscordMessageManager = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = __importStar(require("discord.js"));
// import fs module
const fs = __importStar(require("fs"));
const logger_1 = require("../common/logger");
class DiscordMessageManager {
    /**
     * convert escaped lf character
     * @param str string of lf is '\\n'
     * @returns string of lf is '\n'
     */
    enable_lf(str) {
        return str.replace('\\n', '\n');
    }
    /**
     * return date's readable locale string
     * @param date value
     * @returns date's readable string
     */
    get_date_string(date) {
        return `${date.toLocaleString()}`;
    }
    /**
     * return recruitment thread's title
     * replacing:
     * %%TITLE%% -> recruitment name
     * @param template title template (e.g. constants.DISCORD_RECRUITMENT_THREAD_TITLE)
     * @param recruitment
     * @returns
     */
    get_recruitment_thread_title(template, recruitment) {
        let title = template
            .replace('%%TITLE%%', recruitment.name);
        return title;
    }
    /**
     * return recruitment annouce message
     * replaceing:
     * %%DISCORD_REPLY_ROLE%% -> role id
     * %%TOKEN%% -> recruitment token
     * @param template
     * @param recruitment_target_role
     * @param recruitment
     * @returns Discord.MessageEmbed message
     */
    get_recruitment_announcement_message(template, recruitment_target_role, recruitment) {
        let message = this.enable_lf(template)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', recruitment.token);
        return message;
    }
    /**
     * return recruitment embed message
     * replaceing:
     * %%DISCORD_REPLY_ROLE%% -> role id
     * %%TOKEN%% -> recruitment token
     * @param recruitment
     * @param recruitment_target_role
     * @param title
     * @param desription
     * @returns Discord.MessageEmbed message
     */
    get_recruitment_embed_message(recruitment, recruitment_target_role, title, desription) {
        // create title
        let title_converted = this.enable_lf(title)
            .replace('%%TITLE%%', recruitment.name);
        // create description
        let description_converted = this.enable_lf(desription)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', recruitment.token);
        // create user list string
        let join_users = '';
        recruitment.user_list.forEach((v) => {
            if (v.status === constants.STATUS_ENABLED) {
                join_users = `${join_users}<@!${v.user_id}> `;
            }
        });
        if (join_users.length === 0) {
            join_users = constants.DISCORD_MESSAGE_EMBED_NO_MEMBER;
        }
        // create view user list string
        let view_users = '';
        recruitment.user_list.forEach((v) => {
            if (v.status === constants.STATUS_VIEW) {
                view_users = `${view_users}<@!${v.user_id}> `;
            }
        });
        if (view_users.length === 0) {
            view_users = constants.DISCORD_MESSAGE_EMBED_NO_MEMBER;
        }
        return new Discord.MessageEmbed({
            title: title_converted,
            description: description_converted,
            timestamp: new Date(),
            fields: [
                {
                    name: constants.DISCORD_MESSAGE_EMBED_TITLE,
                    value: `${recruitment.name}`,
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_START_TIME,
                    value: `${this.get_date_string(recruitment.limit_time)}`
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS,
                    value: `${join_users}`
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS,
                    value: `${view_users}`
                }
            ],
        });
    }
    /**
     * return new recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_new_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT, constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    }
    /**
     * return edit recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_edit_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT, constants.DISCORD_MESSAGE_EDIT_RECRUITMENT);
    }
    /**
     * return cancel recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_delete_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT, constants.DISCORD_MESSAGE_DELETE_RECRUITMENT);
    }
    /**
     * return join recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_join_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN, constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    }
    /**
     * return decline recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_decline_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE, constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    }
    /**
     * return view recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_view_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW, constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    }
    /**
     * return follow recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    get_join_recruitment_follow_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT, constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    }
    /**
     * return recruitment is not found message
     * @returns message
     */
    get_no_recruitment() {
        let result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;
        return result;
    }
    /**
     * return regist server info message
     * @returns message
     */
    get_regist_server_info(recruitment_target_role) {
        let result = this.enable_lf(constants.DISCORD_MESSAGE_REGIST_SERVER_INFO)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role);
        return result;
    }
    /**
     * return setting is not ready message
     * @returns message
     */
    get_setting_is_not_ready(admin_user_id) {
        let result = this.enable_lf(constants.DISCORD_MESSAGE_SETTING_IS_NOT_READY)
            .replace('%%DISCORD_BOT_ADMIN_USER_ID%%', admin_user_id);
        return result;
    }
    /**
     * get user info list message
     * @param user_info_list
     * @param exceeded_limit is 1000 over?
     * @returns
     */
    get_user_info_list(user_info_list, output_file_path) {
        // output file buffer
        let output_buffer = '';
        // variables
        const split_char = constants.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR;
        const line_separator = "\r\n";
        const name_item_name = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME;
        const has_role_char = constants.DISCORD_EXPORT_USER_INFO_HAS_ROLE;
        const not_has_role_char = constants.DISCORD_EXPORT_USER_INFO_NO_ROLE;
        // create all role list from user info
        let role_info_list = this.get_role_info_list(user_info_list);
        // create role info list
        let role_info_name_list = [];
        role_info_list.forEach((r) => {
            role_info_name_list.push(r.name);
        });
        // write header
        output_buffer = `${name_item_name}${split_char}${role_info_name_list.join(split_char)}${line_separator}`;
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
            output_buffer = `${output_buffer}${user_info.name}${split_char}${role_check_list.join(split_char)}${line_separator}`;
        });
        // write buffer to file
        logger_1.logger.info(`write output buffer to file. : path = ${output_file_path}`);
        fs.writeFileSync(output_file_path, output_buffer);
        logger_1.logger.info(`write output buffer complete.`);
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
exports.DiscordMessageManager = DiscordMessageManager;
;
//# sourceMappingURL=discord_message_manager.js.map