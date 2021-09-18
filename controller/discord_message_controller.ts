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
import { Recruitment } from '../entity/recruitment';
import { Participate } from '../entity/participate';
import { ServerInfo } from '../entity/server_info';
import { Reference } from '../entity/reference';

// import discord modules
const Discord = require('discord.js');

export class DiscordMessageController {
    /**
     * analyze discord message and send result message
     * @param client discord client
     * @param message discord message
     */
    static recirve_controller(client: any, message: any) {
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
                            DiscordMessageController.create_new_recruitment(message, analyzer);
                            break;

                        case constants.TYPE_EDIT:
                            // update recruitment
                            DiscordMessageController.update_recruitment(message, analyzer);
                            break;

                        case constants.TYPE_DELETE:
                            // delete recruitment
                            DiscordMessageController.delete_recruitment(message, analyzer);
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
    static create_new_recruitment(message: any, analyzer: DiscordMessageAnalyzer) {
        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let recruitment_target_role = '';

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
                return participate_repo.insert_t_participate(analyzer.user_list[0]);
            })
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(message.guild.id);
            })
            .then((server_info: ServerInfo) => {
                // get target role
                recruitment_target_role = server_info.recruitment_target_role;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, recruitment_target_role = ${recruitment_target_role}`);
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
                return message.channel.send({
                    embeds: [
                        message_manager.get_new_recruitment_message(analyzer.get_recruitment(), recruitment_target_role)
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
    static update_recruitment(message: any, analyzer: DiscordMessageAnalyzer) {
        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let recruitment_target_role = '';

        // update recruitment
        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(message.guild.id);
            })
            .then((server_info: ServerInfo) => {
                // get target role
                recruitment_target_role = server_info.recruitment_target_role;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, recruitment_target_role = ${recruitment_target_role}`);
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
                return message.channel.send({
                    embeds: [
                        message_manager.get_edit_recruitment_message(analyzer.get_recruitment(), recruitment_target_role)
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
    static delete_recruitment(message: any, analyzer: DiscordMessageAnalyzer) {
        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const message_manager = new DiscordMessageManager();

        // recruitment role string
        let recruitment_target_role = '';

        recruitment_repo.update_m_recruitment(analyzer.get_recruitment())
            .then(() => {
                // get target role
                return server_info_repo.get_m_server_info(message.guild.id);
            })
            .then((server_info: ServerInfo) => {
                // get target role
                recruitment_target_role = server_info.recruitment_target_role;

                // compete all tasks
                logger.info(`registration complete. : id = ${analyzer.id}, token = ${analyzer.token}, recruitment_target_role = ${recruitment_target_role}`);
                logger.trace(analyzer.get_recruitment());
                logger.trace(analyzer.get_owner_participate());

                // send success message
                return message.channel.send({
                    embeds: [
                        message_manager.get_delete_recruitment_message(analyzer.get_recruitment(), recruitment_target_role)
                    ]
                });
            })
            .catch((err: any) => {
                // send error message
                message.channel.send(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                logger.error(err);
            });
    }
}