// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import controllers
import { ButtonInteractionRecruitmentController } from './button_interaction_recruitment_controller';

// create message modules
import { DiscordMessage } from '../logic/discord_message';

// import discord modules
import * as Discord from 'discord.js';

export class ButtonInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param interaction discord interaction
     */
    static recieve(interaction: Discord.ButtonInteraction) {
        try {
            if (this.check_recruitment_interaction(interaction.customId)) {
                ButtonInteractionRecruitmentController.recruitment_interaction(interaction);
            } else {
                logger.error(`Interaction recieved, but custom_id is invalid. custom_id = ${interaction.customId}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        } catch (err) {
            // send error message
            interaction.reply({
                content: `${DiscordMessage.get_no_recruitment()} (Error: ${err})`,
                ephemeral: true,
            });
        }
    }

    /**
     * check interaction is recruitment button interaction.
     * @param custom_id interaction custum id
     * @returns 
     */
    static check_recruitment_interaction(custom_id: string): boolean {
        // is recruitment interaction button
        if (custom_id.indexOf(constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX) == 0 ||
            custom_id.indexOf(constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX) == 0 ||
            custom_id.indexOf(constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX) == 0) {
            return true;
        }

        // is not recruitment interaction
        return false;
    }
}