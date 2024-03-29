// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Participate } from '../entity/participate';

export class DiscordInteractionAnalyzer {

    // variables of analyzed value (in analyze method)
    id: number;
    token: string;
    status: number;
    user_id: string;
    valid: boolean;
    error_messages: string[];
    type: number;
    description: string;
    delete: boolean;

    /**
     * default recruitment time (copy from constants)
     */
    static HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;

    /**
     * constructor
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
     * analyze discord interaction, save data to this instance.
     * @param custom_id recruitment id
     * @param user_id discord bot's id
     */
    async analyze(custom_id: string, user_id: string): Promise<DiscordInteractionAnalyzer> {
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
            logger.debug(`interaction is valid. type = ${constants.TYPE_VIEW}`);
            this.type = constants.TYPE_VIEW;
            this.delete = false;

            // change status
            this.status = constants.STATUS_VIEW;

            // get token from custom id
            this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX);
        } else if (custom_id.match(new RegExp(`^${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}`))) {
            logger.debug(`interaction is valid. type = ${constants.TYPE_DECLINE}`);
            this.type = constants.TYPE_DECLINE;
            this.delete = true;

            // status
            this.status = constants.STATUS_DISABLED;

            // get token from custom id
            this.token = this.get_token(custom_id, constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX);
        } else {
            // error
            logger.error(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
            this.error_messages.push(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);

            // this is not valid interaction.
            this.valid = false;

            // analyze result is ng, reject
            throw new Error(`this interaction dosen't match join recruitment. : customId = ${custom_id}`);
        }

        // this is valid interaction.
        this.valid = true;
        logger.info(`this is valid interaction. token = ${this.token}`);

        // set valiables
        this.user_id = user_id;
        this.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;

        // resolve
        return this;
    }

    /**
     * save new recruitment's id
     * @param new_id 
     */
    set_id(new_id: number) {
        this.id = new_id;
    }

    /**
     * save new recruitment's token
     * @param {string} new_token 
     */
    set_token(new_token: string) {
        this.token = new_token;
    }

    /**
     * extract token from discord interaction button's id
     * @param custom_id button's id
     * @returns extracted token
     */
    get_token(custom_id: string, token_prefix: string): string {
        const token_regexp = new RegExp(`^${token_prefix}(.+)$`);
        let match_result = custom_id.match(token_regexp);

        if (match_result === null || match_result.length < 2) {
            return constants.ERROR_RECRUITMENT_TOKEN;
        } else {
            return match_result[1] || '';
        }
    }

    /**
     * get analyze result
     * @returns participate instance
     */
    get_join_participate(): Participate {
        const participate = new Participate();

        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.user_id;
        participate.description = this.description;
        participate.delete = this.delete;

        return participate;
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
            return DiscordInteractionAnalyzer.get_recruitment_date(parseInt(hour), parseInt(minute));
        }
    }

    /**
     * analyze recruitment limit time
     * if already passwd today's ${hour}:${minute}, return tommorow's date
     * if not set base_date, base_date is set to today(now).
     * @param hour 
     * @param minute 
     * @param base_date
     * @returns recruitment's limit date
     */
    static get_recruitment_date(hour: number, minute: number, base_date: Date = new Date()): Date | undefined {
        if (hour < 0 || hour > 24) {
            // error
            logger.error(`hour is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }

        if (minute < 0 || minute > 59) {
            // error
            logger.error(`minute is out of range, return undefined. : hour = ${hour}, minute = ${minute}`);
            return undefined;
        }

        // if hour is 24, set to 0
        if (hour == 24) {
            hour = 0;
        }

        // set target date as TODAY
        let dest_date: Date = new Date(base_date.getTime());
        dest_date.setHours(hour);
        dest_date.setMinutes(minute);
        dest_date.setSeconds(0);
        dest_date.setMilliseconds(0);

        // if target date is past, set tommorow
        if (dest_date.getTime() < base_date.getTime()) {
            logger.debug(`target date is past, add 1 date.`);
            dest_date.setDate(dest_date.getDate() + 1);
        }

        // return values
        return dest_date;
    }
}