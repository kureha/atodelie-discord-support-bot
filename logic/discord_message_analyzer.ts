// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Recruitment } from '../entity/recruitment';
import { Participate } from '../entity/participate';
import { Reference } from '../entity/reference';

import { RecruitmentRepository } from '../db/recruitement';
import { ParticipateRepository } from '../db/participate';

export class DiscordMessageAnalyzer {

    /**
     * default recruitment time
     */
    static HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;

    /**
     * default recruitment member count
     */
    static MAX_NUMBERS_DEFAULT = constants.RECRUITMENT_DEFAULT_MAX_NUMBERS;

    /**
     * inputed message
     */
    message: string;

    // variables of analyzed value (in analyze method)
    id: number;
    server_id: string;
    message_id: string;
    thread_id: string;
    token: string;
    status: number;
    limit_time: Date;
    name: string;
    owner_id: string;
    valid: boolean;
    error_messages: string[];
    type: number;
    max_number: number;
    description: string;
    delete: boolean;
    user_list: Participate[];

    default_date: Date;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        // remove user.id from message
        this.message = '';

        // copy server id
        this.server_id = '';

        // initialize variables
        this.message_id = '';
        this.thread_id = '';
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

        // default limit date
        this.default_date = new Date();
        this.default_date.setHours(this.default_date.getHours() + DiscordMessageAnalyzer.HOURS_DEFAULT);
    }

    /**
     * analyze discord message, save data to this instance.
     * @param mes discord message
     * @param server_id discord server id
     * @param message_user_id discord message's sender id
     * @param user_id discord bot's id
     * @param reference message reference object (if exists when edit ... reply)
     */
    analyze(mes: string, server_id: string, message_user_id: string, user_id: string, reference: Reference): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // remove user.id from message
            this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");

            // copy server id
            this.server_id = server_id;

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
                this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message, constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || this.default_date;
                logger.debug(`recruitment's target time : ${this.limit_time}`);

                this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                logger.debug(`recruitment's target number : ${this.max_number}`);

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
                logger.info(`target message is editing. : mes = ${this.message}`);
                this.type = constants.TYPE_EDIT;

                // try to load id from message id and owner id
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
                recruitment_repo.get_m_recruitment_by_message_id(reference.message_id, message_user_id)
                    .then((recruitment: Recruitment) => {
                        logger.info(`loaded successful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                        this.set_recruitment(recruitment);

                        // edit attributes
                        this.name = DiscordMessageAnalyzer.get_edit_text(this.message);
                        logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);

                        // set limit time
                        this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(this.message, constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || this.default_date;
                        logger.debug(`recruitment's target time : ${this.limit_time}`);

                        // max number
                        this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                        logger.debug(`recruitment's target number : ${this.max_number}`);

                        return participate_repo.get_t_participate(this.token);
                    })
                    .then((user_list: Participate[]) => {
                        // load user
                        logger.info(`loaded user list completed. count = ${user_list.length}`);
                        this.user_list = user_list;

                        // ok
                        resolve();
                    })
                    .catch(() => {
                        logger.info(`loaded unsuccessful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                        this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);

                        // ng
                        reject();
                    })
            }
            else if (DiscordMessageAnalyzer.check_delete(this.message) == true) {
                // edit command
                logger.info(`target message is delete. : mes = ${this.message}`);
                this.type = constants.TYPE_DELETE;

                // try to load id from message id and owner id
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
                recruitment_repo.get_m_recruitment_by_message_id(reference.message_id, message_user_id)
                    .then((recruitment: Recruitment) => {
                        logger.info(`loaded successful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                        this.set_recruitment(recruitment);

                        // edit attributes
                        this.name = DiscordMessageAnalyzer.get_delete_text(this.message);
                        logger.debug(`recruitment's name, owner_id : name = ${this.name}, owner_id = ${message_user_id}`);

                        // delete flag true
                        this.delete = true;

                        return participate_repo.get_t_participate(this.token);
                    })
                    .then((user_list: Participate[]) => {
                        // load user
                        logger.info(`loaded user list completed. count = ${user_list.length}`);
                        this.user_list = user_list;

                        // ok
                        resolve();
                    })
                    .catch(() => {
                        logger.info(`loaded unsuccessful. message_id : ${reference.message_id}, owner_id = ${message_user_id}`);
                        this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);

                        // ng
                        reject();
                    })
            }
            else if (DiscordMessageAnalyzer.check_type_list(this.message) == true) {
                // show command
                logger.info(`target message is listing. : mes = ${this.message}`);
                this.type = constants.TYPE_LIST;
                this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);

                // ng
                reject();
            }
            else if (DiscordMessageAnalyzer.check_regist_master(this.message) == true) {
                // regist command
                logger.info(`target message is regist master. : mes = ${this.message}`);

                // check id
                if (message_user_id == constants.DISCORD_BOT_ADMIN_USER_ID) {
                    this.type = constants.TYPE_REGIST_MAETER;

                    // extract user id
                    let user_id_list: string[] = DiscordMessageAnalyzer.extract_mention_id_list(this.message);
                    user_id_list.forEach((v) => {
                        if (v != user_id) {
                            logger.info(`extracted message target id. : id = ${v}`);
                            this.owner_id = v;
                        }
                    });

                    // ok
                    resolve();
                } else {
                    logger.warn(`target user is not admin, can't execute regist master. : message_user_id = ${message_user_id}`);
                    this.error_messages.push(constants.DISCORD_MESSAGE_NO_PERMISSION);

                    // ng
                    reject();
                }
            }
            else if (DiscordMessageAnalyzer.check_user_info_list_get(this.message) == true) {
                // user info list get command
                logger.info(`target message is user info get. : mes = ${this.message}`);
                this.type = constants.TYPE_USER_INFO_LIST_GET;

                // ok
                resolve();
            }
            else {
                // this is not valid message
                logger.info(`target message is not valid. : mes = ${this.message}`);
                this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);

                // edit attributes
                this.name = DiscordMessageAnalyzer.get_recruitment_text(this.message);

                // ng
                reject();
            }
        });
    }

    /**
     * save new recruitment's id
     * @param new_id recruitment's id
     */
    set_id(new_id: number) {
        this.id = new_id;
        this.user_list.forEach((v) => {
            v.id = new_id;
        })
    }

    /**
     * save new recruitment's token
     * @param new_token token
     */
    set_token(new_token: string) {
        this.token = new_token;
        this.user_list.forEach((v) => {
            v.token = new_token;
        })
    }

    /**
     * save new message id
     * @param new_id message id
     */
    set_message_id(new_id: string) {
        this.message_id = new_id;
    }

    /**
     * save new thread id
     * @param new_id thread id
     */
    set_thread_id(new_id: string) {
        this.thread_id = new_id;
    }

    /**
     * set recruitment instance to this instance
     * @param recruitment
     */
    set_recruitment(recruitment: Recruitment) {
        this.id = recruitment.id;
        this.server_id = recruitment.server_id;
        this.message_id = recruitment.message_id;
        this.thread_id = recruitment.thread_id;
        this.token = recruitment.token;
        this.status = recruitment.status;
        this.limit_time = recruitment.limit_time;
        this.name = recruitment.name;
        this.owner_id = recruitment.owner_id;
        this.description = recruitment.description;
        this.delete = recruitment.delete;

        this.user_list = recruitment.user_list;
    }

    /**
     * get analyze result
     * @returns recruitment instance
     */
    get_recruitment(): Recruitment {
        const recruitment = new Recruitment();

        recruitment.id = this.id;
        recruitment.server_id = this.server_id;
        recruitment.message_id = this.message_id;
        recruitment.thread_id = this.thread_id;
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
     * get analyze result of recruitment owner's information by participate instance
     * @returns participate instance
     */
    get_owner_participate(): Participate {
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
     * extract message by regexp
     * @param mes message
     * @param regexp regexp's string
     */
    static extract_by_regexp(mes: string, regexp: string): string | undefined {
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
     * replace full-width digit character to half-width digit character
     * @param str target str
     * @returns replaced string
     */
    static remove_full_wide_digits(str: string): string {
        // define replace 2-byte digit chars to 1-byte digit chars
        const replace_digits: { [index: string]: string } = { '０': '0', '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7', '８': '8', '９': '9' }

        // define regexp
        const replace_regexp = new RegExp('(' + Object.keys(replace_digits).join('|') + ')', 'g');

        // return values
        return str.replace(replace_regexp, (match: string, args: any[]) => {
            return replace_digits[match] || Constants.STRING_EMPTY;
        });
    }

    /**
     * extract date string and convert date object
     * @param raw_mes message
     * @returns recruitment's limit date
     */
    static get_recruitment_time(raw_mes: string, except_list: string[] = []): Date | undefined {
        // needed variables
        let hour = undefined;
        let minute = undefined;

        // replace full-width digits
        let mes: string = this.remove_full_wide_digits(raw_mes)

        // remove except words
        except_list.forEach(v => {
            mes = mes.replace(v, '');
        });

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
     * analyze recruitment limit time
     * if already passwd today's ${hour}:${minute}, return tommorow's date
     * @param hour 
     * @param minute 
     * @returns recruitment's limit date
     */
    static get_recruitment_date(hour: number, minute: number): Date | undefined {
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
     * analyze recruitment member count
     * @param mes message
     * @returns recruitment member count. if member is not valid, return undefined.
     */
    static get_recruitment_numbers(mes: string): number | undefined {
        // check1
        var re_result = mes.match(/@([0-9]{1,2})/);
        if (re_result != undefined && re_result != null && re_result.length > 1) {
            let num = re_result[1];
            return parseInt(num || '0');
        }

        return undefined;
    }

    /**
     * check message is new recruitment
     * @param mes message
     * @returns 
     */
    static check_recruitment(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_NEW_RECRUITMENT})[^ 　]*[ 　]`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * get message of new recruitment
     * @param mes message
     * @returns 
     */
    static get_recruitment_text(mes: string): string {
        return mes.replace(new RegExp(`^^[ 　]*(${constants.DISCORD_COMMAND_NEW_RECRUITMENT})[^ 　]*[ 　]`), "");
    }

    /**
     * check message is listing recruitment
     * @param mes message
     * @returns 
     */
    static check_type_list(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_LIST_RECRUITMENT})`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * check message is edit recruitment
     * @param mes message
     * @returns 
     */
    static check_edit(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_EDIT_RECRUITMENT})[^ 　]*[ 　]`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * get message of edit recruitment
     * @param mes message
     * @returns 
     */
    static get_edit_text(mes: string): string {
        return mes.replace(new RegExp(`^^[ 　]*(${constants.DISCORD_COMMAND_EDIT_RECRUITMENT})[^ 　]*[ 　]`), "");
    }

    /**
     * check message is cancel recruitment
     * @param mes message
     * @returns 
     */
    static check_delete(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_DELETE_RECRUITMENT})[^ 　]*[ 　]`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * get message of cancel recruitment
     * @param mes message
     * @returns 
     */
    static get_delete_text(mes: string): string {
        return mes.replace(new RegExp(`^^[ 　]*(${constants.DISCORD_COMMAND_DELETE_RECRUITMENT})[^ 　]*[ 　]`), "");
    }

    /**
     * check message is regist master
     * @param mes message
     * @returns 
     */
    static check_regist_master(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_REGIST_MASTER})[^ 　]*[ 　]`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * check message is user info list get
     * @param mes message
     * @returns 
     */
    static check_user_info_list_get(mes: string): boolean {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), `^[ 　]*(${constants.DISCORD_COMMAND_USER_INFO_LIST_GET})`) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * extract mention id from message
     * @param mes 
     * @returns mention id list
     */
    static extract_mention_id_list(mes: string): string[] {
        let result_list: string[] = [];

        let extract_id = new RegExp('<@&(\\d+)>', 'g');
        let temp_id: RegExpExecArray | null = null;
        while ((temp_id = extract_id.exec(mes)) !== null) {
            if (temp_id[1]) {
                result_list.push(temp_id[1]);
            }
        }

        return result_list;
    }
}