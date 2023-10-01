// define logger
import { logger } from './../common/logger';

// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from './../common/constants';
const constants = new Constants();

export class MessageSuggestRecruitmentController {
    /**
     * Judge message is suggest
     * @param client_id 
     * @param message 
     * @returns 
     */
    is_suggest_command(client_id: string, message: Discord.Message): boolean {
        let result: boolean = false;


        return result;
    }

    /**
     * Judge contains time string
     * @param message 
     * @returns 
     */
    is_contain_timestring(message: string): boolean {
        // define ret
        let result: boolean = false;

        // time regexp
        const time_re: RegExp = /([01][0-9]|2[0-3])[:]{0,1}([0-5][0-9])/;

        // execution match
        const match_result: RegExpMatchArray | null = message.match(time_re);

        if (match_result !== null && match_result.length > 0) {
            result = true;
        }

        // return result
        return result;
    }
}