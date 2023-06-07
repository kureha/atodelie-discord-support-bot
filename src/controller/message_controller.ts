// define logger
import { logger } from './../common/logger';

// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from './../common/constants';
const constants = new Constants();

// import controller
import { MessageRegistCommandController } from './message_regist_command_controller';

export class MessageController {

    /**
     * Controller main method.
     * @param message 
     * @param client_id 
     */
    static recirve(message: Discord.Message<boolean>, client_id: string = Constants.STRING_EMPTY) {
        try {
            if (MessageRegistCommandController.is_regist_command(client_id, message)) {
                MessageRegistCommandController.regist_command(message, client_id);
            }
        } catch (err) {
            logger.error(err);
            message.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}