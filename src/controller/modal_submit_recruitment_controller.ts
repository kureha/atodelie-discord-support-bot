// import discord modules
import * as Discord from 'discord.js';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import logger
import { logger } from '../common/logger';

// import databace access modules
import { ParticipateRepository } from '../db/participate';
import { RecruitmentRepository } from '../db/recruitement';
import { ServerInfoRepository } from '../db/server_info';

// import entities
import { Participate } from '../entity/participate';
import { Recruitment } from '../entity/recruitment';
import { ServerInfo } from '../entity/server_info';

// import logics
import { DiscordInteractionAnalyzer } from '../logic/discord_interaction_analyzer';
import { DiscordMessage } from '../logic/discord_message';
import { DiscordCommon } from '../logic/discord_common';

export class ModalSubmitRecruitmentController {
    /**
     * Regist new reqruitment
     * @param interaction 
     */
    static async regist(interaction: Discord.ModalSubmitInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                logger.info(`registration start.`);

                // get recruitment
                const recruitment: Recruitment = this.get_recruitment(interaction);
                logger.info(`get recruitment ok.`);

                // get participate info
                const owner_participate: Participate = this.get_owner_participate(interaction);
                logger.info(`get participate ok.`);

                // add owner info to participate members
                recruitment.user_list.push(owner_participate);

                // create token
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
                const server_info_repo = new ServerInfoRepository();

                // registration sequence start.
                const token: string = await recruitment_repo.get_m_recruitment_token();
                logger.info(`create token completed. token = ${token}`);

                // set token to recruitment and owner
                recruitment.token = token;
                owner_participate.token = token;

                // get number
                const recruitment_id: number = await recruitment_repo.get_m_recruitment_id();

                logger.info(`get recruitment_id from db completed. recruitment_id = ${recruitment_id}`);

                // set id to recruitment and owner
                recruitment.id = recruitment_id;
                owner_participate.id = recruitment_id;

                // regist recruitment
                let affected_data_cnt: number = await recruitment_repo.insert_m_recruitment(recruitment);
                logger.info(`recruitment registration completed. affected_data_cnt = ${affected_data_cnt}`);

                // participate registration.
                affected_data_cnt = await participate_repo.insert_t_participate(owner_participate);
                logger.info(`owner participate registration completed. affected_data_cnt = ${affected_data_cnt}`);

                // get target role
                const server_info: ServerInfo = await server_info_repo.get_m_server_info(interaction.guildId || '');

                // check server info registed
                if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                    logger.warn(`not regist server info, send warning message.`);
                }

                // compete all tasks
                logger.info(`registration complete. : id = ${recruitment.id}, token = ${recruitment.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(recruitment);
                logger.trace(owner_participate);

                // create join button
                const action_row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                    .addComponents(
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTUN_JOIN,
                            DiscordCommon.BUTTON_STYLE_PRIMARY),
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTON_DECLINE,
                            DiscordCommon.BUTTON_STYLE_DANGER),
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTON_VIEW,
                            DiscordCommon.BUTTON_STYLE_SUCCESS),
                    );

                // send reply message
                await interaction.reply({
                    embeds: [DiscordMessage.get_new_recruitment_message(recruitment, server_info.recruitment_target_role)],
                    components: [action_row],
                });

                // resolve
                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`create new recruitment error. error = ${err}`);
            }
        });
    }

    /**
     * Edit last interaction
     * @param interaction 
     */
    static async edit(interaction: Discord.ModalSubmitInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                logger.info(`update recruitment start. (delete - insert)`);

                // search last recruitment
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
                const server_info_repo = new ServerInfoRepository();

                const recruitment_list: Recruitment[] = await recruitment_repo.get_m_recruitment_for_user(interaction.guildId || Constants.STRING_EMPTY, interaction.user.id);

                // check recruitment
                if (recruitment_list == null || recruitment_list.length == 0) {
                    logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                    await interaction.reply(DiscordMessage.get_no_recruitment());

                    throw new Error(`target user's recruitment is null or 0.`);
                }

                // get last recruitment
                const recruitment = recruitment_list.slice(-1)[0] || new Recruitment();
                logger.info(`select update target recruitment load ok. name = ${recruitment.name}, token = ${recruitment.token}`);

                // load participate list
                recruitment.user_list = await participate_repo.get_t_participate(recruitment.token);
                logger.info(`select participate complete. token = ${recruitment.token}, participate count = ${recruitment.user_list.length}`);

                // get target role
                const server_info: ServerInfo = await server_info_repo.get_m_server_info(interaction.guildId || '')
                logger.info(`select server info completed. server id = ${server_info.server_id}`);

                // delete old participate data
                let affected_data_cnt: number = await participate_repo.delete_t_participate(recruitment.token);
                logger.info(`delete old participate completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);

                // delete old recruitment data
                affected_data_cnt = await recruitment_repo.delete_m_recruitment(recruitment.token);
                logger.info(`delete old recruitment completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);

                // get new token
                const new_token: string = await recruitment_repo.get_m_recruitment_token();
                logger.info(`generate new token completed. new token = ${new_token}`);

                // set to instance
                recruitment.token = new_token;
                recruitment.user_list.forEach((v) => {
                    v.token = new_token;
                });

                // edit recruitment
                recruitment.name = DiscordCommon.replace_intaraction_description_roles(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_DESCRIPTION_ID), DiscordCommon.get_role_info_from_guild(interaction.guild));

                // default limit date
                const default_date: Date = new Date();
                default_date.setHours(default_date.getHours() + DiscordInteractionAnalyzer.HOURS_DEFAULT);

                // analyze limit_time 
                recruitment.limit_time = DiscordInteractionAnalyzer.get_recruitment_time(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_TIME_ID), constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || default_date;

                // recruitment registration
                affected_data_cnt = await recruitment_repo.insert_m_recruitment(recruitment);
                logger.info(`regist new recruitment completed. id = ${recruitment.id}, token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);

                // participate registration.
                affected_data_cnt = await participate_repo.insert_t_participate_list(recruitment.user_list);
                logger.info(`regist new participate completed. id = ${recruitment.id}, token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`)

                // check server info registed
                if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                    logger.warn(`not regist server info, send warning message.`);
                }

                // compete all tasks
                logger.info(`registration complete. : id = ${recruitment.id}, token = ${recruitment.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                logger.trace(recruitment);

                // create join button
                const action_row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                    .addComponents(
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTUN_JOIN,
                            DiscordCommon.BUTTON_STYLE_PRIMARY),
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTON_DECLINE,
                            DiscordCommon.BUTTON_STYLE_DANGER),
                        DiscordCommon.get_button(
                            `${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${recruitment.token}`,
                            constants.DISCORD_BUTTON_VIEW,
                            DiscordCommon.BUTTON_STYLE_SUCCESS),
                    );

                // send reply message
                await interaction.reply({
                    embeds: [DiscordMessage.get_edit_recruitment_message(recruitment, server_info.recruitment_target_role)],
                    components: [action_row],
                });

                // resolve
                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`edit recruitment error. error = ${err}`);
            }
        });
    }

    /**
     * Get recruitment from interaction.
     * @param interaction 
     */
    static get_recruitment(interaction: Discord.ModalSubmitInteraction): Recruitment {
        // create recruitment
        const recruitment: Recruitment = new Recruitment();

        // get name
        recruitment.name = DiscordCommon.replace_intaraction_description_roles(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_DESCRIPTION_ID), DiscordCommon.get_role_info_from_guild(interaction.guild));
        recruitment.owner_id = interaction.user.id;

        // token is setted after
        recruitment.token = '';

        // default limit date
        const default_date: Date = new Date();
        default_date.setHours(default_date.getHours() + DiscordInteractionAnalyzer.HOURS_DEFAULT);

        // analyze limit_time 
        recruitment.limit_time = DiscordInteractionAnalyzer.get_recruitment_time(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_TIME_ID), constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || default_date;

        // initialize other values
        recruitment.server_id = interaction.guildId || Constants.STRING_EMPTY;
        recruitment.message_id = interaction.message?.id || Constants.STRING_EMPTY;
        recruitment.status = constants.STATUS_ENABLED;
        recruitment.description = "";
        recruitment.delete = false;

        return recruitment;
    }

    /**
     * Get participate from interaction.
     * @param interaction 
     */
    static get_owner_participate(interaction: Discord.ModalSubmitInteraction): Participate {
        // create participate info

        const participate: Participate = new Participate();
        participate.user_id = interaction.user.id;
        participate.status = constants.STATUS_ENABLED;
        participate.delete = false;

        // token is setted after
        participate.token = '';

        return participate;
    }
}