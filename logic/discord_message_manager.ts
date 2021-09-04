// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Recruitment } from '../entity/recruitment';
import { Participate } from '../entity/participate';

// import discord modules
import * as Discord from 'discord.js';

export class DiscordMessageManager {

    /**
     * 文字列のエスケープされた改行を有効にします
     * @param {string} str 
     * @returns {string} \\nが\nに置換された文字列
     */
    enable_lf(str: string) {
        return str.replace('\\n', '\n');
    }

    /**
     * 日付のISO表現を読みやすい形に変形し返却します
     * @param {string} parsed_date 
     * @returns {string}
     */
    get_date_string(parsed_date: Date) {
        return `${parsed_date.toLocaleString()}`
    }

    /**
     * 募集用の組み込みメッセージを返す内部処理です。
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @param {string} title 
     * @param {string} desription 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_recruitment_embed_message(recruitment: Recruitment, recruitment_target_role: string, title: string, desription: string) {
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
            title: title,
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
     * 新規募集時のメッセージを返却します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_new_recruitment_message(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT,
            constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    }

    /**
     * 募集編集時のメッセージを返却します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_edit_recruitment_message(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_EDIT_RECRUITMENT,
            constants.DISCORD_MESSAGE_EDIT_RECRUITMENT);
    }

    /**
     * 募集中止時のメッセージを返却します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_delete_recruitment_message(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_DELETE_RECRUITMENT,
            constants.DISCORD_MESSAGE_DELETE_RECRUITMENT);
    }

    /**
     * 募集参加時のメッセージを返却します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_join_recruitment(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN,
            constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    }

    /**
     * 参加取りやめのメッセージを返します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_decline_recruitment(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE,
            constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    }

    /**
     * 観戦のメッセージを返します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_view_recruitment(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW,
            constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    }

    /**
     * 募集フォロー時の組み込みメッセージを返します
     * @param {Recruitment} recruitment 
     * @param {string} recruitment_target_role 
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    get_join_recruitment_follow_message(recruitment: Recruitment, recruitment_target_role: string) {
        // call interanal function
        return this.get_recruitment_embed_message(
            recruitment,
            recruitment_target_role,
            constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT,
            constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    }

    /**
     * 募集が見つからないことを示すメッセージを返します
     * @returns {string}
     */
    get_no_recruitment() {
        let result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;

        return result;
    }
};