// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import child controllers
import { CommandRecruitmentController } from './command_recruitment_controller';
import { CommandFriendCodeController } from './command_friend_code_controller';
import { CommandServerController } from './command_server_controller';
import { CommandExportController } from './command_export_controller';

export class CommandController {
    /**
     * Controller main method.
     * @param interaction 
     */
    static recieve(interaction: Discord.ChatInputCommandInteraction) {
        try {
            if (interaction.commandName == constants.DISCORD_COMMAND_NEW_RECRUITMENT) {
                CommandRecruitmentController.new_recruitment_input_modal(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_RECRUITMENT) {
                CommandRecruitmentController.edit_recruitment_input_modal(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_RECRUITMENT) {
                CommandRecruitmentController.delete_recruitment(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_USER_INFO_LIST_GET) {
                CommandExportController.export_user_info(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_MASTER) {
                CommandServerController.regist_server_master(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE) {
                CommandFriendCodeController.search_friend_code(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_FRIEND_CODE) {
                CommandFriendCodeController.regist_friend_code(interaction);
            } else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_FRIEND_CODE) {
                CommandFriendCodeController.delete_friend_code(interaction);
            } else {
                logger.error(`Interaction recieved, but command is invalid. command = ${interaction.commandName}`);
                interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
            }
        } catch (err) {
            logger.error(err);
            interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
        }
    }
}