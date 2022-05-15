// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Recruitment } from '../entity/recruitment';

// import discord modules
import * as Discord from 'discord.js';

export class DiscordMessageManager {

    /**
     * convert escaped lf character
     * @param str string of lf is '\\n'
     * @returns string of lf is '\n'
     */
    enable_lf(str: string): string {
        return str.replace('\\n', '\n');
    }

    /**
     * return date's readable locale string
     * @param date value
     * @returns date's readable string
     */
    get_date_string(date: Date): string {
        return `${date.toLocaleString()}`
    }

    /**
     * return recruitment thread's title
     * replacing:
     * %%TITLE%% -> recruitment name
     * @param template title template (e.g. constants.DISCORD_RECRUITMENT_THREAD_TITLE)
     * @param recruitment 
     * @returns 
     */
    get_recruitment_thread_title(template: string, recruitment: Recruitment) {
        let title: string = template
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
    get_recruitment_announcement_message(template: string, recruitment_target_role: string, recruitment: Recruitment) {
        let message: string = this.enable_lf(template)
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
    get_recruitment_embed_message(recruitment: Recruitment, recruitment_target_role: string, title: string, desription: string): Discord.MessageEmbed {
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
    get_new_recruitment_message(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT,
            constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    }

    /**
     * return edit recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_edit_recruitment_message(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT,
            constants.DISCORD_MESSAGE_EDIT_RECRUITMENT);
    }

    /**
     * return cancel recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_delete_recruitment_message(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT,
            constants.DISCORD_MESSAGE_DELETE_RECRUITMENT);
    }

    /**
     * return join recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_join_recruitment(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN,
            constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    }

    /**
     * return decline recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_decline_recruitment(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE,
            constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    }

    /**
     * return view recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_view_recruitment(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW,
            constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    }

    /**
     * return follow recruitment message
     * @param recruitment 
     * @param recruitment_target_role 
     * @returns Discord.MessageEmbed message
     */
    get_join_recruitment_follow_message(recruitment: Recruitment, recruitment_target_role: string): Discord.MessageEmbed {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT,
            constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    }

    /**
     * return recruitment is not found message
     * @returns message
     */
    get_no_recruitment(): string {
        let result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;

        return result;
    }

    /**
     * return regist server info message
     * @returns message
     */
    get_regist_server_info(recruitment_target_role: string): string {
        let result = this.enable_lf(constants.DISCORD_MESSAGE_REGIST_SERVER_INFO)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role);

        return result;
    }

    /**
     * return setting is not ready message
     * @returns message
     */
    get_setting_is_not_ready(admin_user_id: string): string {
        let result = this.enable_lf(constants.DISCORD_MESSAGE_SETTING_IS_NOT_READY)
            .replace('%%DISCORD_BOT_ADMIN_USER_ID%%', admin_user_id);

        return result;
    };

    /**
     * return user export info embed message
     */
    get_export_user_info_embed_message(message: string): Discord.MessageEmbed {
        return new Discord.MessageEmbed({
            timestamp: new Date(),
            fields: [
                {
                    name: constants.DISCORD_MESSAGE_EXPORT_TITLE,
                    value: `${message}`,
                }
            ]
        });
    }
};