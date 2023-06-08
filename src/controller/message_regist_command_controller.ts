// define logger
import { logger } from './../common/logger';

// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from './../common/constants';
const constants = new Constants();

// import logic
import { DiscordRegisterCommand } from "../logic/discord_register_command";
import { DiscordCommon } from '../logic/discord_common';

export class MessageRegistCommandController {
    /**
     * regist slash command to server.
     * @param message 
     * @param client_id 
     */
    async regist_command(message: Discord.Message<boolean>, client_id: string, is_check_privillege: boolean = true): Promise<boolean> {
        try {
            // check privilleges
            if (DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, message.client.user?.id, is_check_privillege) == true) {
                logger.info(`regist command privillege check ok. user id = ${message.client.user?.id}`);
            } else {
                logger.error(`regist command failed to privillege check. user id = ${message.client.user?.id}`);
                message.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);

                // resolve (no permissions)
                return false;
            }

            // call regist slash command logic
            const register_command: DiscordRegisterCommand = new DiscordRegisterCommand();
            const success_server_info = await register_command.regist_command(client_id);
            logger.info(`regist slash command successed. server info count = ${success_server_info.length}`);

            // reply message
            await message.reply(constants.DISCORD_MESSAGE_COMMAND_IS_REGIST);
        } catch (err) {
            logger.error(`regist slash command error.`, err);
            await message.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

            return false;
        }

        logger.info(`regist slash command completed.`);
        return true;
    }

    /**
     * Check message is regist command.
     * @param client_id 
     * @param message 
     * @returns 
     */
    is_regist_command(client_id: string, message: Discord.Message): boolean {
        // define result value
        let result = false;

        // check values
        if (message.mentions.users.has(client_id) && message.content.indexOf(constants.DISCORD_COMMAND_REGIST_COMMAND) > 0) {
            logger.info(`recieved message is regist command. message = ${message.content}`);
            result = true;
        }

        // return result
        return result;
    }
}
