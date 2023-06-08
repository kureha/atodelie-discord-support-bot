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
exports.CommandExportController = void 0;
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import logger
const logger_1 = require("../common/logger");
// import logics
const discord_common_1 = require("../logic/discord_common");
const discord_message_1 = require("../logic/discord_message");
const export_user_info_1 = require("../logic/export_user_info");
class CommandExportController {
    /**
     * user info list export
     * @param interaction
     */
    export_user_info(interaction, is_check_privillege = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get objects from discord.
                if (interaction.guild == undefined) {
                    throw new Error(`Discord interaction guild is undefined.`);
                }
                logger_1.logger.info(`request export user info.`);
                // check privilleges
                if (discord_common_1.DiscordCommon.check_privillege(constants.DISCORD_BOT_ADMIN_USER_ID, interaction.user.id, is_check_privillege) == true) {
                    logger_1.logger.info(`export user info privillege check ok. user id = ${interaction.user.id}`);
                }
                else {
                    logger_1.logger.error(`failed to export user info privillege check. user id = ${interaction.user.id}`);
                    interaction.reply(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // resolve (no permissions)
                    return false;
                }
                // get guild object
                const guild = interaction.guild;
                // create export user info instance
                const export_user_info = new export_user_info_1.ExportUserInfo();
                // get export file path from .env file
                const export_file_path = constants.EXPORT_USER_INFO_PATH;
                // get server info
                const member_info_list = yield guild.members.list({ limit: constants.USER_INFO_LIST_LIMIT_NUMBER, cache: false });
                logger_1.logger.info(`get user info from server completed.`);
                // parse discord's data to internal object
                const user_info_list = export_user_info.parse_user_info(member_info_list);
                logger_1.logger.info(`parsed user info data. count = ${user_info_list.length}`);
                // write user info list to file and get message
                const output_buffer = export_user_info.get_output_string(user_info_list);
                logger_1.logger.info(`output buffer created. length = ${output_buffer.length}`);
                // write buffer to file
                export_user_info.export_to_file(export_file_path, output_buffer);
                logger_1.logger.info(`output user info to file completed. path = ${export_file_path}`);
                // check member count is exceeded limit
                let message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO;
                if (guild.memberCount > constants.USER_INFO_LIST_LIMIT_NUMBER) {
                    logger_1.logger.info(`user info list count is exceeded discord's limit number ${constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED}.`);
                    message_string = constants.DISCORD_MESSAGE_EXPORT_USER_INFO_LIMIT_EXCEEDED;
                }
                // send message
                logger_1.logger.info(`ready to sending message.`);
                yield interaction.reply({
                    embeds: [
                        discord_message_1.DiscordMessage.get_export_user_info_embed_message(message_string)
                    ],
                    files: [export_file_path]
                });
            }
            catch (err) {
                // send error message
                logger_1.logger.error(`export user info error.`, err);
                // send error message
                yield interaction.reply(`${constants.DISCORD_MESSAGE_EXCEPTION} (Error : ${err})`);
                return false;
            }
            ;
            logger_1.logger.info(`export user info completed.`);
            return true;
        });
    }
}
exports.CommandExportController = CommandExportController;
//# sourceMappingURL=command_export_controller.js.map