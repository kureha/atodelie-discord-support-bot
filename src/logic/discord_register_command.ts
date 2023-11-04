// import discord modules
import * as Discord from 'discord.js';
import { REST } from '@discordjs/rest';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import databace access modules
import { ServerInfoRepository } from '../db/server_info';

// import entities
import { ServerInfo } from '../entity/server_info';

// import logger
import { logger } from '../common/logger';

export class DiscordRegisterCommand {

    /**
     * Discord REST API Version
     */
    static DISCORD_REST_VERSION: string = '10';

    public server_info_repo = new ServerInfoRepository();

    /**
     * Regist slash command.
     * @param client_id 
     */
    async regist_command(client_id: string): Promise<ServerInfo[]> {
        logger.info(`regist command start.`);

        // get server info from database
        const server_info_list: ServerInfo[] = await this.server_info_repo.get_m_server_info_all();
        logger.info(`load server info completed. server info count = ${server_info_list.length}`);

        // error server info list
        const error_server_info_list: ServerInfo[] = [];

        // loop server info
        server_info_list.forEach((server_info: ServerInfo) => {
            // get guild id
            const guild_id: string = server_info.server_id;
            logger.info(`command registration target client_id = ${client_id}, guild_id = ${guild_id}`);

            // create rest logic
            const rest = new REST({ version: DiscordRegisterCommand.DISCORD_REST_VERSION }).setToken(process.env['DISCORD_BOT_TOKEN'] || '');

            // delete for guild-based commands
            rest.put(this.get_url_for_guild_based_command(client_id, guild_id), { body: [] }).then(() => {
                logger.info(`successfully deleted all guild commands. client_id = ${client_id}, guild_id = ${guild_id}`)
            }).catch((err) => {
                logger.error(err);
                error_server_info_list.push(server_info);
            });

            // create command
            const commands = this.get_regist_slash_command_body([
                this.get_slash_command(constants.DISCORD_COMMAND_NEW_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT),
                this.get_slash_command(constants.DISCORD_COMMAND_EDIT_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT),
                this.get_slash_command(constants.DISCORD_COMMAND_DELETE_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT),
                this.get_slash_command(constants.DISCORD_COMMAND_REGIST_MASTER, constants.DISCORD_COMMAND_DESCRIPTION_REGIST_MASTER),
                this.get_slash_command(constants.DISCORD_COMMAND_USER_INFO_LIST_GET, constants.DISCORD_COMMAND_DESCRIPTION_USER_INFO_LIST_GET),
                this.get_slash_command(constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_SEARCH_FRIEND_CODE),
                this.get_slash_command(constants.DISCORD_COMMAND_REGIST_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE),
                this.get_slash_command(constants.DISCORD_COMMAND_DELETE_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT),
                this.get_slash_command(constants.DISCORD_COMMAND_EDIT_GAME_MASTER, constants.DISCORD_COMMAND_DESCRIPTION_EDIT_GAME_MASTER),
                this.get_slash_command(constants.DISCORD_COMMAND_RESET_GAME_MASTER, constants.DISCORD_COMMAND_DESCRIPTION_RESET_GAME_MASTER),
            ]);

            // regist command
            rest.put(this.get_url_for_guild_based_command(client_id, guild_id), { body: commands }).then((data: any) => {
                logger.info(`successfully registered ${data.length} application commands.`)
            }).catch((err) => {
                logger.error(err);
                error_server_info_list.push(server_info);
            });
        });

        // check error list
        if (error_server_info_list.length == 0) {
            logger.info(`registed command to all server completed. server info count  ${server_info_list.length}`);
            return server_info_list;
        } else {
            logger.error(`registed command error to any server. error server info = `, error_server_info_list);
            throw `registed command error to any server`;
        }
    }

    /**
     * get application url for guild based commnad
     * @param client_id 
     * @param guild_id 
     * @returns 
     */
    get_url_for_guild_based_command(client_id: string, guild_id: string): `/${string}` {
        return Discord.Routes.applicationGuildCommands(client_id, guild_id);
    }

    /**
     * get regist slash command body
     * @param command_list 
     * @returns 
     */
    get_regist_slash_command_body(command_list: Discord.SlashCommandBuilder[]): Discord.RESTPostAPIChatInputApplicationCommandsJSONBody[] {
        return command_list.map(command => command.toJSON());
    }

    /**
     * get slash command with name and description
     * @param name 
     * @param description 
     * @returns 
     */
    get_slash_command(name: string, description: string): Discord.SlashCommandBuilder {
        return new Discord.SlashCommandBuilder().setName(name).setDescription(description);
    }
}