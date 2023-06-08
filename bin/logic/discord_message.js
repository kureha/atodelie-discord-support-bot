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
exports.DiscordMessage = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = __importStar(require("discord.js"));
class DiscordMessage {
    /**
     * convert escaped lf character
     * @param str string of lf is '\\n'
     * @returns string of lf is '\n'
     */
    static enable_lf(str) {
        return str.replace(/[\\r]*\\n/g, '\n');
    }
    /**
     * convert espaced \t character
     * @param str string of tab is '\\t'
     * @returns string of tab is '\t
     */
    static enable_tab(str) {
        return str.replace(/\\t/mg, '\t');
    }
    /**
     * return date's readable locale string
     * @param date value
     * @returns date's readable string
     */
    static get_date_string(date) {
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
    static get_recruitment_thread_title(template, recruitment) {
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
    static get_recruitment_announcement_message(template, recruitment_target_role, recruitment) {
        let message = DiscordMessage.enable_lf(template)
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
    static get_recruitment_embed_message(recruitment, recruitment_target_role, title, desription) {
        // create title
        let title_converted = DiscordMessage.enable_lf(title)
            .replace('%%TITLE%%', recruitment.name);
        // create description
        let description_converted = DiscordMessage.enable_lf(desription)
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
        return new Discord.EmbedBuilder({
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
                    value: `${DiscordMessage.get_date_string(recruitment.limit_time)}`
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
    static get_new_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT, constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    }
    /**
     * return edit recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_edit_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT, constants.DISCORD_MESSAGE_EDIT_RECRUITMENT);
    }
    /**
     * return cancel recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_delete_recruitment_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT, constants.DISCORD_MESSAGE_DELETE_RECRUITMENT);
    }
    /**
     * return join recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_join_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN, constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    }
    /**
     * return decline recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_decline_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE, constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    }
    /**
     * return view recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_view_recruitment(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW, constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    }
    /**
     * return follow recruitment message
     * @param recruitment
     * @param recruitment_target_role
     * @returns Discord.MessageEmbed message
     */
    static get_join_recruitment_follow_message(recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT, constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    }
    /**
     * return recruitment is not found message
     * @returns message
     */
    static get_no_recruitment() {
        let result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;
        return result;
    }
    /**
     * return regist server info message
     * @returns message
     */
    static get_regist_server_info(recruitment_target_role) {
        let result = DiscordMessage.enable_lf(constants.DISCORD_MESSAGE_REGIST_SERVER_INFO)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role);
        return result;
    }
    /**
     * return setting is not ready message
     * @returns message
     */
    static get_setting_is_not_ready(admin_user_id) {
        let result = DiscordMessage.enable_lf(constants.DISCORD_MESSAGE_SETTING_IS_NOT_READY)
            .replace('%%DISCORD_BOT_ADMIN_USER_ID%%', admin_user_id);
        return result;
    }
    ;
    /**
     * return user export info embed message
     */
    static get_export_user_info_embed_message(message) {
        return new Discord.EmbedBuilder({
            timestamp: new Date(),
            fields: [
                {
                    name: constants.DISCORD_MESSAGE_EXPORT_TITLE,
                    value: `${message}`,
                }
            ]
        });
    }
    /**
     * return friend code message
     * @param message
     * @param friend_code
     * @param user_name
     * @param user_id
     * @param game_name
     * @param game_id
     * @returns
     */
    static get_friend_code_message(message, friend_code, user_name, user_id, game_name, game_id) {
        return DiscordMessage.enable_tab(DiscordMessage.enable_lf(message))
            .replace('%%USER_NAME%%', user_name)
            .replace('%%USER_ID%%', user_id)
            .replace('%%GAME_NAME%%', game_name)
            .replace('%%FRIEND_CODE%%', friend_code);
    }
    /**
     * return automatic announcement message
     * replaceing:
     * %%DISCORD_REPLY_ROLE%% -> role id
     * %%GAME_PLAYING_CHANNEL_ID%% -> game playing channel id
     * %%GAME_NAME%% -> game name
     * @param template
     * @param recruitment_target_role
     * @param game_name
     * @returns string
     */
    static get_auto_announcement_message(template, recruitment_target_role, game_playing_channel_id, game_name) {
        let message = DiscordMessage.enable_lf(template)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%GAME_PLAYING_CHANNEL_ID%%', game_playing_channel_id)
            .replace('%%GAME_NAME%%', game_name);
        return message;
    }
}
exports.DiscordMessage = DiscordMessage;
;
//# sourceMappingURL=discord_message.js.map