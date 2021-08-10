// create logger
const logger = require('./../common/logger');

// import constants
const Constants = require('./../common/constants');
const constants = new Constants();

module.exports = class DiscordAnalyzer {

    static HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;
    static MAX_NUMBERS_DEFAULT = constants.RECRUITMENT_DEFAULT_MAX_NUMBERS;

    /**
     * メッセージを解析し、解析結果を返却する
     * @param {string} mes メッセージ本体
     * @param {string} message_user_id メッセージを送信したユーザID
     * @param {string} user_id botのDiscordユーザID
     * @returns 解析結果オブジェクト
     */
    constructor(mes, server_id, message_user_id, user_id) {
        if (typeof (mes) == "string") {
            if (typeof (user_id) == "string") {
                // user.idは消去する
                this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");
            } else {
                logger.warn(`can't remove user id. : mes = ${mes}, user_id = ${user_id}`);
                this.message = mes;
            }
        } else {
            logger.error(`message is not string. : mes = ${mes}, server_id = ${server_id}`);
            return;
        }

        if (typeof (server_id) == "string") {
            this.server_id = server_id;
        } else {
            logger.error(`can't analyze server id. : mes = ${mes}, server_id = ${server_id}`);
            return;
        }

        // 募集の有効無効を示す
        this.valid = true;
        this.id = 0;
        this.error_messages = [];
        this.type = constants.TYPE_INIT;

        // 参加者一覧を示す変数
        this.user_list = [];

        // エラーメッセージ格納用配列（一時的）
        let error_messages_list = [];
        // 現在時刻
        let default_date = new Date();
        default_date.setHours(default_date.getHours() + DiscordAnalyzer.HOURS_DEFAULT);

        // 募集検知
        if (DiscordAnalyzer.check_recruitment(this.message) == true) {
            logger.info(`target message is new recruitment. : mes = ${this.message}`);
            this.type = constants.TYPE_RECRUITEMENT;
            this.name = DiscordAnalyzer.get_recruitment_text(this.message);
            this.owner_id = message_user_id;
            logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);

            // tokenは後で算出するため空文字となる
            this.token = '';

            // 以下は可能なら切り出す…　時間指定と人数指定
            this.limit_time = DiscordAnalyzer.get_recruitment_time(this.message);
            if (this.limit_time === undefined) {
                // 取得できない場合はデフォルト適用
                logger.debug(`target time is not found on message, apply default time. : ${default_date}`);
                this.limit_time = default_date.toISOString();
            }
            logger.debug(`recruitment's target time : ${this.limit_time}`);

            this.max_number = DiscordAnalyzer.get_recruitment_numbers(this.message);
            if (this.max_number === undefined) {
                // 取得できない場合はデフォルト適用
                logger.debug(`max members number is not found on message, apply default number. : ${DiscordAnalyzer.MAX_NUMBERS_DEFAULT}`);
                this.max_number = DiscordAnalyzer.MAX_NUMBERS_DEFAULT;
            }
            logger.debug(`recruitment's target number : ${this.max_number}`);

            // その他必要な値を付与
            this.status = constants.STATUS_ENABLED;
            // copy user id for participate registration.
            this.user_id = message_user_id;
            // create dummy user_list object (for emebed message)
            this.user_list.push({
                user_id: this.user_id,
                status: constants.STATUS_ENABLED,
                description: '',
                delete: false,
            });
            this.description = "";
            this.delete = false;
        }
        else if (DiscordAnalyzer.check_type_list(this.message) == true) {
            // 一覧表示
            logger.info(`target message is listing. : mes = ${this.message}`);
            this.type = constants.TYPE_LIST;
        }
        else {
            // どのメッセージでもない
            logger.info(`target message is not valid. : mes = ${this.message}`);
            this.valid = false;
            error_messages_list.push(constants.DISCORD_MESSAGE_IS_INVALID);
        }

        // エラーメッセージを必要日応じて格納する
        if (this.valid === false) {
            this.error_messages = error_messages_list;
        }
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
        } else {
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
     * @returns 
     */
    static get_recruitment_time(mes) {
        // needed variables
        var hour = undefined;
        var minute = undefined;

        // check1
        var re_result = mes.match(/(\d{2})[:]{0,1}(\d{2})/);
        if (re_result != undefined && re_result != null && re_result.length > 2) {
            hour = re_result[1];
            minute = re_result[2];
        }

        // if failed check 1
        if (hour === undefined || minute === undefined) {
            // check2
            re_result = mes.match(/(\d{1,2})時/)
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
        } else {
            return DiscordAnalyzer.get_recruitment_date(hour, minute).toISOString();
        }
    }

    /**
     * 募集時間を求めます。
     * 募集時間が過ぎていたら翌日の募集とする。
     * @param {int} hour 
     * @param {int} minute 
     */
    static get_recruitment_date(hour, minute) {
        if (hour < 0 || hour > 23) {
            // error
            logger.error(`hour is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }

        if (minute < 0 || minute > 59) {
            // error
            logger.error(`minute is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }

        // set target date as TODAY
        var target_date = new Date();
        target_date.setHours(hour);
        target_date.setMinutes(minute);
        target_date.setSeconds(0);
        target_date.setMilliseconds(0);

        // compare time to now
        var now_date = new Date();

        // 既にその時間は通過したので、次の日を対象とする
        if (target_date < now_date) {
            logger.debug(`target date is past, add 1 date.`);
            target_date.setDate(target_date.getDate() + 1);
        }

        // return values
        return target_date;
    }

    /**
     * 参加人数を返却します
     * @param {string}} mes 
     * @returns 
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
     * @returns 
     */
    static check_recruitment(mes) {
        if (this.extract_by_regexp(mes, '^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 募集文を取得します
     * @param {string}} mes 
     * @returns 
     */
    static get_recruitment_text(mes) {
        return mes.replace(/^^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]/, "");
    }

    /**
     * メッセージがリストであるかを確認します
     * @param {string} mes 
     */
    static check_type_list(mes) {
        if (this.extract_by_regexp(mes, '^[ 　]*(リスト|一覧)') === undefined) {
            return false;
        } else {
            return true;
        }
    }
}