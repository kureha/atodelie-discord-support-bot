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
exports.CommandRecruitmentController = void 0;
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
const recruitment_1 = require("../entity/recruitment");
// import logics
const discord_message_1 = require("../logic/discord_message");
const discord_common_1 = require("../logic/discord_common");
class CommandRecruitmentController {
    constructor() {
        this.recruitment_repo = new recruitement_1.RecruitmentRepository();
        this.participate_repo = new participate_1.ParticipateRepository();
        this.server_info_repo = new server_info_1.ServerInfoRepository();
    }
    /**
     * Create new reqruitment
     * @param interaction interaction
     */
    new_recruitment_input_modal(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // show input modal
                logger_1.logger.info(`request new recruitment. show blank modal.`);
                // create the modal
                const modal = new Discord.ModalBuilder()
                    .setCustomId(constants.DISCORD_MODAL_CUSTOM_ID_NEW_RECRUITMENT)
                    .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_NEW_RECRUITMENT);
                // show modal
                yield this.show_recruitment_input_modal(interaction, modal, undefined, undefined);
            }
            catch (err) {
                logger_1.logger.error(`show modal for new recruitment error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`show modal for new recruitment completed.`);
            return true;
        });
    }
    /**
     * Edit user's last recruitment
     * @param interaction
     */
    edit_recruitment_input_modal(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`request edit recruitment. load last recruitment for target user.`);
                // load from db
                const recruitment_list = yield this.recruitment_repo.get_m_recruitment_for_user(interaction.guildId || constants_1.Constants.STRING_EMPTY, interaction.user.id);
                // check recruitment
                if (recruitment_list == null || recruitment_list.length == 0) {
                    logger_1.logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                    yield interaction.reply(discord_message_1.DiscordMessage.get_no_recruitment());
                    throw new Error(`target user's recruitment is null or 0.`);
                }
                // get last recruitment
                const recruitment = recruitment_list.slice(-1)[0] || new recruitment_1.Recruitment();
                logger_1.logger.info(`select recruitment complete. name = ${recruitment.name}, token = ${recruitment.token}`);
                // show input modal
                logger_1.logger.info(`request edit recruitment. show edit modal.`);
                // create the modal
                const modal = new Discord.ModalBuilder()
                    .setCustomId(constants.DISCORD_MODAL_CUSTOM_ID_EDIT_RECRUITMENT)
                    .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_EDIT_RECRUITMENT);
                yield this.show_recruitment_input_modal(interaction, modal, recruitment.limit_time, recruitment.name);
            }
            catch (err) {
                logger_1.logger.error(`show modal for edit recruitment error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`show modal for edit recruitment completed.`);
            return true;
        });
    }
    /**
     * show modal to user
     * @param interaction
     * @param modal
     * @param limit_time initrial value. if limit time is not defined, set undefined.
     * @param description initrial value. if description is not defined, set undefined.
     */
    show_recruitment_input_modal(interaction, modal, limit_time, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // time
                const time_text = discord_common_1.DiscordCommon.get_text_input(constants.DISCORD_MODAL_TIME_ID, constants.DISCORD_RECRUITMENT_MODAL_TIME, 
                // Paragraph means single lines of text.
                discord_common_1.DiscordCommon.TEXT_INPUT_STYLE_SHORT);
                // pharagraph
                const dscripiion_text = discord_common_1.DiscordCommon.get_text_input(constants.DISCORD_MODAL_DESCRIPTION_ID, constants.DISCORD_RECRUITMENT_MODAL_DESCRIPTION, 
                // Paragraph means multiple lines of text.
                discord_common_1.DiscordCommon.TEXT_INPUT_STYLE_PHARAGRAPH);
                // set initial values if value is not null
                if (limit_time != undefined) {
                    time_text.setValue(discord_common_1.DiscordCommon.get_limit_time_str(limit_time));
                }
                if (description != undefined) {
                    dscripiion_text.setValue(description);
                }
                // crteate action row
                const first_action_row = new Discord.ActionRowBuilder().addComponents(time_text);
                const second_action_row = new Discord.ActionRowBuilder().addComponents(dscripiion_text);
                // Add inputs to the modal
                modal.addComponents(first_action_row, second_action_row);
                // Show the modal to the user
                yield interaction.showModal(modal);
            }
            catch (err) {
                logger_1.logger.error(err);
                throw err;
            }
            return true;
        });
    }
    /**
     * Delete last interaction
     * @param interaction
     */
    delete_recruitment(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`request delete recruitment. load last recruitment for target user.`);
                // select user's enable recruitment list
                const recruitment_list = yield this.recruitment_repo.get_m_recruitment_for_user(interaction.guildId || constants_1.Constants.STRING_EMPTY, interaction.user.id);
                // check recruitment
                if (recruitment_list == null || recruitment_list.length == 0) {
                    logger_1.logger.error(`target user's recruitment is null or 0. server_id = ${interaction.guildId}, user_id = ${interaction.user.id}`);
                    yield interaction.reply(discord_message_1.DiscordMessage.get_no_recruitment());
                    throw new Error(`target user's recruitment is null or 0.`);
                }
                // get last recruitment
                const recruitment = recruitment_list.slice(-1)[0] || new recruitment_1.Recruitment();
                logger_1.logger.info(`select recruitment complete. name = ${recruitment.name}, token = ${recruitment.token}`);
                // load participate
                recruitment.user_list = yield this.participate_repo.get_t_participate(recruitment.token);
                logger_1.logger.info(`select participate complete. token = ${recruitment.token}, participate count = ${recruitment.user_list.length}`);
                // delete old participate data
                let affected_data_cnt = yield this.participate_repo.delete_t_participate(recruitment.token);
                logger_1.logger.info(`delete old participate completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                // delete old recruitment data
                affected_data_cnt = yield this.recruitment_repo.delete_m_recruitment(recruitment.token);
                logger_1.logger.info(`delete old recruitment completed. old token = ${recruitment.token}, affected_data_cnt = ${affected_data_cnt}`);
                // get target role
                const server_info = yield this.server_info_repo.get_m_server_info(interaction.guildId || '');
                // send reply message
                yield interaction.reply({ embeds: [discord_message_1.DiscordMessage.get_delete_recruitment_message(recruitment, server_info.recruitment_target_role)] });
            }
            catch (err) {
                logger_1.logger.error(`delete recruitment error error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`delete recruitment completed.`);
            return true;
        });
    }
}
exports.CommandRecruitmentController = CommandRecruitmentController;
//# sourceMappingURL=command_recruitment_controller.js.map