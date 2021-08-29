// ロガーを定義
import {logger} from '../common/logger';

// 定数定義を読み込む
import {Constants} from '../common/constants';
const constants = new Constants();

// エンティティ有効化
import {Participate} from '../entity/participate';

export class DiscordInteraction {

    /**
     * ボタンから参加した場合の募集説明文字列
     */
    static DESCRIPTION_FOR_JOIN_FROM_BUTTON = `ボタンからの参加`;

    // 解析結果を格納する変数
    id : number;
    token : string;
    status : number;
    user_id : string;
    valid : boolean;
    error_messages : string[];
    type : number;
    description : string;
    delete : boolean;

    /**
     * インタラクションを解析し、解析結果を返却する
     * @param {string} custom_id 
     * @param {string} user_id 
     * @constructor
     */
    constructor(custom_id : string, user_id : string) {
        // properties
        this.id = 0;
        this.token = '';
        this.status= constants.STATUS_ENABLED;
        this.user_id = '';
        this.valid = false;
        this.type = constants.TYPE_INIT;
        this.description = '';
        this.error_messages = [];
        this.delete = true;

        // check custom id for recruitment join
        if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid. type = ${constants.TYPE_JOIN}`);
            this.type = constants.TYPE_JOIN;
            this.delete = false;

            // status
            this.status = constants.STATUS_ENABLED;

            // get token from custom id
            this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX);
        } else if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid.. type = ${constants.TYPE_VIEW}`);
            this.type = constants.TYPE_VIEW;
            this.delete = false;

            // change status
            this.status = constants.STATUS_VIEW;

            // get token from custom id
            this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX);
        } else if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid.. type = ${constants.TYPE_DECLINE}`);
            this.type = constants.TYPE_DECLINE;
            this.delete = true;

            // status
            this.status = constants.STATUS_DISABLED;

            // get token from custom id
            this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX);
        } else {
            // error
            logger.warn(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
            this.error_messages.push(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
            return;
        }

        // this is valid interaction.
        this.valid = true;
        logger.info(`this is valid interaction. token = ${this.token}`);

        // set valiables
        this.user_id = user_id;
        this.description = DiscordInteraction.DESCRIPTION_FOR_JOIN_FROM_BUTTON;
    }

    /**
     * 新規IDをインスタンスに適用します
     * @param {number} new_id 
     */
    set_id(new_id : number) {
        this.id = new_id;
    }

    /**
     * 新規トークンをインスタンスに適用します
     * @param {string} new_token 
     */
    set_token(new_token : string) {
        this.token = new_token;
    }

    /**
     * DiscordのカスタムIDからトークンを取得します
     * @param {string} custom_id DiscordのカスタムID
     * @returns {string} トークン文字列
     */
    get_token(custom_id : string, token_prefix : string) {
        const token_regexp = new RegExp(`^${token_prefix}(.+)$`);
        let match_result = custom_id.match(token_regexp);

        if (match_result === null || match_result.length < 2) {
            return constants.ERROR_RECRUITMENT_TOKEN;
        } else {
            return match_result[1];
        }
    }

    /**
     * 参加情報を返却します
     * @returns {Participate} 参加オブジェクト
     */
    get_join_participate() {
        const participate = new Participate();

        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.user_id;
        participate.description = this.description;
        participate.delete = this.delete;

        return participate;
    }
}