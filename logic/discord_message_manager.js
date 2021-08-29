"use strict";
exports.__esModule = true;
exports.DiscordMessageManager = void 0;
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import discord modules
var Discord = require("discord.js");
var DiscordMessageManager = /** @class */ (function () {
    function DiscordMessageManager() {
    }
    /**
     * 文字列のエスケープされた改行を有効にします
     * @param {string} str
     * @returns {string} \\nが\nに置換された文字列
     */
    DiscordMessageManager.prototype.enable_lf = function (str) {
        return str.replace('\\n', '\n');
    };
    /**
     * 日付のISO表現を読みやすい形に変形し返却します
     * @param {string} parsed_date
     * @returns {string}
     */
    DiscordMessageManager.prototype.get_date_string = function (parsed_date) {
        return "" + parsed_date.toLocaleString();
    };
    /**
     * 募集用の組み込みメッセージを返す内部処理です。
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @param {string} title
     * @param {string} desription
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_recruitment_embed_message = function (recruitment, recruitment_target_role, title, desription) {
        // create description
        var description_converted = this.enable_lf(desription)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', recruitment.token);
        // create user list string
        var join_users = '';
        recruitment.user_list.forEach(function (v) {
            if (v.status === constants.STATUS_ENABLED) {
                join_users = join_users + "<@!" + v.user_id + "> ";
            }
        });
        if (join_users.length === 0) {
            join_users = constants.DISCORD_MESSAGE_EMBED_NO_MEMBER;
        }
        // create view user list string
        var view_users = '';
        recruitment.user_list.forEach(function (v) {
            if (v.status === constants.STATUS_VIEW) {
                view_users = view_users + "<@!" + v.user_id + "> ";
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
                    value: "" + recruitment.name
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_START_TIME,
                    value: "" + this.get_date_string(recruitment.limit_time)
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_JOIN_MEMBERS,
                    value: "" + join_users
                },
                {
                    name: constants.DISCORD_MESSAGE_EMBED_VIEW_MEMBERS,
                    value: "" + view_users
                }
            ]
        });
    };
    /**
     * 新規募集時のメッセージを返却します
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_new_recruitment_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_NEW_RECRUITMENT, constants.DISCORD_MESSAGE_NEW_RECRUITMENT);
    };
    /**
     * 募集参加時のメッセージを返却します
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_join_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_JOIN, constants.DISCORD_MESSAGE_SUCCESS_JOIN);
    };
    /**
     * 参加取りやめのメッセージを返します
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_decline_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_DECLINE, constants.DISCORD_MESSAGE_SUCCESS_DECLINE);
    };
    /**
     * 観戦のメッセージを返します
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_view_recruitment = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_SUCCESS_VIEW, constants.DISCORD_MESSAGE_SUCCESS_VIEW);
    };
    /**
     * 募集フォロー時の組み込みメッセージを返します
     * @param {Recruitment} recruitment
     * @param {string} recruitment_target_role
     * @returns {Discord.MessageEmbed} Discord.MessageEmbed形式のメッセージ
     */
    DiscordMessageManager.prototype.get_join_recruitment_follow_message = function (recruitment, recruitment_target_role) {
        // call interanal function
        return this.get_recruitment_embed_message(recruitment, recruitment_target_role, constants.DISCORD_MESSAGE_TITLE_FOLLOW_RECRUITMENT, constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT);
    };
    /**
     * 募集が見つからないことを示すメッセージを返します
     * @returns {string}
     */
    DiscordMessageManager.prototype.get_no_recruitment = function () {
        var result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;
        return result;
    };
    return DiscordMessageManager;
}());
exports.DiscordMessageManager = DiscordMessageManager;
;
