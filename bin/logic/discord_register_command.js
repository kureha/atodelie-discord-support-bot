"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordRegisterCommand = void 0;
// import discord modules
const Discord = __importStar(require("discord.js"));
const rest_1 = require("@discordjs/rest");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import databace access modules
const server_info_1 = require("../db/server_info");
// import logger
const logger_1 = require("../common/logger");
class DiscordRegisterCommand {
    /**
     * Regist slash command.
     * @param client_id
     */
    static regist_command(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`regist command start.`);
            // get server info from database
            const server_info_list = yield new server_info_1.ServerInfoRepository().get_m_server_info_all();
            logger_1.logger.info(`load server info completed. server info count = ${server_info_list.length}`);
            // main logic start.
            return new Promise((resolve, reject) => {
                // error server info list
                const error_server_info_list = [];
                // loop server info
                server_info_list.forEach((server_info) => {
                    // get guild id
                    const guild_id = server_info.server_id;
                    logger_1.logger.info(`command registration target client_id = ${client_id}, guild_id = ${guild_id}`);
                    // create rest logic
                    const rest = new rest_1.REST({ version: DiscordRegisterCommand.DISCORD_REST_VERSION }).setToken(process.env['DISCORD_BOT_TOKEN'] || '');
                    // delete for guild-based commands
                    rest.put(DiscordRegisterCommand.get_url_for_guild_based_command(client_id, guild_id), { body: [] }).then(() => {
                        logger_1.logger.info(`successfully deleted all guild commands. client_id = ${client_id}, guild_id = ${guild_id}`);
                    }).catch((err) => {
                        logger_1.logger.error(err);
                        error_server_info_list.push(server_info);
                    });
                    // create command
                    const commands = DiscordRegisterCommand.get_regist_slash_command_body([
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_NEW_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_EDIT_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_DELETE_RECRUITMENT, constants.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_REGIST_MASTER, constants.DISCORD_COMMAND_DESCRIPTION_REGIST_MASTER),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_USER_INFO_LIST_GET, constants.DISCORD_COMMAND_DESCRIPTION_USER_INFO_LIST_GET),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_SEARCH_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_SEARCH_FRIEND_CODE),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_REGIST_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE),
                        DiscordRegisterCommand.get_slash_command(constants.DISCORD_COMMAND_DELETE_FRIEND_CODE, constants.DISCORD_COMMAND_DESCRIPTION_DELETE_RECRUITMENT),
                    ]);
                    // regist command
                    rest.put(DiscordRegisterCommand.get_url_for_guild_based_command(client_id, guild_id), { body: commands }).then((data) => {
                        logger_1.logger.info(`successfully registered ${data.length} application commands.`);
                    }).catch((err) => {
                        logger_1.logger.error(err);
                        error_server_info_list.push(server_info);
                    });
                });
                // check error list
                if (error_server_info_list.length == 0) {
                    logger_1.logger.info(`registed command to all server completed. server info count  ${server_info_list.length}`);
                    resolve(server_info_list);
                }
                else {
                    logger_1.logger.error(`registed command error to any server. error server info = `, error_server_info_list);
                    reject(`registed command error to any server`);
                }
            });
        });
    }
    /**
     * get application url for guild based commnad
     * @param client_id
     * @param guild_id
     * @returns
     */
    static get_url_for_guild_based_command(client_id, guild_id) {
        return Discord.Routes.applicationGuildCommands(client_id, guild_id);
    }
    /**
     * get regist slash command body
     * @param command_list
     * @returns
     */
    static get_regist_slash_command_body(command_list) {
        return command_list.map(command => command.toJSON());
    }
    /**
     * get slash command with name and description
     * @param name
     * @param description
     * @returns
     */
    static get_slash_command(name, description) {
        return new Discord.SlashCommandBuilder().setName(name).setDescription(description);
    }
}
exports.DiscordRegisterCommand = DiscordRegisterCommand;
/**
 * Discord REST API Version
 */
DiscordRegisterCommand.DISCORD_REST_VERSION = '10';
//# sourceMappingURL=discord_register_command.js.map