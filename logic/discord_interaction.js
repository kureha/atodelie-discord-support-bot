// create logger
const logger = require('./../common/logger');

// import constants
const Constants = require('./../common/constants');
const constants = new Constants();

// エンティティ有効化
const Participate = require('../entity/participate');

module.exports = class DiscordInteraction {

    static DESCRIPTION_FOR_JOIN_FROM_BUTTON = `ボタンからの参加`;

    constructor(customId, user_id) {
        // properties
        this.id = ``;
        this.valid = false;
        this.token = ``;
        this.error_messages = [];

        // check custom id for recruitment join
        if (customId.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid. type = ${constants.TYPE_JOIN}`);
            this.type = constants.TYPE_JOIN;
            this.delete = false;

            // get token from custom id
            this.token = customId.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}(.+)$`))[1];
        } else if (customId.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid.. type = ${constants.TYPE_DECLINE}`);
            this.type = constants.TYPE_DECLINE;
            this.delete = true;

            // get token from custom id
            this.token = customId.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}(.+)$`))[1];
        } else {
            // error
            logger.warn(`this interaction dosen't match join recruitment. : customId = ${customId}`);
            this.error_messages.push(`this interaction dosen't match join recruitment. : customId = ${customId}`);
            return;
        }

        // this is valid interaction.
        this.valid = true;
        logger.info(`this is valid interaction. token = ${this.token}`);

        // set valiables
        this.status = constants.STATUS_ENABLED
        this.user_id = user_id;
        this.description = DiscordInteraction.DESCRIPTION_FOR_JOIN_FROM_BUTTON;
    }

    /**
     * 新規IDをインスタンスに適用します
     * @param {string} new_id 
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
     * 参加情報を返却します
     * @returns 参加オブジェクト
     */
    get_join_participate() {
        const participate = new Participate();

        if (this.valid === false) {
            return undefined;
        } else {
            participate.id = this.id;
            participate.token = this.token;
            participate.status = this.status;
            participate.user_id = this.user_id;
            participate.description = this.description;
            participate.delete = this.delete;

            return participate;
        }
    }
}