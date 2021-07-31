// create logger
const logger = require('../common/logger');

// import constants
const Constants = require('../common/constants');
const constants = new Constants();

module.exports = class DiscordMessageManager {
    /**
     * 募集文を返却します
     * @param {string} title 
     * @param {int} id 
     * @param {Array(string)} user_id_list 
     */
     static GetEmbedMessage(title, id, user_id_list) {
        let result = "";

        result = `募集名 : ${title}\n識別ID : ${id}\n参加者 : `;
        user_id_list.forEach(element => {
            result = result + `<@!${element}> `;
        });

        return result;
    }

    /**
     * 一覧を返却します
     * @param {Array(hash)} data 
     */
    static GetEmbedList(data) {
        let result = `募集一覧 : \n`;

        data.forEach(v => {
            result = result + `ID : ${v.id}、募集名 : ${v.name}、参加者：${v.user_name}\n`;
        });

        return result;
    }
};