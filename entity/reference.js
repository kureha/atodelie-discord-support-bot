"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
// define logger
const logger_1 = require("../common/logger");
class Reference {
    /**
     * constructor
     * @param discord_reference discord's message reference (exists when interaction message)
     * @constructor
     */
    constructor(discord_reference) {
        if (discord_reference) {
            this.channel_id = discord_reference.channelId;
            this.guild_id = discord_reference.guildId;
            this.message_id = discord_reference.messageId;
            logger_1.logger.trace(`valid discord reference.`);
            logger_1.logger.trace(this);
        }
        else {
            this.channel_id = '';
            this.guild_id = '';
            this.message_id = '';
        }
    }
}
exports.Reference = Reference;
//# sourceMappingURL=reference.js.map