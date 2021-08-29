"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessageAnalyzer = void 0;
// ロガーを定義
const logger_1 = require("../common/logger");
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// エンティティ有効化
const recruitment_1 = require("../entity/recruitment");
const participate_1 = require("../entity/participate");
class DiscordMessageAnalyzer {
    /**
     * メッセージを解析し、解析結果を返却する
     * @param {string} mes メッセージ本体
     * @param {string} message_user_id メッセージを送信したユーザID
     * @param {string} user_id botのDiscordユーザID
     * @constructor
     */
    constructor(mes, server_id, message_user_id, user_id) {
        // user.idは消去しメッセージを格納
        this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");
        // サーバIDを格納
        this.server_id = server_id;
        // 各種変数の初期化
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.max_number = DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
        this.description = '';
        this.delete = true;
        // 募集の有効無効を示す
        this.valid = false;
        this.id = 0;
        this.error_messages = [];
        this.type = constants.TYPE_INIT;
        // 参加者一覧を示す変数
        this.user_list = [];
        // エラーメッセージ格納用配列（一時的）
        let error_messages_list = [];
        // 現在時刻
        let default_date = new Date();
        default_date.setHours(default_date.getHours() + DiscordMessageAnalyzer.HOURS_DEFAULT);
        // 募集検知
        if (DiscordMessageAnalyzer.check_recruitment(this.message) == true) {
            logger_1.logger.info(`target message is new recruitment. : mes = ${this.message}`);
            this.type = constants.TYPE_RECRUITEMENT;
            this.name = DiscordMessageAnalyzer.get_recruitment_text(this.message);
            this.owner_id = message_user_id;
            logger_1.logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);
            // 有効メッセージと認識
            this.valid = true;
            // tokenは後で算出するため空文字となる
            this.token = '';
            // 以下は可能なら切り出す…　時間指定と人数指定
            this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message) || default_date;
            logger_1.logger.debug(`recruitment's target time : ${this.limit_time}`);
            this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
            logger_1.logger.debug(`recruitment's target number : ${this.max_number}`);
            // その他必要な値を付与
            this.status = constants.STATUS_ENABLED;
            this.description = "";
            this.delete = false;
            // ユーザリストにオーナーの情報を追加
            this.user_list.push(this.get_owner_participate());
        }
        else if (DiscordMessageAnalyzer.check_type_list(this.message) == true) {
            // 一覧表示
            logger_1.logger.info(`target message is listing. : mes = ${this.message}`);
            this.type = constants.TYPE_LIST;
        }
        else {
            // どのメッセージでもない
            logger_1.logger.info(`target message is not valid. : mes = ${this.message}`);
            error_messages_list.push(constants.DISCORD_MESSAGE_IS_INVALID);
        }
        // エラーメッセージを必要日応じて格納する
        if (this.valid === false) {
            this.error_messages = error_messages_list;
        }
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
     * Analyzerの結果を募集オブジェクトとして返却します。
     * 募集が有効でない場合はundefinedが帰ります。
     * @returns {Recruitment} 募集オブジェクト
     */
    get_recruitment() {
        const recruitment = new recruitment_1.Recruitment();
        recruitment.id = this.id;
        recruitment.server_id = this.server_id;
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
     * @param {string} regexp
     */
    static extract_by_regexp(mes, regexp) {
        var result = undefined;
        if (typeof (mes) == "string") {
            // ok
        }
        else {
            return undefined;
        }
        // 正規表現の解析を使用
        const re = new RegExp(regexp, 'g');
        const re_result = re.exec(mes);
        // 結果が含まれる場合それを返す
        if (re_result !== null && re_result.length > 0) {
            result = re_result[0];
        }
        return result;
    }
    /**
     * 時刻を認識し、日時オブジェクトを返却します
     * @param {string} mes
     * @returns {Date}
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
        // hourが24の場合は0として扱う
        if (hour == '24') {
            hour = '0';
        }
        // 値をチェックし、有効であれば値を返します
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
        // 既にその時間は通過したので、次の日を対象とする
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