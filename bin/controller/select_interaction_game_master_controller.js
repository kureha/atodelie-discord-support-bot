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
exports.SelectInteractionGameMasterController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import databace access modules
const game_master_1 = require("../db/game_master");
// import discord modules
const Discord = __importStar(require("discord.js"));
// import logic
const discord_common_1 = require("../logic/discord_common");
const discord_message_1 = require("../logic/discord_message");
// import entity
const game_master_2 = require("../entity/game_master");
class SelectInteractionGameMasterController {
    constructor() {
        this.game_master_repo = new game_master_1.GameMasterRepository();
    }
    /**
     * edit game master
     * @param interaction
     */
    edit_game_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check values
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger_1.logger.info(`request edit game master privillege check ok. user id = ${interaction.user.id}`);
                }
                else {
                    logger_1.logger.error(`request edit game master failed to privillege check. user id = ${interaction.user.id}`);
                    interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                logger_1.logger.info(`request edit game master modal by selected game.`);
                // get value from interaction
                const target_game_id = discord_common_1.DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);
                // get game name
                const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 0)).game_name;
                logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                // input component
                const custom_id_text_input = constants.DISCORD_MODAL_GAME_MASTER_PRESENCE_NAME_ID;
                const custom_id_modal = `${constants.DISCORD_MODAL_CUSTOM_ID_EDIT_GAME_MASTER}-${target_game_id}`;
                logger_1.logger.info(`create modal from custom id. custom_id_modal = ${custom_id_modal}, custom_id_text_input = ${custom_id_text_input}`);
                // build text input
                const precense_name_text = discord_common_1.DiscordCommon.get_text_input(custom_id_text_input, discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_GAME_MASTER_MODAL_PRECENSE_NAME, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, target_game_name, target_game_id), discord_common_1.DiscordCommon.TEXT_INPUT_STYLE_SHORT);
                // try to load registed info
                let game_master = new game_master_2.GameMaster();
                try {
                    game_master = yield this.game_master_repo.get_m_game_master(interaction.guild.id, target_game_id);
                    // try to get registed data and set value
                    logger_1.logger.info(`registed data is matched. game_id = ${game_master.game_id}, precense_name = ${game_master.presence_name}`);
                    precense_name_text.setValue(game_master.presence_name);
                }
                catch (err) {
                    // do nothing
                    logger_1.logger.info(`registed data is not matched. create blank input text.`);
                }
                // create action row and modal
                const input_game_master_precense_action_row = new Discord.ActionRowBuilder().addComponents(precense_name_text);
                const modal = new Discord.ModalBuilder()
                    .setCustomId(custom_id_modal)
                    .setTitle(constants.DISCORD_GAME_MASTER_MODAL_DESCRIPTION)
                    .addComponents(input_game_master_precense_action_row);
                // show modal
                yield interaction.showModal(modal);
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`edit game master error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`edit game master completed.`);
            return true;
        });
    }
    /**
     * reset game master
     * @param interaction
     */
    reset_game_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check values
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger_1.logger.info(`request reset game master privillege check ok. user id = ${interaction.user.id}`);
                }
                else {
                    logger_1.logger.error(`request reset game master failed to privillege check. user id = ${interaction.user.id}`);
                    interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                logger_1.logger.info(`request reset game master modal by selected game.`);
                // get value from interaction
                const target_game_id = discord_common_1.DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);
                // get game name
                const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, 0)).game_name;
                logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                // try to load registed info
                const affected_data_cnt = yield this.game_master_repo.delete_m_game_master(interaction.guild.id, target_game_id);
                // try to get registed data and set value
                logger_1.logger.info(`delete game master successed. delete count = ${affected_data_cnt}`);
                // send result message
                if (affected_data_cnt > 0) {
                    logger_1.logger.info(`registration compoleted.`);
                    yield interaction.reply(constants.DISCORD_MESSAGE_RESET_GAME_MASTER
                        .replace('%%GAME_NAME%%', target_game_name));
                }
                else {
                    // if update row count is low, failed to regist
                    throw new Error(`data is not affected. game_id = ${target_game_id}, game_name = ${target_game_name}, count = ${affected_data_cnt}`);
                }
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`select game for reset game master error.`, err);
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            logger_1.logger.info(`reset game master completed.`);
            return true;
        });
    }
}
exports.SelectInteractionGameMasterController = SelectInteractionGameMasterController;
//# sourceMappingURL=select_interaction_game_master_controller.js.map