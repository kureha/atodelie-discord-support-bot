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
import { CommandGameMasterController } from './command_game_master_controller';

export class CommandController {
    /**
     * Controller main method.
     * @param interaction 
     */
    static async recieve(interaction: Discord.ChatInputCommandInteraction) {
        if (interaction.commandName == constants.DISCORD_COMMAND_NEW_RECRUITMENT) {
            const controller = new CommandRecruitmentController();
            await controller.new_recruitment_input_modal(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_RECRUITMENT) {
            const controller = new CommandRecruitmentController();
            await controller.edit_recruitment_input_modal(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_RECRUITMENT) {
            const controller = new CommandRecruitmentController();
            await controller.delete_recruitment(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_USER_INFO_LIST_GET) {
            const controller = new CommandExportController();
            await controller.export_user_info(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_MASTER) {
            const controller = new CommandServerController();
            await controller.regist_server_master(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE) {
            const controller = new CommandFriendCodeController();
            await controller.search_friend_code(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_REGIST_FRIEND_CODE) {
            const controller = new CommandFriendCodeController();
            await controller.regist_friend_code(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_DELETE_FRIEND_CODE) {
            const controller = new CommandFriendCodeController();
            await controller.delete_friend_code(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_EDIT_GAME_MASTER) {
            const controller = new CommandGameMasterController();
            await controller.select_game_master_for_edit_game_master(interaction);
        } else if (interaction.commandName == constants.DISCORD_COMMAND_RESET_GAME_MASTER) {
            const controller = new CommandGameMasterController();
            await controller.select_game_master_for_reset_game_master(interaction);
        } else {
            logger.error(`Interaction recieved, but command is invalid. command = ${interaction.commandName}`);
            await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
        }
    }
}