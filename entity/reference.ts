// import constants
import { Constants } from '../common/constants';

// define logger
import { logger } from '../common/logger';

// import discord modules
import * as Discord from 'discord.js';

export class Reference {
    channel_id: string;
    guild_id: string;
    message_id: string;

    /**
     * constructor
     * @param discord_reference discord's message reference (exists when interaction message)
     * @constructor
     */
    constructor(discord_reference: Discord.MessageReference | null | undefined) {
        if (discord_reference == undefined) {
            this.channel_id = Constants.STRING_EMPTY;
            this.guild_id = Constants.STRING_EMPTY;
            this.message_id = Constants.STRING_EMPTY;

            logger.warn(`invalid discord reference, create empty reference.`);
            logger.trace(this);
        } else {
            this.channel_id = discord_reference.channelId;
            this.guild_id = discord_reference.guildId || Constants.STRING_EMPTY;
            this.message_id = discord_reference.messageId || Constants.STRING_EMPTY;

            logger.trace(`valid discord reference.`);
            logger.trace(this);
        }
    }
}