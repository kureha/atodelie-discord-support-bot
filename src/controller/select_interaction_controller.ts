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
import { SelectInteractionGameMasterController } from './select_interaction_game_master_controller';

export class SelectInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static async recieve(interaction: Discord.SelectMenuInteraction) {
        if (interaction.customId == constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER) {
            const controller = new SelectInteractionServerController();
            await controller.regist_server_master(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_REGIST_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
            const controller = new SelectInteractionFriendCodeController();
            await controller.regist_friend_code(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_SEARCH_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
            const controller = new SelectInteractionFriendCodeController();
            await controller.search_friend_code(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_DELETE_FRIEND_CODE_BY_GAME_NAME_LIST) >= 0) {
            const controller = new SelectInteractionFriendCodeController();
            await controller.delete_friend_code(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_SELECT_MENU_CUSTOM_ID_FOR_EDIT_GAME_MASTER_BY_GAME_NAME_LIST) >= 0) {
            const controller = new SelectInteractionGameMasterController();
            await controller.edit_game_master(interaction);
        } else {
            logger.error(`Interaction recieved, but command is invalid. command = ${interaction.customId}`);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
        }
    }
}