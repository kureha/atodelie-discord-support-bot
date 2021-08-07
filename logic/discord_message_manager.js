// create logger
const logger = require('../common/logger');

// import constants
const Constants = require('../common/constants');
const DiscordAnalyzer = require('./discord_analyzer');
const constants = new Constants();

module.exports = class DiscordMessageManager {

    /**
     * 文字列のエスケープされた改行を有効にします
     * @param {string} str 
     * @returns \\mが\nに置換された文字列
     */
    enable_lf(str) {
        return str.replace('\\n', '\n');
    }

    /**
     * 日付のISO表現を読みやすい形に変形し返却します
     * @param {string} iso_date_str 
     */
    get_date_string(iso_date_str) {
        let parsed_date = new Date(iso_date_str);
        return `${parsed_date.toLocaleString()}`
    }

    /**
     * 新規募集時のメッセージを返却します
     * @param {DiscordAnalyzer} analyzer 
     * @returns 募集文字列
     */
    get_new_recruitment_message(analyzer, recruitment_target_role) {
        let result = constants.DISCORD_MESSAGE_NEW_RECRUITMENT;
        result = this.enable_lf(result
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', analyzer.token));

        return result;
    }

    /**
     * 新規募集時の組み込みメッセージを返却します
     * @param {DiscordAnalyzer} analyzer 
     * @returns 
     */
    get_new_recruitment_embed_message(analyzer) {
        let result = '';
        result = `${result}\n\n募集名 : ${analyzer.name}\n主催者 : <@!${analyzer.owner_id}>\n募集期限 : ${this.get_date_string(analyzer.limit_time)}`;

        return result;
    }

    /**
     * 募集参加時のメッセージを返却します
     * @param {DiscordAnalyzer}} analyzer 
     * @returns 
     */
    get_join_recruitment(analyzer, recruitment_target_role) {
        let result = constants.DISCORD_MESSAGE_SUCCESS_JOIN;
        result = this.enable_lf(result)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', analyzer.token);

        return result;
    }

    /**
     * 募集参加時の組み込みメッセージを返します
     * @param {DiscordAnalyzer} analyzer 
     * @returns 
     */
    get_join_recruitment_embed_message(analyzer) {
        let result = '';
        result = `${result}\n\n募集名 : ${analyzer.name}\n主催者 : <@!${analyzer.owner_id}>\n募集期限 : ${this.get_date_string(analyzer.limit_time)}\n参加者 : `;

        analyzer.user_list.forEach((v) => {
            result = `${result}<@!${v.user_id}> `;
        });

        return result;
    }

    /**
     * 参加取りやめのメッセージを返します
     * @param {DiscordAnalyzer} analyzer 
     * @returns 
     */
    get_decline_recruitment(analyzer, recruitment_target_role) {
        let result = constants.DISCORD_MESSAGE_SUCCESS_DECLINE;
        result = this.enable_lf(result)
            .replace('%%DISCORD_REPLY_ROLE%%', recruitment_target_role)
            .replace('%%TOKEN%%', analyzer.token);

        return result;
    }

    /**
     * 募集が見つからないことを示すメッセージを返します
     * @returns 
     */
    get_no_recruitment() {
        let result = constants.DISCORD_MESSAGE_NOT_FOUND_RECRUITMENT;

        return result;
    }

    /**
     * 募集フォロー時の組み込みメッセージを返します
     * @param {DiscordAnalyzer} analyzer 
     * @returns 
     */
     get_join_recruitment_follow_message(analyzer) {
        let result = constants.DISCORD_MESSAGE_FOLLOW_RECRUITMENT;
        result = `${result}\n募集名 : ${analyzer.name}\n募集期限 : ${this.get_date_string(analyzer.limit_time)}\n参加者 : `;

        analyzer.user_list.forEach((v) => {
            result = `${result}<@!${v.user_id}> `;
        });

        return result;
    }
};