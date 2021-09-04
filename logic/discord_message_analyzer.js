"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageAnalyzer = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const recruitment_1 = require("../entity/recruitment");
const participate_1 = require("../entity/participate");
const recruitement_1 = require("../db/recruitement");
const participate_2 = require("../db/participate");
class DiscordMessageAnalyzer {
    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        // remove user.id from message
        this.message = '';
        // copy server id
        this.server_id = '';
        // initialize variables
        this.message_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.max_number = DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
        this.description = '';
        this.delete = true;
        // this is "recruitment" is valid
        this.valid = false;
        this.id = 0;
        this.error_messages = [];
        this.type = constants.TYPE_INIT;
        // participate members
        this.user_list = [];
        // default limit date
        this.default_date = new Date();
        this.default_date.setHours(this.default_date.getHours() + DiscordMessageAnalyzer.HOURS_DEFAULT);
    }
    /**
     * メッセージを解析し、解析結果を返却する
     * @param mes メッセージ本体
     * @param server_id
     * @param message_user_id メッセージを送信したユーザID
     * @param user_id botのDiscordユーザID
     * @param reference
     */
    analyze(mes, server_id, message_user_id, user_id, reference) {
        return new Promise((resolve, reject) => {
            // remove user.id from message
            this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");
            // copy server id
            this.server_id = server_id;
            // detect recruitment
            if (DiscordMessageAnalyzer.check_recruitment(this.message) == true) {
                logger_1.logger.info(`target message is new recruitment. : mes = ${this.message}`);
                this.type = constants.TYPE_RECRUITEMENT;
                this.name = DiscordMessageAnalyzer.get_recruitment_text(this.message);
                this.owner_id = message_user_id;
                logger_1.logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);
                // recruitmentis valid
                this.valid = true;
                // token is setted after
                this.token = '';
                // analyze limit_time and max_member
                this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message) || this.default_date;
                logger_1.logger.debug(`recruitment's target time : ${this.limit_time}`);
                this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                logger_1.logger.debug(`recruitment's target number : ${this.max_number}`);
                // initialize other values
                this.status = constants.STATUS_ENABLED;
                this.description = "";
                this.delete = false;
                // add owner info to participate members
                this.user_list.push(this.get_owner_participate());
                // ok
                resolve();
            }
            else if (DiscordMessageAnalyzer.check_edit(this.message) == true) {
                // edit command
                logger_1.logger.info(`target message is editing. : mes = ${this.message}`);
                this.type = constants.TYPE_EDIT;
                // try to load id from message id and owner id
                const recruitment_repo = new recruitement_1.RecruitmentRepository();
                const participate_repo = new participate_2.ParticipateRepository();
                recruitment_repo.get_m_recruitment_by_message_id(reference.message_id, message_user_id)
                    .then((recruitment) => {
                    logger_1.logger.info(`loaded successful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                    this.set_recruitment(recruitment);
                    // edit attributes
                    this.name = DiscordMessageAnalyzer.get_edit_text(this.message);
                    logger_1.logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);
                    // set limit time
                    this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message) || this.default_date;
                    logger_1.logger.debug(`recruitment's target time : ${this.limit_time}`);
                    // max number
                    this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                    logger_1.logger.debug(`recruitment's target number : ${this.max_number}`);
                    return participate_repo.get_t_participate(this.token);
                })
                    .then((user_list) => {
                    // load user
                    logger_1.logger.info(`loaded user list completed. count = ${user_list.length}`);
                    this.user_list = user_list;
                    // ok
                    resolve();
                })
                    .catch(() => {
                    logger_1.logger.info(`loaded unsuccessful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                    // ng
                    reject();
                });
            }
            else if (DiscordMessageAnalyzer.check_type_list(this.message) == true) {
                // show command
                logger_1.logger.info(`target message is listing. : mes = ${this.message}`);
                this.type = constants.TYPE_LIST;
                this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                // ng
                reject();
            }
            else {
                // this is not valid message
                logger_1.logger.info(`target message is not valid. : mes = ${this.message}`);
                this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                // edit attributes
                this.name = DiscordMessageAnalyzer.get_recruitment_text(this.message);
                // ng
                reject();
            }
        });
    }
    /**
     * 新規IDをインスタンスに適用します。
     * @param {number} new_id
     */
    set_id(new_id) {
        this.id = new_id;
        this.user_list.forEach((v) => {
            v.id = new_id;
        });
    }
    /**
     * 新規トークンをインスタンスに適用します。
     * @param {string} new_token
     */
    set_token(new_token) {
        this.token = new_token;
        this.user_list.forEach((v) => {
            v.token = new_token;
        });
    }
    /**
     * メッセージIDを設定します
     * @param new_id message id
     */
    set_message_id(new_id) {
        this.message_id = new_id;
    }
    /**
     * 募集オブジェクトをAnalyzerに設定します
     * @param v 募集オブジェクト
     */
    set_recruitment(v) {
        this.id = v.id;
        this.server_id = v.server_id;
        this.message_id = v.message_id;
        this.token = v.token;
        this.status = v.status;
        this.limit_time = v.limit_time;
        this.name = v.name;
        this.owner_id = v.owner_id;
        this.description = v.description;
        this.delete = v.delete;
        this.user_list = v.user_list;
    }
    /**
     * Analyzerの結果を募集オブジェクトとして返却します。
     * 募集が有効でない場合はundefinedが帰ります。
     * @returns {Recruitment} 募集オブジェクト
     */
    get_recruitment() {
        const recruitment = new recruitment_1.Recruitment();
        recruitment.id = this.id;
        recruitment.server_id = this.server_id;
        recruitment.message_id = this.message_id;
        recruitment.token = this.token;
        recruitment.status = this.status;
        recruitment.limit_time = this.limit_time;
        recruitment.name = this.name;
        recruitment.owner_id = this.owner_id;
        recruitment.description = this.description;
        recruitment.delete = this.delete;
        // insert user list
        recruitment.user_list = this.user_list;
        return recruitment;
    }
    /**
     * 募集主の参加情報を返却します。
     * @returns {Participate} 参加オブジェクト
     */
    get_owner_participate() {
        const participate = new participate_1.Participate();
        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.owner_id;
        participate.description = this.description;
        participate.delete = this.delete;
        return participate;
    }
    /**
     * 指定メッセージを切り出して返却する
     * @param {string} mes
     * @param {string | undefined} regexp
     */
    static extract_by_regexp(mes, regexp) {
        let result = undefined;
        // create RegExp from params
        const re = new RegExp(regexp, 'g');
        const re_result = re.exec(mes);
        // if include message return this
        if (re_result !== null && re_result.length > 0) {
            result = re_result[0];
        }
        return result;
    }
    /**
     * 時刻を認識し、日時オブジェクトを返却します
     * @param {string} mes
     * @returns {Date | undefined}
     */
    static get_recruitment_time(mes) {
        // needed variables
        let hour = undefined;
        let minute = undefined;
        // check1
        var re_result = mes.match(/(\d{2})[:]{0,1}(\d{2})/);
        if (re_result != undefined && re_result != null && re_result.length > 2) {
            hour = re_result[1];
            minute = re_result[2];
        }
        // if failed check 1
        if (hour === undefined || minute === undefined) {
            // check2
            re_result = mes.match(/(\d{1,2})時/);
            if (re_result != undefined && re_result != null && re_result.length > 1) {
                hour = re_result[1];
                minute = '0';
            }
        }
        // if hour is 24, this is 0.
        if (hour == '24') {
            hour = '0';
        }
        // if include hour and minute return value
        if (hour === undefined || minute === undefined) {
            return undefined;
        }
        else {
            return DiscordMessageAnalyzer.get_recruitment_date(parseInt(hour), parseInt(minute));
        }
    }
    /**
     * 募集時間を求めます。
     * 募集時間が過ぎていたら翌日の募集とする。
     * @param {int} hour
     * @param {int} minute
     * @returns {Date}
     */
    static get_recruitment_date(hour, minute) {
        if (hour < 0 || hour > 23) {
            // error
            logger_1.logger.error(`hour is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }
        if (minute < 0 || minute > 59) {
            // error
            logger_1.logger.error(`minute is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }
        // set target date as TODAY
        let target_date = new Date();
        target_date.setHours(hour);
        target_date.setMinutes(minute);
        target_date.setSeconds(0);
        target_date.setMilliseconds(0);
        // compare time to now
        let now_date = new Date();
        // if target date is past, set tommorow
        if (target_date < now_date) {
            logger_1.logger.debug(`target date is past, add 1 date.`);
            target_date.setDate(target_date.getDate() + 1);
        }
        // return values
        return target_date;
    }
    /**
     * 参加人数を返却します
     * @param {string} mes
     * @returns {int}
     */
    static get_recruitment_numbers(mes) {
        // check1
        var re_result = mes.match(/@([0-9]{1,2})/);
        if (re_result != undefined && re_result != null && re_result.length > 1) {
            let num = re_result[1];
            return parseInt(num);
        }
        return undefined;
    }
    /**
     * メッセージが募集文であるかを確認します
     * @param {string} mes
     * @returns {boolean}
     */
    static check_recruitment(mes) {
        if (this.extract_by_regexp(mes, '^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]') === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * 募集文を取得します
     * @param {string}} mes
     * @returns {string}
     */
    static get_recruitment_text(mes) {
        return mes.replace(/^^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]/, "");
    }
    /**
     * メッセージがリストであるかを確認します
     * @param {string} mes
     * @returns {boolean}
     */
    static check_type_list(mes) {
        if (this.extract_by_regexp(mes, '^[ 　]*(リスト|一覧)') === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * メッセージが編集であるかを確認します
     * @param {string} mes
     * @returns {boolean}
     */
    static check_edit(mes) {
        if (this.extract_by_regexp(mes, '^[ 　]*(編集|へんしゅう)[^ 　]*[ 　]') === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * 編集文を取得します
     * @param {string}} mes
     * @returns {string}
     */
    static get_edit_text(mes) {
        return mes.replace(/^^[ 　]*(編集|へんしゅう)[^ 　]*[ 　]/, "");
    }
}
exports.DiscordMessageAnalyzer = DiscordMessageAnalyzer;
/**
 * 募集時間のデフォルト時間後
 */
DiscordMessageAnalyzer.HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;
/**
 * 募集のデフォルト人数
 */
DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT = constants.RECRUITMENT_DEFAULT_MAX_NUMBERS;
//# sourceMappingURL=discord_message_analyzer.js.map