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

export class ModalSubmitController {
    /**
     * Controller main method.
     * @param interaction 
     */
    static recieve(interaction: Discord.ModalSubmitInteraction) {
        try {
            if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT) {
                ModalSubmitRecruitmentController.regist(interaction);
            } else if (interaction.customId == constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT) {
                ModalSubmitRecruitmentController.edit(interaction);
            } else if (interaction.customId.indexOf(constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE) >= 0) {
                ModalSubmitFriendCodeController.regist(interaction);
            } else {
                logger.error(`Modal submit recieved, but custom id is invalid. custom id = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        } catch (err) {
            logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}