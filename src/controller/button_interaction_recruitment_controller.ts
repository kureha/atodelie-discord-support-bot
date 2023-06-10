// define logger
import { logger } from '../common/logger';

// import databace access modules
import { RecruitmentRepository } from '../db/recruitement';
import { ParticipateRepository } from '../db/participate';
import { ServerInfoRepository } from '../db/server_info';

// create message modules
import { DiscordInteractionAnalyzer } from '../logic/discord_interaction_analyzer';
import { DiscordMessage } from '../logic/discord_message';

// import entities
import { Recruitment } from '../entity/recruitment';
import { ServerInfo } from '../entity/server_info';

// import discord modules
import * as Discord from 'discord.js';

export class ButtonInteractionRecruitmentController {

    public recruitment_repo = new RecruitmentRepository();
    public participate_repo = new ParticipateRepository();
    public server_info_repo = new ServerInfoRepository();

    /**
     * recruitment interaction button
     * @param interaction 
     */
    async recruitment_interaction(interaction: Discord.ButtonInteraction): Promise<boolean> {
        try {
            logger.info(`recirved rectuiment interaction. customId = ${interaction.customId}`);
            logger.trace(interaction);

            // check guild id
            if (interaction.guildId == undefined) {
                // goto catch block
                throw new Error(`interaction's guild id is undefined.`);
            }

            // analyze message
            const analyzer = new DiscordInteractionAnalyzer();
            const analyze_result = await analyzer.analyze(interaction.customId, interaction.user.id);

            logger.info(`analyze interaciton completed. type = ${analyze_result.type}`);
            logger.trace(analyze_result);

            // check target recruitment is alive?
            let recruitment_data: Recruitment;
            try {
                recruitment_data = await this.recruitment_repo.get_m_recruitment(analyze_result.token);
                logger.info(`select m_recruitoment successed. token = ${analyze_result.token}`);
            } catch (err) {
                // if not found, send error message
                logger.warn(`target m_recruitment is not found. token = ${analyze_result.token}`);
                // send error message
                await interaction.reply({
                    content: `${DiscordMessage.get_no_recruitment()}`,
                    ephemeral: true,
                });

                // goto catch block
                throw new Error(`target m_recruitment is not found. token = ${analyze_result.token}`);
            }

            try {
                // try to insert
                const affected_data_cnt: number = await this.participate_repo.insert_t_participate(analyze_result.get_join_participate());
                logger.info(`insert t_participate completed. affected_data_cnt = ${affected_data_cnt}`);
            } catch (err) {
                // if error, try to update
                logger.info(`insert t_participate failed, try to update. err = (${err})`);
                const affected_data_cnt: number = await this.participate_repo.update_t_participate(analyze_result.get_join_participate());
                logger.info(`update t_participate completed. affected_data_cnt = ${affected_data_cnt}`);
            }

            // load server info
            const server_info: ServerInfo = await this.server_info_repo.get_m_server_info(interaction.guildId);
            logger.info(`select m_server_info successed. server_id = ${interaction.guildId}`);

            // set id to analyzer
            analyze_result.set_id(recruitment_data.id);

            // get user list
            recruitment_data.user_list = await this.participate_repo.get_t_participate(recruitment_data.token)
            logger.info(`select recruitment's t_participate successed. count = ${recruitment_data.user_list.length}`)

            // update interaction
            await interaction.update({
                embeds: [
                    DiscordMessage.get_new_recruitment_message(recruitment_data, server_info.recruitment_target_role)
                ],
                fetchReply: true,
            });
        } catch (err) {
            // logging
            logger.error(`button interaction recruitment error.`, err);

            // send error message
            await interaction.reply({
                content: `${DiscordMessage.get_no_recruitment()} (Error: ${err})`,
                ephemeral: true,
            });

            return false;
        }

        logger.info(`button interaction recruitment completed.`);
        return true;
    }
}