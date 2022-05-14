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

// import entities
import { ServerInfo } from '../entity/server_info';
import { Reference } from '../entity/reference';
import { UserInfo, RoleInfo } from '../entity/user_info';

// import discord modules
const Discord = require('discord.js');

export class DiscordMessageController {
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recieve_controller(client: any, message: any) {
        if (message.mentions.users.has(client.user.id)) {
            logger.info(`recieved message : ${message.content}`);
            logger.trace(message);

            // analyze message
            const analyzer = new DiscordMessageAnalyzer();
            analyzer.analyze(message.content, message.guild.id, message.author.id, client.user.id, new Reference(message.reference))
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
                            DiscordMessageController.user_info_list_get(client, message, analyzer);
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
    static create_new_recruitment(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
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
                return server_info_repo.get_m_server_info(message.guild.id);
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
                    server_info.server_id = message.guildId;
                    server_info.channel_id = message.channelId;
                }

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // create join button
                let join_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTUN_JOIN);

                // create decline button
                let decline_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTON_DECLINE);

                // create view button
                let view_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTON_VIEW);

                // send success message
                return client.channels.cache.get(server_info.channel_id).send({
                    embeds: [
                        message_manager.get_new_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                    ],
                    components: [
                        new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                    ],
                });
            })
            .then((sended_message: any) => {
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
    static update_recruitment(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
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
                return server_info_repo.get_m_server_info(message.guild.id);
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
                    .setStyle(constants.DISCORD_BUTTON_STYLE_JOIN_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTUN_JOIN);

                // create decline button
                let decline_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(constants.DISCORD_BUTTON_STYLE_DECLINE_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTON_DECLINE);

                // create view button
                let view_button = new Discord.MessageButton()
                    .setCustomId(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${analyzer.token}`)
                    .setStyle(constants.DISCORD_BUTTON_STYLE_VIEW_RECRUITMENT)
                    .setLabel(constants.DISCORD_BUTTON_VIEW);

                // send success message
                return client.channels.cache.get(server_info.channel_id).send({
                    embeds: [
                        message_manager.get_edit_recruitment_message(analyzer.get_recruitment(), server_info.recruitment_target_role)
                    ],
                    components: [
                        new Discord.MessageActionRow().addComponents(join_button, view_button, decline_button),
                    ],
                });
            })
            .then((sended_message: any) => {
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
    static delete_recruitment(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
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
                return server_info_repo.get_m_server_info(message.guild.id);
            })
            .then((server_info_data: ServerInfo) => {
                // get target role
                server_info = server_info_data;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // send success message
                return client.channels.cache.get(server_info.channel_id).send({
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
    static regist_master(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
        // create db instances
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let server_info: ServerInfo = new ServerInfo();

        // create server info instance
        server_info.server_id = message.guildId;
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
                return server_info_repo.get_m_server_info(message.guild.id);
            })
            .then((server_info_data) => {
                // send success message
                logger.info(`server info registration successed.`);
                logger.trace(server_info_data);

                // send success message
                return client.channels.cache.get(server_info.channel_id).send(
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
    static user_info_list_get(client: any, message: any, analyzer: DiscordMessageAnalyzer) {
        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // user info list
        let user_info_list: UserInfo[] = [];

        // get server info
        message.guild.members.list()
            .then((member_info_list: any) => {
                // loop member list
                member_info_list.forEach((user_info: any, user_id: string) => {
                    // create user info temp valiable
                    const user_info_temp: UserInfo = UserInfo.parse_from_discordjs(user_info);

                    // loop role list
                    user_info.roles.cache.forEach((role_info: any, role_id: string) => {
                        const role_info_temp: RoleInfo = RoleInfo.parse_from_discordjs(role_info);

                        // add role info to result list
                        user_info_temp.add(role_info_temp);
                    });

                    // add user info to result list
                    user_info_list.push(user_info_temp);
                });

                // result
                let result_string: string = message_manager.get_user_info_list(user_info_list);

                // send message
                return message.channel.send(result_string);
            }).catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }
}