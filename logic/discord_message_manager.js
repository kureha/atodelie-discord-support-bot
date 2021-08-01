// create logger
const logger = require('../common/logger');

// import constants
const Constants = require('../common/constants');
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
     * 新規募集時のメッセージを返却します
     * @param {Object} analyzer 
     * @returns 募集文字列
     */
    get_new_recruitment_message(analyzer) {
        let result = constants.DISCORD_MESSAGE_NEW_RECRUITMENT;
        result = this.enable_lf(result.replace('%%TOKEN%%', analyzer.token));

        return result;
    }

    /**
     * 新規募集時の組み込みメッセージを返却します
     * @param {Object} analyzer 
     * @returns 
     */
    get_new_recruitment_embed_message(analyzer) {
        let result = '';
        result = `${result}\n\n募集名 : ${analyzer.name}\n主催者 : <@!${analyzer.owner_id}>\n募集期限 : ${analyzer.limit_time}`;

        return result;
    }

    /**
     * 募集文を返却します
     * @param {string} title 
     * @param {int} id 
     * @param {Array(string)} user_id_list 
     */
     get_embed_message(title, id, user_id_list) {
        let result = "";

        result = `募集名 : ${title}\n識別ID : ${id}\n参加者 : `;
        user_id_list.forEach(element => {
            result = result + `<@!${element}> `;
        });

        return result;
    }
};