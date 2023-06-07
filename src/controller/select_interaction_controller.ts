// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import discord modules
import * as Discord from 'discord.js';

// import controllers
import { SelectInteractionFriendCodeController } from './select_interaction_friend_code_controller';
import { SelectInteractionServerController } from './select_interaction_server_controller';

export class SelectInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction: Discord.SelectMenuInteraction) {
        try {
            if (interaction.customId == constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER) {
                SelectInteractionServerController.regist_server_master(interaction);
            } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                SelectInteractionFriendCodeController.regist_friend_code(interaction);
            } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
                SelectInteractionFriendCodeController.search_friend_code(interaction);
            } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST) == 0) {
                SelectInteractionFriendCodeController.delete_friend_code(interaction);
            } else {
                logger.error(`Interaction recieved, but command is invalid. command = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        } catch (err) {
            // send error message
            logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}