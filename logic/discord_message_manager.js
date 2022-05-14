"use strict";
exports.__esModule = true;
exports.DiscordMessageManager = void 0;
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import discord modules
var Discord = require("discord.js");
var DiscordMessageManager = /** @class */ (function () {
    function DiscordMessageManager() {
    }
    /**
     * convert escaped lf character
     * @param str string of lf is '\\n'
     * @returns string of lf is '\n'
     */
    DiscordMessageManager.prototype.enable_lf = function (str) {
        return str.replace('\\n', '\n');
    };
    /**
     * return date's readable locale string
     * @param date value
     * @returns date's readable string
     */
    DiscordMessageManager.prototype.get_date_string = function (date) {
        return "".concat(date.toLocaleString());
    };
    /**
     * return recruitment thread's title
     * replacing:
     * %%TITLE%% -> recruitment name
     * @param template title template (e.g. constants.DISCORD_RECRUITMENT_THREAD_TITLE)
     * @param recruitment
     * @returns
     */
    DiscordMessageManager.prototype.get_recruitment_thread_title = function (template, recruitment) {
        var title = template
            .replace('%%TITLE%%', recruitment.name);
        return title;
    };
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
    DiscordMessageManager.prototype.get_recruitment_announcement_message = function (template, recruitment_target_role, recruitment) {
        var message = this.enable_lf(template)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', recruitment.token);
        return message;
    };
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
    DiscordMessageManager.prototype.get_recruitment_embed_message = function (recruitment, recruitment_target_role, title, desription) {
        // create title
        var title_converted = this.enable_lf(title)
            .replace('%%TITLE%%', recruitment.name);
        // create description
        var description_converted = this.enable_lf(desription)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', recruitment.token);
        // create user list string
        var join_users = '';
        recruitment.user_list.forEach(function (v) {
            if (v.status === constants.STATUS_ENABLED) {
                join_users = "".concat(join_users, "<@!").concat(v.user_id, "> ");
            }
        });
        if (join_users.length === 0) {
            join_users = constants.DISCORD_MESSAGE_EMBED_NO_MEMBER;
        }
        // create view user list string
        var view_users = '';
        recruitment.user_list.forEach(function (v) {
            if (v.status === constants.STATUS_VIEW) {
                view_users = "".concat(view_users, "<@!").concat(v.user_id, "> ");
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
                    value: "".concat(recruitment.name)
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_START_TIME,
                    value: "".concat(this.get_date_string(recruitment.limit_time))
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS,
                    value: "".concat(join_users)
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS,
                    value: "".concat(view_users)
                }
            ]
        });
    };
    /**
     * return new recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_new_recruitment_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT, constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    };
    /**
     * return edit recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_edit_recruitment_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT, constants.DISCORD_MESSAGE_EDIT_RECRUITMENT);
    };
    /**
     * return cancel recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_delete_recruitment_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT, constants.DISCORD_MESSAGE_DELETE_RECRUITMENT);
    };
    /**
     * return join recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_join_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN, constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    };
    /**
     * return decline recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_decline_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE, constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    };
    /**
     * return view recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_view_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW, constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    };
    /**
     * return follow recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    DiscordMessageManager.prototype.get_join_recruitment_follow_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT, constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    };
    /**
     * return recruitment is not found message
     * @returns message
     */
    DiscordMessageManager.prototype.get_no_recruitment = function () {
        var result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;
        return result;
    };
    /**
     * return regist server info message
     * @returns message
     */
    DiscordMessageManager.prototype.get_regist_server_info = function (recruitment_target_role) {
        var result = this.enable_lf(constants.DISCORD_MESSAGE_REGIST_SERVER_INFO)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role);
        return result;
    };
    /**
     * return setting is not ready message
     * @returns message
     */
    DiscordMessageManager.prototype.get_setting_is_not_ready = function (admin_user_id) {
        var result = this.enable_lf(constants.DISCORD_MESSAGE_SETTING_IS_NOT_READY)
            .replace('%%DISCORD_BOT_ADMIN_USER_ID%%', admin_user_id);
        return result;
    };
    /**
     * get user info list message
     * @returns
     */
    DiscordMessageManager.prototype.get_user_info_list = function (user_info_list) {
        // result
        var result = '';
        // variables
        var header_message = constants.DISCORD_MESSAGE_EXPORT_USER_INFO;
        var split_char = constants.DISCORD_EXPORT_USER_INFO_SPLIT_CHAR;
        var line_separator = "\r\n";
        var name_item_name = constants.DISCORD_EXPORT_USER_INFO_NAME_ITEM_NAME;
        var has_role_char = constants.DISCORD_EXPORT_USER_INFO_HAS_ROLE;
        var not_has_role_char = constants.DISCORD_EXPORT_USER_INFO_NO_ROLE;
        // write initial header
        result = "".concat(header_message).concat(line_separator).concat(line_separator);
        // create all role list from user info
        var role_info_list = this.get_role_info_list(user_info_list);
        // create role info list
        var role_info_name_list = [];
        role_info_list.forEach(function (r) {
            role_info_name_list.push(r.name);
        });
        // write header
        result = "".concat(result).concat(name_item_name).concat(split_char).concat(role_info_name_list.join(split_char)).concat(line_separator);
        // create strings
        user_info_list.forEach(function (user_info) {
            // let role list
            var role_check_list = [];
            // write role lists
            role_info_list.forEach(function (role_info) {
                // check role existance
                var exist_check = user_info.roles.some(function (r) {
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
            result = "".concat(result).concat(user_info.name).concat(split_char).concat(role_check_list.join(split_char)).concat(line_separator);
        });
        // return result
        return result;
    };
    /**
     * get role info list from user info list
     * @returns
     */
    DiscordMessageManager.prototype.get_role_info_list = function (user_info_list) {
        var role_info_list = [];
        // build user info list
        user_info_list.forEach(function (user_info) {
            user_info.roles.forEach(function (role_info) {
                // check exists
                var exist_check = role_info_list.some(function (r) {
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
    };
    return DiscordMessageManager;
}());
exports.DiscordMessageManager = DiscordMessageManager;
;
