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
exports.ModalSubmitRecruitmentController = void 0;
// import discord modules
const Discord = __importStar(require("discord.js"));
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import databace access modules
const participate_1 = require("../db/participate");
const recruitement_1 = require("../db/recruitement");
const server_info_1 = require("../db/server_info");
// import entities
const participate_2 = require("../entity/participate");
const recruitment_1 = require("../entity/recruitment");
// import logics
const discord_interaction_analyzer_1 = require("../logic/discord_interaction_analyzer");
const discord_message_1 = require("../logic/discord_message");
const discord_common_1 = require("../logic/discord_common");
class ModalSubmitRecruitmentController {
    /**
     * Regist new reqruitment
     * @param interaction
     */
    static regist(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    logger_1.logger.info(`registration start.`);
                    // get recruitment
                    const recruitment = this.get_recruitment(interaction);
                    logger_1.logger.info(`get recruitment ok.`);
                    // get participate info
                    const owner_participate = this.get_owner_participate(interaction);
                    logger_1.logger.info(`get participate ok.`);
                    // add owner info to participate members
                    recruitment.user_list.push(owner_participate);
                    // create token
                    const recruitment_repo = new recruitement_1.RecruitmentRepository();
                    const participate_repo = new participate_1.ParticipateRepository();
                    const server_info_repo = new server_info_1.ServerInfoRepository();
                    // registration sequence start.
                    const token = yield recruitment_repo.get_m_recruitment_token();
                    logger_1.logger.info(`create token completed. token = ${token}`);
                    // set token to recruitment and owner
                    recruitment.token = token;
                    owner_participate.token = token;
                    // get number
                    const recruitment_id = yield recruitment_repo.get_m_recruitment_id();
                    logger_1.logger.info(`get recruitment_id from db completed. recruitment_id = ${recruitment_id}`);
                    // set id to recruitment and owner
                    recruitment.id = recruitment_id;
                    owner_participate.id = recruitment_id;
                    // regist recruitment
                    let affected_data_cnt = yield recruitment_repo.insert_m_recruitment(recruitment);
                    logger_1.logger.info(`recruitment registration completed. affected_data_cnt = ${affected_data_cnt}`);
                    // participate registration.
                    affected_data_cnt = yield participate_repo.insert_t_participate(owner_participate);
                    logger_1.logger.info(`owner participate registration completed. affected_data_cnt = ${affected_data_cnt}`);
                    // get target role
                    const server_info = yield server_info_repo.get_m_server_info(interaction.guildId || '');
                    // check server info registed
                    if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                        logger_1.logger.warn(`not regist server info, send warning message.`);
                    }
                    // compete all tasks
                    logger_1.logger.info(`registration complete. : id = ${recruitment.id}, token = ${recruitment.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                    logger_1.logger.trace(recruitment);
                    logger_1.logger.trace(owner_participate);
                    // create join button
                    const action_row = new Discord.ActionRowBuilder()
                        .addComponents(discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTUN_JOIN, discord_common_1.DiscordCommon.BUTTON_STYLE_PRIMARY), discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTON_DECLINE, discord_common_1.DiscordCommon.BUTTON_STYLE_DANGER), discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTON_VIEW, discord_common_1.DiscordCommon.BUTTON_STYLE_SUCCESS));
                    // send reply message
                    yield interaction.reply({
                        embeds: [discord_message_1.DiscordMessage.get_new_recruitment_message(recruitment, server_info.recruitment_target_role)],
                        components: [action_row],
                    });
                    // resolve
                    resolve(true);
                }
                catch (err) {
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`create new recruitment error. error = ${err}`);
                }
            }));
        });
    }
    /**
     * Edit last interaction
     * @param interaction
     */
    static edit(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    logger_1.logger.info(`update recruitment start. (delete - insert)`);
                    // search last recruitment
                    const recruitment_repo = new recruitement_1.RecruitmentRepository();
                    const participate_repo = new participate_1.ParticipateRepository();
                    const server_info_repo = new server_info_1.ServerInfoRepository();
                    const recruitment_list = yield recruitment_repo.get_m_recruitment_for_user(interaction.guildId || constants_1.Constants.STRING_EMPTY, interaction.user.id);
                    // check recruitment
                    if (recruitment_list == null || recruitment_list.length == 0) {
                        logger_1.logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                        yield interaction.reply(discord_message_1.DiscordMessage.get_no_recruitment());
                        throw new Error(`target user's recruitment is null or 0.`);
                    }
                    // get last recruitment
                    const recruitment = recruitment_list.slice(-1)[0] || new recruitment_1.Recruitment();
                    logger_1.logger.info(`select update target recruitment load ok. name = ${recruitment.name}, token = ${recruitment.token}`);
                    // load participate list
                    recruitment.user_list = yield participate_repo.get_t_participate(recruitment.token);
                    logger_1.logger.info(`select participate complete. token = ${recruitment.token}, participate count = ${recruitment.user_list.length}`);
                    // get target role
                    const server_info = yield server_info_repo.get_m_server_info(interaction.guildId || '');
                    logger_1.logger.info(`select server info completed. server id = ${server_info.server_id}`);
                    // delete old participate data
                    let affected_data_cnt = yield participate_repo.delete_t_participate(recruitment.token);
                    logger_1.logger.info(`delete old participate completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                    // delete old recruitment data
                    affected_data_cnt = yield recruitment_repo.delete_m_recruitment(recruitment.token);
                    logger_1.logger.info(`delete old recruitment completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                    // get new token
                    const new_token = yield recruitment_repo.get_m_recruitment_token();
                    logger_1.logger.info(`generate new token completed. new token = ${new_token}`);
                    // set to instance
                    recruitment.token = new_token;
                    recruitment.user_list.forEach((v) => {
                        v.token = new_token;
                    });
                    // edit recruitment
                    recruitment.name = discord_common_1.DiscordCommon.replace_intaraction_description_roles(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_DESCRIPTION_ID), discord_common_1.DiscordCommon.get_role_info_from_guild(interaction.guild));
                    // default limit date
                    const default_date = new Date();
                    default_date.setHours(default_date.getHours() + discord_interaction_analyzer_1.DiscordInteractionAnalyzer.HOURS_DEFAULT);
                    // analyze limit_time 
                    recruitment.limit_time = discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_time(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_TIME_ID), constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || default_date;
                    // recruitment registration
                    affected_data_cnt = yield recruitment_repo.insert_m_recruitment(recruitment);
                    logger_1.logger.info(`regist new recruitment completed. id = ${recruitment.id}, token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                    // participate registration.
                    affected_data_cnt = yield participate_repo.insert_t_participate_list(recruitment.user_list);
                    logger_1.logger.info(`regist new participate completed. id = ${recruitment.id}, token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                    // check server info registed
                    if (server_info.channel_id == constants.RECRUITMENT_INVALID_CHANNEL_ID) {
                        logger_1.logger.warn(`not regist server info, send warning message.`);
                    }
                    // compete all tasks
                    logger_1.logger.info(`registration complete. : id = ${recruitment.id}, token = ${recruitment.token}, channel_id = ${server_info.channel_id}, recruitment_target_role = ${server_info.recruitment_target_role}`);
                    logger_1.logger.trace(recruitment);
                    // create join button
                    const action_row = new Discord.ActionRowBuilder()
                        .addComponents(discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTUN_JOIN, discord_common_1.DiscordCommon.BUTTON_STYLE_PRIMARY), discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTON_DECLINE, discord_common_1.DiscordCommon.BUTTON_STYLE_DANGER), discord_common_1.DiscordCommon.get_button(`${constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX}${recruitment.token}`, constants.DISCORD_BUTTON_VIEW, discord_common_1.DiscordCommon.BUTTON_STYLE_SUCCESS));
                    // send reply message
                    yield interaction.reply({
                        embeds: [discord_message_1.DiscordMessage.get_edit_recruitment_message(recruitment, server_info.recruitment_target_role)],
                        components: [action_row],
                    });
                    // resolve
                    resolve(true);
                }
                catch (err) {
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`edit recruitment error. error = ${err}`);
                }
            }));
        });
    }
    /**
     * Get recruitment from interaction.
     * @param interaction
     */
    static get_recruitment(interaction) {
        var _a;
        // create recruitment
        const recruitment = new recruitment_1.Recruitment();
        // get name
        recruitment.name = discord_common_1.DiscordCommon.replace_intaraction_description_roles(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_DESCRIPTION_ID), discord_common_1.DiscordCommon.get_role_info_from_guild(interaction.guild));
        recruitment.owner_id = interaction.user.id;
        // token is setted after
        recruitment.token = '';
        // default limit date
        const default_date = new Date();
        default_date.setHours(default_date.getHours() + discord_interaction_analyzer_1.DiscordInteractionAnalyzer.HOURS_DEFAULT);
        // analyze limit_time 
        recruitment.limit_time = discord_interaction_analyzer_1.DiscordInteractionAnalyzer.get_recruitment_time(interaction.fields.getTextInputValue(constants.DISCORD_MODAL_TIME_ID), constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || default_date;
        // initialize other values
        recruitment.server_id = interaction.guildId || constants_1.Constants.STRING_EMPTY;
        recruitment.message_id = ((_a = interaction.message) === null || _a === void 0 ? void 0 : _a.id) || constants_1.Constants.STRING_EMPTY;
        recruitment.status = constants.STATUS_ENABLED;
        recruitment.description = "";
        recruitment.delete = false;
        return recruitment;
    }
    /**
     * Get participate from interaction.
     * @param interaction
     */
    static get_owner_participate(interaction) {
        // create participate info
        const participate = new participate_2.Participate();
        participate.user_id = interaction.user.id;
        participate.status = constants.STATUS_ENABLED;
        participate.delete = false;
        // token is setted after
        participate.token = '';
        return participate;
    }
}
exports.ModalSubmitRecruitmentController = ModalSubmitRecruitmentController;
//# sourceMappingURL=modal_submit_recruitment_controller.js.map