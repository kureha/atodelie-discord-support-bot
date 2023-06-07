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
exports.CommandServerController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import logics
const discord_common_1 = require("../logic/discord_common");
class CommandServerController {
    /**
     * regist server master
     * @param interaction
     */
    static regist_server_master(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // get objects from discord.
                    if (interaction.guild == undefined) {
                        throw new Error(`Discord interaction guild is undefined.`);
                    }
                    logger_1.logger.info(`request regist server master.`);
                    // check privilleges
                    if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                        logger_1.logger.info(`regist server master privillege check ok. user id = ${interaction.user.id}`);
                    }
                    else {
                        logger_1.logger.error(`failed to regist server master privillege check. user id = ${interaction.user.id}`);
                        interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                        // resolve (no permissions)
                        resolve(false);
                        return;
                    }
                    // get role select menu action row
                    const role_select_action_row = discord_common_1.DiscordCommon.get_role_list_select_menu(constants.DISCORD_SELECT_MENU_CUSTOM_ID_REGIST_SERVER_MASTER, constants.DISCORD_MESSAGE_SETTING_ROLE_SELECT, interaction.guild);
                    // show (ephemeral)
                    yield interaction.reply({
                        content: constants.DISCORD_MESSAGE_SETTING_ROLE_SELECT,
                        components: [role_select_action_row],
                        ephemeral: true,
                    });
                    resolve(true);
                }
                catch (err) {
                    logger_1.logger.error(err);
                    yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                    reject(`regist server master error. error = ${err}`);
                }
            }));
        });
    }
}
exports.CommandServerController = CommandServerController;
//# sourceMappingURL=command_server_controller.js.map