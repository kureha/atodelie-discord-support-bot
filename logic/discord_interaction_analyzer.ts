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
    analyze(custom_id: string, user_id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
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

                // this is not valid interaction.
                this.valid = false;

                // ng
                reject();

                return;
            }

            // this is valid interaction.
            this.valid = true;
            logger.info(`this is valid interaction. token = ${this.token}`);

            // set valiables
            this.user_id = user_id;
            this.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;

            // ok
            resolve();
        });
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
}