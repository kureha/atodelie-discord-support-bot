"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
// import constants
const constants_1 = require("../common/constants");
// define logger
const logger_1 = require("../common/logger");
class Reference {
    /**
     * constructor
     * @param discord_reference discord's message reference (exists when interaction message)
     * @constructor
     */
    constructor(discord_reference) {
        if (discord_reference == undefined) {
            this.channel_id = constants_1.Constants.STRING_EMPTY;
            this.guild_id = constants_1.Constants.STRING_EMPTY;
            this.message_id = constants_1.Constants.STRING_EMPTY;
            logger_1.logger.warn(`invalid discord reference, create empty reference.`);
            logger_1.logger.trace(this);
        }
        else {
            this.channel_id = discord_reference.channelId;
            this.guild_id = discord_reference.guildId || constants_1.Constants.STRING_EMPTY;
            this.message_id = discord_reference.messageId || constants_1.Constants.STRING_EMPTY;
            logger_1.logger.trace(`valid discord reference.`);
            logger_1.logger.trace(this);
        }
    }
}
exports.Reference = Reference;
//# sourceMappingURL=reference.js.map