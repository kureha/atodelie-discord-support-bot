"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordInteractionAnalyzer = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const participate_1 = require("../entity/participate");
class DiscordInteractionAnalyzer {
    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        // properties
        this.id = 0;
        this.token = '';
        this.status = constants.STATUS_ENABLED;
        this.user_id = '';
        this.valid = false;
        this.type = constants.TYPE_INIT;
        this.description = '';
        this.error_messages = [];
        this.delete = true;
    }
    /**
     * インタラクションを解析し、解析結果を設定する
     * @param {string} custom_id
     * @param {string} user_id
     */
    analyze(custom_id, user_id) {
        return new Promise((resolve, reject) => {
            // check custom id for recruitment join
            if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}`))) {
                logger_1.logger.debug(`interaction is valid. type = ${constants.TYPE_JOIN}`);
                this.type = constants.TYPE_JOIN;
                this.delete = false;
                // status
                this.status = constants.STATUS_ENABLED;
                // get token from custom id
                this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX);
            }
            else if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}`))) {
                logger_1.logger.debug(`interaction is valid.. type = ${constants.TYPE_VIEW}`);
                this.type = constants.TYPE_VIEW;
                this.delete = false;
                // change status
                this.status = constants.STATUS_VIEW;
                // get token from custom id
                this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX);
            }
            else if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`))) {
                logger_1.logger.debug(`interaction is valid.. type = ${constants.TYPE_DECLINE}`);
                this.type = constants.TYPE_DECLINE;
                this.delete = true;
                // status
                this.status = constants.STATUS_DISABLED;
                // get token from custom id
                this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX);
            }
            else {
                // error
                logger_1.logger.warn(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
                this.error_messages.push(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
                // this is not valid interaction.
                this.valid = false;
                // ng
                reject();
            }
            // this is valid interaction.
            this.valid = true;
            logger_1.logger.info(`this is valid interaction. token = ${this.token}`);
            // set valiables
            this.user_id = user_id;
            this.description = DiscordInteractionAnalyzer.DESCRIPTION_FOR_JOIN_FROM_BUTTON;
            // ok
            resolve();
        });
    }
    /**
     * 新規IDをインスタンスに適用します
     * @param {number} new_id
     */
    set_id(new_id) {
        this.id = new_id;
    }
    /**
     * 新規トークンをインスタンスに適用します
     * @param {string} new_token
     */
    set_token(new_token) {
        this.token = new_token;
    }
    /**
     * DiscordのカスタムIDからトークンを取得します
     * @param {string} custom_id DiscordのカスタムID
     * @returns {string} トークン文字列
     */
    get_token(custom_id, token_prefix) {
        const token_regexp = new RegExp(`^${token_prefix}(.+)$`);
        let match_result = custom_id.match(token_regexp);
        if (match_result === null || match_result.length < 2) {
            return constants.ERROR_RECRUITMENT_TOKEN;
        }
        else {
            return match_result[1];
        }
    }
    /**
     * 参加情報を返却します
     * @returns {Participate} 参加オブジェクト
     */
    get_join_participate() {
        const participate = new participate_1.Participate();
        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.user_id;
        participate.description = this.description;
        participate.delete = this.delete;
        return participate;
    }
}
exports.DiscordInteractionAnalyzer = DiscordInteractionAnalyzer;
/**
 * ボタンから参加した場合の募集説明文字列
 */
DiscordInteractionAnalyzer.DESCRIPTION_FOR_JOIN_FROM_BUTTON = `ボタンからの参加`;
//# sourceMappingURL=discord_interaction_analyzer.js.map