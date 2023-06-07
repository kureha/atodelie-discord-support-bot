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
import { Recruitment } from '../entity/recruitment';
import { ServerInfo } from '../entity/server_info';

// import logics
import { DiscordMessage } from '../logic/discord_message';
import { DiscordCommon } from '../logic/discord_common';

export class CommandRecruitmentController {
    /**
     * Create new reqruitment
     * @param interaction interaction
     */
    static async new_recruitment_input_modal(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // show input modal
                logger.info(`request new recruitment. show blank modal.`);

                // create the modal
                const modal = new Discord.ModalBuilder()
                    .setCustomId(constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT)
                    .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT);

                // show modal
                await this.show_recruitment_input_modal(interaction, modal, undefined, undefined);

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`show modal for new recruitment error. error = ${err}`);
            }
        });
    }

    /**
     * Edit user's last recruitment
     * @param interaction 
     */
    static async edit_recruitment_input_modal(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                logger.info(`request edit recruitment. load last recruitment for target user.`);

                // load from db
                const recruitment_repo = new RecruitmentRepository();
                const recruitment_list: Recruitment[] = await recruitment_repo.get_m_recruitment_for_user(interaction.guildId || Constants.STRING_EMPTY, interaction.user.id);

                // check recruitment
                if (recruitment_list == null || recruitment_list.length == 0) {
                    logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                    await interaction.reply(DiscordMessage.get_no_recruitment());
                    throw new Error(`target user's recruitment is null or 0.`);
                }

                // get last recruitment
                const recruitment: Recruitment = recruitment_list.slice(-1)[0] || new Recruitment();
                logger.info(`select recruitment complete. name = ${recruitment.name}, token = ${recruitment.token}`);

                // show input modal
                logger.info(`request edit recruitment. show edit modal.`);

                // create the modal
                const modal = new Discord.ModalBuilder()
                    .setCustomId(constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT)
                    .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT);

                await this.show_recruitment_input_modal(interaction, modal, recruitment.limit_time, recruitment.name);

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`show modal for edit recruitment error. error = ${err}`);
            }
        });
    }

    /**
     * show modal to user
     * @param interaction 
     * @param modal
     * @param limit_time initrial value. if limit time is not defined, set undefined.
     * @param description initrial value. if description is not defined, set undefined.
     */
    static async show_recruitment_input_modal(interaction: Discord.ChatInputCommandInteraction, modal: Discord.ModalBuilder, limit_time: Date | undefined, description: string | undefined): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // time
                const time_text = DiscordCommon.get_text_input(
                    constants.DISCORD_MODAL_TIME_ID,
                    constants.DISCORD_RECRUITMENT_MODAL_TIME,
                    // Paragraph means single lines of text.
                    DiscordCommon.TEXT_INPUT_STYLE_SHORT);

                // pharagraph
                const dscripiion_text = DiscordCommon.get_text_input(
                    constants.DISCORD_MODAL_DESCRIPTION_ID,
                    constants.DISCORD_RECRUITMENT_MODAL_DESCRIPTION,
                    // Paragraph means multiple lines of text.
                    DiscordCommon.TEXT_INPUT_STYLE_PHARAGRAPH);

                // set initial values if value is not null
                if (limit_time != undefined) {
                    time_text.setValue(DiscordCommon.get_limit_time_str(limit_time));
                }

                if (description != undefined) {
                    dscripiion_text.setValue(description);
                }

                // crteate action row
                const first_action_row = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(time_text);
                const second_action_row = new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(dscripiion_text);

                // Add inputs to the modal
                modal.addComponents(first_action_row, second_action_row);

                // Show the modal to the user
                await interaction.showModal(modal);

                resolve(true);
            } catch (err) {
                logger.error(err);
                reject(err);
            }
        });
    }

    /**
     * Delete last interaction
     * @param interaction 
     */
    static async delete_recruitment(interaction: Discord.ChatInputCommandInteraction): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                logger.info(`request delete recruitment. load last recruitment for target user.`);

                // search last recruitment
                const recruitment_repo = new RecruitmentRepository();
                const participate_repo = new ParticipateRepository();
                const server_info_repo = new ServerInfoRepository();

                // select user's enable recruitment list
                const recruitment_list: Recruitment[] = await recruitment_repo.get_m_recruitment_for_user(interaction.guildId || Constants.STRING_EMPTY, interaction.user.id);

                // check recruitment
                if (recruitment_list == null || recruitment_list.length == 0) {
                    logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                    await interaction.reply(DiscordMessage.get_no_recruitment());
                    throw new Error(`target user's recruitment is null or 0.`);
                }

                // get last recruitment
                const recruitment = recruitment_list.slice(-1)[0] || new Recruitment();
                logger.info(`select recruitment complete. name = ${recruitment.name}, token = ${recruitment.token}`);

                // load participate
                recruitment.user_list = await participate_repo.get_t_participate(recruitment.token);
                logger.info(`select participate complete. token = ${recruitment.token}, participate count = ${recruitment.user_list.length}`);

                // delete old participate data
                let affected_data_cnt: number = await participate_repo.delete_t_participate(recruitment.token);
                logger.info(`delete old participate completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);

                // delete old recruitment data
                affected_data_cnt = await recruitment_repo.delete_m_recruitment(recruitment.token);
                logger.info(`delete old recruitment completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);

                // get target role
                const server_info: ServerInfo = await server_info_repo.get_m_server_info(interaction.guildId || '');

                // send reply message
                await interaction.reply({ embeds: [DiscordMessage.get_delete_recruitment_message(recruitment, server_info.recruitment_target_role)] });

                resolve(true);
            } catch (err) {
                logger.error(err);
                await interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);

                reject(`delete recruitment error. error = ${err}`);
            }
        });
    }
}

