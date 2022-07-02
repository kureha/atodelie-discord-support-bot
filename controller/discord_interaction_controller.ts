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
import { DiscordInteractionAnalyzer } from './../logic/discord_interaction_analyzer';
import { DiscordMessageManager } from './../logic/discord_message_manager';

// import entities
import { Recruitment } from '../entity/recruitment';
import { Participate } from '../entity/participate';
import { ServerInfo } from '../entity/server_info';

// import discord modules
import * as Discord from 'discord.js';

export class DiscordInteractionController {
    /**
     * analyze discord interaction and send result message
     * @param client discord client
     * @param interaction discord interaction
     */
    static recieve_controller(client: Discord.Client, interaction: Discord.ButtonInteraction) {
        logger.info(`recirved interaction. customId = ${interaction.customId}`);
        logger.trace(interaction);

        // create db instances
        const recruitment_repo = new RecruitmentRepository();
        const participate_repo = new ParticipateRepository();
        const server_info_repo = new ServerInfoRepository();

        // create message manager instance
        const messageManager = new DiscordMessageManager();

        // analyze message
        let analyzer = new DiscordInteractionAnalyzer();
        analyzer.analyze(interaction.customId, interaction.user.id)
            .then(() => {
                logger.trace(analyzer);

                let recruitment_data = new Recruitment();
                let recruitment_target_role = '';

                // join/view/decline to target plan
                participate_repo.insert_t_participate(analyzer.get_join_participate())
                    .catch((err: any) => {
                        // failed to insert, try to update
                        return participate_repo.update_t_participate(analyzer.get_join_participate());
                    })
                    .then(() => {
                        if (interaction.guildId == undefined) {
                            throw new Error(`Interaction's guild id is undefined.`);
                        }
                        // get target role
                        return server_info_repo.get_m_server_info(interaction.guildId);
                    })
                    .then((server_info_data: ServerInfo) => {
                        // get target role
                        recruitment_target_role = server_info_data.recruitment_target_role;

                        // update OK, send message
                        return recruitment_repo.get_m_recruitment(analyzer.token);
                    })
                    .then((data: Recruitment) => {
                        recruitment_data = data;
                        // set id to analyzer
                        analyzer.set_id(recruitment_data.id);
                        // get user list
                        return participate_repo.get_t_participate(recruitment_data.token);
                    })
                    .then((user_list: Participate[]) => {
                        // get user information
                        recruitment_data.user_list = user_list;

                        // create message
                        let message_by_interaction = new Discord.MessageEmbed();
                        switch (analyzer.type) {
                            case constants.TYPE_JOIN:
                                message_by_interaction = messageManager.get_join_recruitment(recruitment_data, recruitment_target_role);
                                break;
                            case constants.TYPE_VIEW:
                                message_by_interaction = messageManager.get_view_recruitment(recruitment_data, recruitment_target_role);
                                break;
                            case constants.TYPE_DECLINE:
                                message_by_interaction = messageManager.get_decline_recruitment(recruitment_data, recruitment_target_role);
                                break;
                            default:
                                logger.error(`this is not valid type. : ${analyzer.type}`);
                                break;
                        }

                        // send message
                        interaction.reply({
                            embeds: [
                                message_by_interaction
                            ],
                        });
                    })
                    .catch((err: any) => {
                        // send error message
                        interaction.reply(`${messageManager.get_no_recruitment()}`);
                        logger.error(err);
                    });
            })
            .catch(() => {
                // send error message
                interaction.reply(`${messageManager.get_no_recruitment()}`);
            });
    }
}