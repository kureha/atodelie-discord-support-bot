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
exports.SelectInteractionServerController = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import databace access modules
const server_info_1 = require("../db/server_info");
// create message modules
const discord_message_1 = require("../logic/discord_message");
// import entities
const server_info_2 = require("../entity/server_info");
// import logic
const discord_common_1 = require("../logic/discord_common");
class SelectInteractionServerController {
    /**
     * regist server master
     * @param interaction
     */
    static regist_server_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // check values
                    if (interaction.guild == undefined) {
                        throw new Error(`Discord interaction guild is undefined.`);
                    }
                    logger_1.logger.info(`request regist server master by selected role.`);
                    // check privilleges
                    if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                        logger_1.logger.info(`privillege check ok. user id = ${interaction.user.id}`);
                    }
                    else {
                        logger_1.logger.error(`failed to privillege check. user id = ${interaction.user.id}`);
                        yield interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                        // resolve (no permissions)
                        resolve(false);
                        return;
                    }
                    // get objects from discord.
                    const guild = interaction.guild;
                    // create db instances
                    const server_info_repo = new server_info_1.ServerInfoRepository();
                    // recruitment role string
                    let server_info = new server_info_2.ServerInfo();
                    // get value from interaction
                    let target_role = constants_1.Constants.STRING_EMPTY;
                    if (interaction.values.length == 0) {
                        logger_1.logger.error(`selected value is not exists.`);
                        interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION}`);
                        // resolve
                        resolve(false);
                        return;
                    }
                    else {
                        target_role = interaction.values[0] || constants_1.Constants.STRING_EMPTY;
                        logger_1.logger.info(`announcement target role = ${target_role}`);
                    }
                    // create server info instance
                    server_info.server_id = interaction.guild.id;
                    server_info.channel_id = interaction.channelId;
                    server_info.recruitment_target_role = target_role;
                    server_info.follow_time = constants_1.Constants.get_default_date();
                    // registration start.
                    try {
                        // try to insert
                        const affected_data_cnt = yield server_info_repo.insert_m_server_info(server_info);
                        logger_1.logger.info(`insert m_server_info completed. affected_data_cnt = ${affected_data_cnt}`);
                    }
                    catch (err) {
                        // if error, try to update
                        logger_1.logger.info(`insert m_server_info failed, try to update. err = (${err})`);
                        const affected_data_cnt = yield server_info_repo.update_m_server_info(server_info);
                        logger_1.logger.info(`update m_server_info completed. affected_data_cnt = ${affected_data_cnt}`);
                    }
                    // get server info
                    server_info = yield server_info_repo.get_m_server_info(guild.id);
                    logger_1.logger.trace(server_info);
                    // send success message
                    yield interaction.reply({
                        content: discord_message_1.DiscordMessage.get_regist_server_info(server_info.recruitment_target_role),
                        ephemeral: true
                    });
                    // resolve
                    resolve(true);
                }
                catch (err) {
                    // send error message
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`regist server master error. error = ${err}`);
                }
            }));
        });
    }
}
exports.SelectInteractionServerController = SelectInteractionServerController;
//# sourceMappingURL=select_interaction_server_controller.js.map