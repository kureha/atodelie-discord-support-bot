// define logger
import {logger} from '../common/logger';

// import constants
import {Constants} from '../common/constants';
const constants = new Constants();

// import entities
import {Recruitment} from '../entity/recruitment';
import {Participate} from '../entity/participate';

export class DiscordMessageAnalyzer {

    /**
     * 募集時間のデフォルト時間後
     */
    static HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;

    /**
     * 募集のデフォルト人数
     */
    static MAX_NUMBERS_DEFAULT = constants.RECRUITMENT_DEFAULT_MAX_NUMBERS;

    // 解析対象のメッセージ
    message : string;

    // 解析結果を格納する変数
    id : number;
    server_id : string;
    message_id : string;
    token : string;
    status : number;
    limit_time : Date;
    name : string;
    owner_id : string;
    valid : boolean;
    error_messages : string[];
    type : number;
    max_number : number;
    description : string;
    delete : boolean;
    user_list : Participate[];
    
    /**
     * メッセージを解析し、解析結果を返却する
     * @param {string} mes メッセージ本体
     * @param {string} message_user_id メッセージを送信したユーザID
     * @param {string} user_id botのDiscordユーザID
     * @constructor
     */
    constructor(mes : string, server_id : string, message_user_id : string, user_id : string) {
        // remove user.id from message
        this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");

        // copy server id
        this.server_id = server_id;
        
        // initialize variables
        this.message_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = Constants.get_default_date();
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

        // error messages
        let error_messages_list = [];

        // default limit date
        let default_date = new Date();
        default_date.setHours(default_date.getHours() + DiscordMessageAnalyzer.HOURS_DEFAULT);

        // detect recruitment
        if (DiscordMessageAnalyzer.check_recruitment(this.message) == true) {
            logger.info(`target message is new recruitment. : mes = ${this.message}`);
            this.type = constants.TYPE_RECRUITEMENT;
            this.name = DiscordMessageAnalyzer.get_recruitment_text(this.message);
            this.owner_id = message_user_id;
            logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);

            // recruitmentis valid
            this.valid = true;

            // token is setted after
            this.token = '';

            // analyze limit_time and max_member
            this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message) || default_date;
            logger.debug(`recruitment's target time : ${this.limit_time}`);

            this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
            logger.debug(`recruitment's target number : ${this.max_number}`);

            // initialize other values
            this.status = constants.STATUS_ENABLED;
            this.description = "";
            this.delete = false;

            // add owner info to participate members
            this.user_list.push(this.get_owner_participate());
        }
        else if (DiscordMessageAnalyzer.check_type_list(this.message) == true) {
            // show command
            logger.info(`target message is listing. : mes = ${this.message}`);
            this.type = constants.TYPE_LIST;
        }
        else {
            // this is not valid message
            logger.info(`target message is not valid. : mes = ${this.message}`);
            error_messages_list.push(constants.DISCORD_MESSAGE_IS_INVALID);
        }

        // set error messages if not valied
        if (this.valid === false) {
            this.error_messages = error_messages_list;
        }
    }

    /**
     * 新規IDをインスタンスに適用します。
     * @param {number} new_id 
     */
    set_id(new_id : number) {
        this.id = new_id;
        this.user_list.forEach((v) => {
            v.id = new_id;
        })
    }
    
    /**
     * 新規トークンをインスタンスに適用します。
     * @param {string} new_token 
     */
     set_token(new_token : string) {
        this.token = new_token;
        this.user_list.forEach((v) => {
            v.token = new_token;
        })
    }

    /**
     * メッセージIDを設定します
     * @param new_id message id
     */
    set_message_id(new_id : string) {
        this.message_id = new_id;
    }

    /**
     * Analyzerの結果を募集オブジェクトとして返却します。
     * 募集が有効でない場合はundefinedが帰ります。
     * @returns {Recruitment} 募集オブジェクト
     */
    get_recruitment() {
        const recruitment = new Recruitment();
        
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
        const participate = new Participate();

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
    static extract_by_regexp(mes : string, regexp : string) : string | undefined {
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
    static get_recruitment_time(mes : string) : Date | undefined {
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
            re_result = mes.match(/(\d{1,2})時/)
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
        } else {
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
    static get_recruitment_date(hour : number, minute : number) {
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
        let target_date = new Date();
        target_date.setHours(hour);
        target_date.setMinutes(minute);
        target_date.setSeconds(0);
        target_date.setMilliseconds(0);

        // compare time to now
        let now_date = new Date();

        // if target date is past, set tommorow
        if (target_date < now_date) {
            logger.debug(`target date is past, add 1 date.`);
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
    static get_recruitment_numbers(mes : string) {
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
    static check_recruitment(mes : string) {
        if (this.extract_by_regexp(mes, '^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 募集文を取得します
     * @param {string}} mes 
     * @returns {string}
     */
    static get_recruitment_text(mes : string) {
        return mes.replace(/^^[ 　]*(募集|ぼしゅう)[^ 　]*[ 　]/, "");
    }

    /**
     * メッセージがリストであるかを確認します
     * @param {string} mes 
     * @returns {boolean}
     */
    static check_type_list(mes : string) {
        if (this.extract_by_regexp(mes, '^[ 　]*(リスト|一覧)') === undefined) {
            return false;
        } else {
            return true;
        }
    }
}