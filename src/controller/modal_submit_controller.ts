// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import controllers
import { ModalSubmitRecruitmentController } from './modal_submit_recruitment_controller';
import { ModalSubmitFriendCodeController } from './modal_submit_friend_code_controller';
import { ModalSubmitGameMasterController } from './modal_submit_game_master_controller';

export class ModalSubmitController {
    /**
     * Controller main method.
     * @param interaction 
     */
    static async recieve(interaction: Discord.ModalSubmitInteraction) {
        if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT) {
            const controller = new ModalSubmitRecruitmentController();
            await controller.regist(interaction);
        } else if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT) {
            const controller = new ModalSubmitRecruitmentController();
            await controller.edit(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE) >= 0) {
            const controller = new ModalSubmitFriendCodeController();
            await controller.regist(interaction);
        } else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER) >= 0) {
            const controller = new ModalSubmitGameMasterController();
            await controller.regist(interaction);
        } else {
            logger.error(`Modal submit recieved, but custom id is invalid. custom id = ${interaction.customId}`);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
        }
    }
}