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
exports.SelectInteractionFriendCodeController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import databace access modules
const friend_code_1 = require("../db/friend_code");
// create message modules
const discord_message_1 = require("../logic/discord_message");
// import entities
const friend_code_2 = require("../entity/friend_code");
// import discord modules
const Discord = __importStar(require("discord.js"));
// import logic
const discord_common_1 = require("../logic/discord_common");
const friend_code_history_1 = require("../db/friend_code_history");
class SelectInteractionFriendCodeController {
    /**
     * search friend code
     * @param interaction
     */
    static search_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // check values
                    if (interaction.guild == undefined) {
                        throw new Error(`Discord interaction guild is undefined.`);
                    }
                    logger_1.logger.info(`request search friend code modal by selected game.`);
                    // get value from interaction
                    const target_game_id = discord_common_1.DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);
                    // get game name
                    const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
                    logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                    // search master
                    const repo = new friend_code_1.FriendCodeRepository();
                    const friend_code_list = yield repo.get_t_friend_code_from_game_id(discord_common_1.DiscordCommon.get_guild_id_from_guild(interaction.guild), target_game_id);
                    // struct embed message
                    const embed_message = new Discord.EmbedBuilder({
                        description: discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_SEARCH_FRIEND_CODE, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, target_game_name, target_game_id),
                        timestamp: new Date(),
                        fields: [],
                    });
                    // push friend codes to embed message field
                    let cnt_valid_friend_code = 0;
                    friend_code_list.forEach((fc) => {
                        if (fc.friend_code.length > 0) {
                            embed_message.addFields({
                                name: fc.user_name,
                                value: fc.friend_code,
                                inline: true,
                            });
                            cnt_valid_friend_code = cnt_valid_friend_code + 1;
                        }
                        else {
                            logger_1.logger.trace(`target friend code is blank, skipped. server_id = ${fc.server_id}, user_name = ${fc.user_name}, game_name = ${fc.game_name}`);
                        }
                    });
                    // if friend code is not registed, reply special message
                    if (cnt_valid_friend_code == 0) {
                        // reply for not registed
                        yield interaction.reply(discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_SEARCH_FRIEND_CODE_NOT_FOUND, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, target_game_name, target_game_id));
                        // resolve
                        resolve(false);
                    }
                    else {
                        // reply friend code
                        yield interaction.reply({ embeds: [embed_message] });
                        // resolve
                        resolve(true);
                    }
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`select game for search friend code error. error = ${err}`);
                }
            }));
        });
    }
    /**
     * regist friend code
     * @param interaction
     */
    static regist_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // check values
                    if (interaction.guild == undefined) {
                        throw new Error(`Discord interaction guild is undefined.`);
                    }
                    logger_1.logger.info(`request regist friend code modal by selected game.`);
                    // get value from interaction
                    const target_game_id = discord_common_1.DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);
                    // get game name
                    const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
                    logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                    // input component
                    const custom_id_text_input = constants.DISCORD_MODAL_FRIEND_CODE_ID;
                    const custom_id_modal = `${constants.DISCORD_MODAL_CUSTOM_ID_REGIST_FRIEND_CODE}-${target_game_id}`;
                    logger_1.logger.info(`create modal from custom id. custom_id_modal = ${custom_id_modal}, custom_id_text_input = ${custom_id_text_input}`);
                    // build text input
                    const friend_code_text = discord_common_1.DiscordCommon.get_text_input(custom_id_text_input, discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_FRIEND_CODE_MODAL_FRIEND_CODE, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, constants_1.Constants.STRING_EMPTY, target_game_name, target_game_id), discord_common_1.DiscordCommon.TEXT_INPUT_STYLE_PHARAGRAPH);
                    // try to load registed info
                    const fc_repo = new friend_code_1.FriendCodeRepository();
                    const friend_code_list = yield fc_repo.get_t_friend_code(interaction.guild.id, interaction.user.id);
                    // try to get registed data
                    friend_code_list.forEach((fc) => {
                        if (fc.game_id == target_game_id) {
                            // if matched, set value
                            logger_1.logger.info(`registed data is matched. game_id = ${fc.game_id}, friend code = ${fc.friend_code}`);
                            friend_code_text.setValue(fc.friend_code);
                            return;
                        }
                    });
                    // create action row and modal
                    const input_friend_code_action_row = new Discord.ActionRowBuilder().addComponents(friend_code_text);
                    const modal = new Discord.ModalBuilder()
                        .setCustomId(custom_id_modal)
                        .setTitle(constants.DISCORD_COMMAND_DESCRIPTION_REGIST_FRIEND_CODE)
                        .addComponents(input_friend_code_action_row);
                    // show modal
                    yield interaction.showModal(modal);
                    // resolve
                    resolve(true);
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`select game for regist friend code error. error = ${err}`);
                }
            }));
        });
    }
    /**
     * delete friend code
     * @param interaction
     */
    static delete_friend_code(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // check values
                    if (interaction.guild == undefined) {
                        throw new Error(`Discord interaction guild is undefined.`);
                    }
                    logger_1.logger.info(`request regist friend code modal by selected game.`);
                    // get value from interaction
                    const target_game_id = discord_common_1.DiscordCommon.get_interaction_value_by_idx(interaction.values, 0);
                    // get game name
                    const target_game_name = discord_common_1.DiscordCommon.get_game_master_from_list(target_game_id, discord_common_1.DiscordCommon.get_game_master_from_guild(interaction.guild, constants.DISCORD_FRIEND_CODE_IGNORE_ROLE_LIST, constants.DISCORD_FRIEND_CODE_OTHER_COUNT)).game_name;
                    logger_1.logger.info(`target game found. game_name = ${target_game_name}`);
                    // try to load registed info
                    const fc_repo = new friend_code_1.FriendCodeRepository();
                    const fc_history_repo = new friend_code_history_1.FriendCodeHistoryRepository();
                    const friend_code_list = yield fc_repo.get_t_friend_code(interaction.guild.id, interaction.user.id);
                    // define friend code values
                    let friend_code = new friend_code_2.FriendCode();
                    let is_registed_data = false;
                    // try to get registed data
                    friend_code_list.forEach((fc) => {
                        if (fc.game_id == target_game_id) {
                            // if matched, set value
                            logger_1.logger.info(`registed data is matched. game_id = ${fc.game_id}, friend code = ${fc.friend_code}`);
                            friend_code = fc;
                            is_registed_data = true;
                        }
                    });
                    // check data is registed
                    if (is_registed_data) {
                        // update
                        logger_1.logger.info(`delete friend code.`);
                        // delete data
                        friend_code.delete = true;
                        let affected_data_cnt = yield fc_repo.delete_t_friend_code(interaction.guild.id, interaction.user.id, target_game_id);
                        logger_1.logger.info(`delete completed. count = ${affected_data_cnt}`);
                        if (affected_data_cnt > 0) {
                            // insert to hisotry
                            affected_data_cnt = yield fc_history_repo.insert_t_friend_code(friend_code);
                            logger_1.logger.info(`insert history completed. affected_data_cnt = ${affected_data_cnt}`);
                            // reply for deleted
                            yield interaction.reply(discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_DELETE_FRIEND_CODE, friend_code.friend_code, discord_common_1.DiscordCommon.get_user_name_from_user(interaction.user), discord_common_1.DiscordCommon.get_user_id_from_user(interaction.user), target_game_name, target_game_id));
                            // resolve
                            resolve(true);
                        }
                        else {
                            // if delete is 0, failed to regist
                            throw new Error(`data is not affected. user_id = ${friend_code.user_id}, game_id = ${friend_code.game_id}, friend_code = ${friend_code.friend_code}, count = ${affected_data_cnt}`);
                        }
                    }
                    else {
                        // reply for not found
                        yield interaction.reply(discord_message_1.DiscordMessage.get_friend_code_message(constants.DISCORD_MESSAGE_DELETE_FRIEND_CODE_NOT_FOUND, constants_1.Constants.STRING_EMPTY, discord_common_1.DiscordCommon.get_user_name_from_user(interaction.user), discord_common_1.DiscordCommon.get_user_id_from_user(interaction.user), target_game_name, target_game_id));
                        // resolve
                        resolve(false);
                    }
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`select game for delete friend code error. error = ${err}`);
                }
            }));
        });
    }
}
exports.SelectInteractionFriendCodeController = SelectInteractionFriendCodeController;
//# sourceMappingURL=select_interaction_friend_code_controller.js.map