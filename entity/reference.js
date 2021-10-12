"use strict";
exports.__esModule = true;
exports.Reference = void 0;
// define logger
var logger_1 = require("../common/logger");
var Reference = /** @class */ (function () {
    /**
     * constructor
     * @param discord_reference discord's message reference (exists when interaction message)
     * @constructor
     */
    function Reference(discord_reference) {
        if (discord_reference) {
            this.channel_id = discord_reference.channelId;
            this.guild_id = discord_reference.guildId;
            this.message_id = discord_reference.messageId;
            logger_1.logger.trace("valid discord reference.");
            logger_1.logger.trace(this);
        }
        else {
            this.channel_id = '';
            this.guild_id = '';
            this.message_id = '';
        }
    }
    return Reference;
}());
exports.Reference = Reference;
