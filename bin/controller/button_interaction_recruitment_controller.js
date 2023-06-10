"use strict";
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
exports.ButtonInteractionRecruitmentController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import databace access modules
const recruitement_1 = require("../db/recruitement");
const participate_1 = require("../db/participate");
const server_info_1 = require("../db/server_info");
// create message modules
const discord_interaction_analyzer_1 = require("../logic/discord_interaction_analyzer");
const discord_message_1 = require("../logic/discord_message");
class ButtonInteractionRecruitmentController {
    constructor() {
        this.recruitment_repo = new recruitement_1.RecruitmentRepository();
        this.participate_repo = new participate_1.ParticipateRepository();
        this.server_info_repo = new server_info_1.ServerInfoRepository();
    }
    /**
     * recruitment interaction button
     * @param interaction
     */
    recruitment_interaction(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`recirved rectuiment interaction. customId = ${interaction.customId}`);
                logger_1.logger.trace(interaction);
                // check guild id
                if (interaction.guildId == undefined) {
                    // goto catch block
                    throw new Error(`interaction's guild id is undefined.`);
                }
                // analyze message
                const analyzer = new discord_interaction_analyzer_1.DiscordInteractionAnalyzer();
                const analyze_result = yield analyzer.analyze(interaction.customId, interaction.user.id);
                logger_1.logger.info(`analyze interaciton completed. type = ${analyze_result.type}`);
                logger_1.logger.trace(analyze_result);
                // check target recruitment is alive?
                let recruitment_data;
                try {
                    recruitment_data = yield this.recruitment_repo.get_m_recruitment(analyze_result.token);
                    logger_1.logger.info(`select m_recruitoment successed. token = ${analyze_result.token}`);
                }
                catch (err) {
                    // if not found, send error message
                    logger_1.logger.warn(`target m_recruitment is not found. token = ${analyze_result.token}`);
                    // send error message
                    yield interaction.reply({
                        content: `${discord_message_1.DiscordMessage.get_no_recruitment()}`,
                        ephemeral: true,
                    });
                    // goto catch block
                    throw new Error(`target m_recruitment is not found. token = ${analyze_result.token}`);
                }
                try {
                    // try to insert
                    const affected_data_cnt = yield this.participate_repo.insert_t_participate(analyze_result.get_join_participate());
                    logger_1.logger.info(`insert t_participate completed. affected_data_cnt = ${affected_data_cnt}`);
                }
                catch (err) {
                    // if error, try to update
                    logger_1.logger.info(`insert t_participate failed, try to update. err = (${err})`);
                    const affected_data_cnt = yield this.participate_repo.update_t_participate(analyze_result.get_join_participate());
                    logger_1.logger.info(`update t_participate completed. affected_data_cnt = ${affected_data_cnt}`);
                }
                // load server info
                const server_info = yield this.server_info_repo.get_m_server_info(interaction.guildId);
                logger_1.logger.info(`select m_server_info successed. server_id = ${interaction.guildId}`);
                // set id to analyzer
                analyze_result.set_id(recruitment_data.id);
                // get user list
                recruitment_data.user_list = yield this.participate_repo.get_t_participate(recruitment_data.token);
                logger_1.logger.info(`select recruitment's t_participate successed. count = ${recruitment_data.user_list.length}`);
                // update interaction
                yield interaction.update({
                    embeds: [
                        discord_message_1.DiscordMessage.get_new_recruitment_message(recruitment_data, server_info.recruitment_target_role)
                    ],
                    fetchReply: true,
                });
            }
            catch (err) {
                // logging
                logger_1.logger.error(`button interaction recruitment error.`, err);
                // send error message
                yield interaction.reply({
                    content: `${discord_message_1.DiscordMessage.get_no_recruitment()} (Error: ${err})`,
                    ephemeral: true,
                });
                return false;
            }
            logger_1.logger.info(`button interaction recruitment completed.`);
            return true;
        });
    }
}
exports.ButtonInteractionRecruitmentController = ButtonInteractionRecruitmentController;
//# sourceMappingURL=button_interaction_recruitment_controller.js.map