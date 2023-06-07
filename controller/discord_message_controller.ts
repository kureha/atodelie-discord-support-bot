// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import modules
import { RecruitmentRepository } from './../db/recruitement';
import { ParticipateRepository } from '../db/participate';
import { ServerInfoRepository } from '../db/server_info';

// create message modules
import { DiscordMessageAnalyzer } from './../logic/discord_message_analyzer';
import { DiscordMessageManager } from './../logic/discord_message_manager';
import { ExportUserInfo } from '../logic/export_user_info';

// import entities
import { ServerInfo } from '../entity/server_info';
import { Reference } from '../entity/reference';
import { UserInfo } from '../entity/user_info';

// import discord modules
import * as Discord from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';

export class DiscordMessageController {
    /**
     * Get ClientUser from Discord
     * @param client 
     * @returns discord client user. if error, throw error.
     */
    static get_client_user(client: Discord.Client): Discord.ClientUser {
        if (client != undefined && client.user != undefined) {
            return client.user;
        } else {
            throw new Error(`Discord client is undefined.`);
        }
    }

    /**
     * Get Guild from Discord
     * @param message 
     * @returns discord guild. if error, throw error
     */
    static get_guild(message: Discord.Message): Discord.Guild {
        if (message != undefined && message.guild != undefined) {
            return message.guild;
        } else {
            throw new Error(`Discord message guild is undefined.`);
        }
    }

    /**
     * Get Text Channel from Discord
     * @param client 
     * @param channel_id 
     * @returns discord channel. if error, throw error
     */
    static get_text_channel(client: Discord.Client, channel_id: string): Discord.TextChannel {
        if (client.channels.cache.get(channel_id) == undefined) {
            // check channel exists
            throw new Error(`Target channel is not exists. channel_id = ${channel_id}`);
        } else if (client.channels.cache.get(channel_id)?.isText() == false) {
            // check target channel is text channel
            throw new Error(`Target channel is not text channel. channel_id = ${channel_id}`);
        }

        // return values
        return client.channels.cache.get(channel_id) as Discord.TextChannel;
    }

    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recieve_controller(client: Discord.Client, message: Discord.Message) {
        // get objects from discord.
        const client_user: Discord.ClientUser = DiscordMessageController.get_client_user(client);
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        if (message.mentions.users.has(client_user.id)) {
            logger.info(`recieved message : ${message.content}`);
            logger.trace(message);

            // analyze message
            const analyzer = new DiscordMessageAnalyzer();
            analyzer.analyze(message.content, guild.id, message.author.id, client_user.id, new Reference(message.reference))
                .then(() => {
                    logger.trace(analyzer);

                    // call function by type
                    switch (analyzer.type) {
                        case constants.TYPE_RECRUITEMENT:
                            // create recruitment
                            DiscordMessageController.create_new_recruitment(client, message, analyzer);
                            break;

                        case constants.TYPE_EDIT:
                            // update recruitment
                            DiscordMessageController.update_recruitment(client, message, analyzer);
                            break;

                        case constants.TYPE_DELETE:
                            // delete recruitment
                            DiscordMessageController.delete_recruitment(client, message, analyzer);
                            break;

                        case constants.TYPE_REGIST_MAETER:
                            // regist master
                            DiscordMessageController.regist_master(client, message, analyzer);
                            break;

                        case constants.TYPE_USER_INFO_LIST_GET:
                            // user info list gert
                            DiscordMessageController.export_user_info(client, message, analyzer);
                            break;

                        default:
                            // send error message
                            message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                            break;
                    }
                })
                .catch(() => {
                    // send error message
                    message.channel.send(`${constants.DISCORD_MESSAGE_TYPE_INVALID} (Error : ${analyzer.error_messages.join(',')})`);
                })

        }
    }

    /**
     * create new recruitment
     * @param message 
     * @param analyzer 
     */
    static create_new_recruitment(client: Discord.Client, message: Discord.Message, analyzer: DiscordMessageAnalyzer) {
        // get objects from discord.
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let server_info: ServerInfo;

        // get token function
        recruitment_repo.get_m_recruitment_token()
            .then((token: string) => {
                analyzer.set_token(token);
                // get registration id
                return recruitment_repo.get_m_recruitment_id();
            })
            .then((id: number) => {
                // set id and master registration
                analyzer.set_id(id);
                return recruitment_repo.insert_m_recruitment(analyzer.get_recruitment());
            })
            .then(() => {
                // participate registration.
                return participate_repo.insert_t_participate(analyzer.get_owner_participate());
            })
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(guild.id);
            })
            .then((server_info_data: ServerInfo) => {
                // get server info data
                server_info = server_info_data;

                // check server info registed
                if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                    logger.warn(`not regist server info, send warning message.`);
                    message.channel.send(
                        message_manager.get_setting_is_not_ready(constants.DISCORD_BOT_ADMIN_USER_ID)
                    );

                    // input temprary values to server info
                    server_info.server_id = message.guildId || Constants.STRING_EMPTY;
                    server_info.channel_id = message.channelId || Constants.STRING_EMPTY;
                }

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // create join button
                let join_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.PRIMARY)
                    .setLabel(constants.DISCORD_BUTTUN_JOIN);

                // create decline button
                let decline_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.DANGER)
                    .setLabel(constants.DISCORD_BUTTON_DECLINE);

                // create view button
                let view_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.SUCCESS)
                    .setLabel(constants.DISCORD_BUTTON_VIEW);

                // send success message
                const text_channel: Discord.TextChannel = DiscordMessageController.get_text_channel(client, server_info.channel_id);
                return text_channel.send({
                    embeds: [
                        message_manager.get_new_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                    ],
                    components: [
                        new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                    ],
                });
            })
            .then((sended_message: Discord.Message) => {
                // set recirve message id
                logger.info(`send message completed. update message id to recruitment. : message_id = ${sended_message.id}`);
                analyzer.set_message_id(sended_message.id);

                // final phase : update recruitment
                return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
            })
            .catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }

    /**
     * update recruitment
     * @param message 
     * @param analyzer 
     */
    static update_recruitment(client: Discord.Client, message: Discord.Message, analyzer: DiscordMessageAnalyzer) {
        // get objects from discord.
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let server_info: ServerInfo;

        // update recruitment
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(guild.id);
            })
            .then((server_info_data: ServerInfo) => {
                // get target role
                server_info = server_info_data;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // create join button
                let join_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.PRIMARY)
                    .setLabel(constants.DISCORD_BUTTUN_JOIN);

                // create decline button
                let decline_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.DANGER)
                    .setLabel(constants.DISCORD_BUTTON_DECLINE);

                // create view button
                let view_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(MessageButtonStyles.SUCCESS)
                    .setLabel(constants.DISCORD_BUTTON_VIEW);

                // send success message
                const text_channel: Discord.TextChannel = DiscordMessageController.get_text_channel(client, server_info.channel_id);
                return text_channel.send({
                    embeds: [
                        message_manager.get_edit_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                    ],
                    components: [
                        new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                    ],
                });
            })
            .then((sended_message: Discord.Message) => {
                // recirve message id
                logger.info(`send message completed. update message id to recruitment. : message_id = ${sended_message.id}`);
                analyzer.set_message_id(sended_message.id);

                // update recruitment
                return recruitment_repo.update_m_recruitment(analyzer.get_recruitment());
            })
            .catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }

    /**
     * delete recruitment
     * @param message 
     * @param analyzer 
     */
    static delete_recruitment(client: Discord.Client, message: Discord.Message, analyzer: DiscordMessageAnalyzer) {
        // get objects from discord.
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let server_info: ServerInfo;

        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(guild.id);
            })
            .then((server_info_data: ServerInfo) => {
                // get target role
                server_info = server_info_data;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // send success message
                const text_channel: Discord.TextChannel = DiscordMessageController.get_text_channel(client, server_info.channel_id);
                return text_channel.send({
                    embeds: [
                        message_manager.get_delete_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                    ]
                });
            })
            .catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }

    /**
     * regist master
     * @param message 
     * @param analyzer 
     */
    static regist_master(client: Discord.Client, message: Discord.Message, analyzer: DiscordMessageAnalyzer) {
        // get objects from discord.
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        // create db instances
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let server_info: ServerInfo = new ServerInfo();

        // create server info instance
        server_info.server_id = message.guildId || Constants.STRING_EMPTY;
        server_info.channel_id = message.channelId;
        server_info.recruitment_target_role = analyzer.owner_id;
        server_info.follow_time = Constants.get_default_date();

        // try to insert
        server_info_repo.insert_m_server_info(server_info)
            .catch(() => {
                // insert failed - try to update
                logger.info(`insert server info failed, try to update.`);
                return server_info_repo.update_m_server_info(server_info);
            })
            .then(() => {
                // get date for confirm
                return server_info_repo.get_m_server_info(guild.id);
            })
            .then((server_info_data) => {
                // send success message
                logger.info(`server info registration successed.`);
                logger.trace(server_info_data);

                // send success message
                const text_channel: Discord.TextChannel = DiscordMessageController.get_text_channel(client, server_info.channel_id);
                return text_channel.send(
                    message_manager.get_regist_server_info(server_info.recruitment_target_role)
                );
            })
            .catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }

    /**
     * user info list get
     * @param client
     * @param message 
     * @param analyzer 
     */
    static export_user_info(client: Discord.Client, message: Discord.Message, analyzer: DiscordMessageAnalyzer) {
        // get objects from discord.
        const guild: Discord.Guild = DiscordMessageController.get_guild(message);

        // create message manager instance
        const message_manager = new DiscordMessageManager();
        const export_user_info = new ExportUserInfo();

        // get export file path from .env file
        const export_file_path = constants.EXPORT_USER_INFO_PATH;

        // get server info
        guild.members.list({ limit: constants.USER_INFO_LIST_LIMIT_NUMBER, cache: false })
            .then((member_info_list: Discord.Collection<string, Discord.GuildMember>) => {
                logger.info(`get user info from server completed.`);

                // parse discord's data to internal object
                const user_info_list: UserInfo[] = export_user_info.parse_user_info(member_info_list);
                logger.info(`parsed user info data. count = ${user_info_list.length}`);

                // write user info list to file and get message
                export_user_info.output_user_info_to_file(user_info_list, export_file_path);
                logger.info(`output user info to file completed. path = ${export_file_path}`);

                // check member count is exceeded limit
                let message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO;
                if (guild.memberCount > constants.USER_INFO_LIST_LIMIT_NUMBER) {
                    logger.info(`user info list count is exceeded discord's limit number ${constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED}.`);
                    message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED;
                }

                // send message
                logger.info(`ready to sending message.`);
                return message.channel.send({
                    embeds: [
                        message_manager.get_export_user_info_embed_message(message_string)
                    ],
                    files: [export_file_path]
                });
            }).catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }
}