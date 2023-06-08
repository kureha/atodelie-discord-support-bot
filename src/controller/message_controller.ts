// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from './../common/constants';

// import controller
import { MessageRegistCommandController } from './message_regist_command_controller';

export class MessageController {

    /**
     * Controller main method.
     * @param message 
     * @param client_id 
     */
    static async recirve(message: Discord.Message<boolean>, client_id: string = Constants.STRING_EMPTY) {
        const controller = new MessageRegistCommandController();
        if (controller.is_regist_command(client_id, message)) {
            await controller.regist_command(message, client_id);
        }
    }
}