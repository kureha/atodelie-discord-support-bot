// define logger
import { logger } from '../common/logger';

export class Reference {
    channel_id: string;
    guild_id: string;
    message_id: string;

    /**
     * constructor
     * @param discord_reference discord's message reference (exists when interaction message)
     * @constructor
     */
    constructor(discord_reference: any) {
        if (discord_reference) {
            this.channel_id = discord_reference.channelId;
            this.guild_id = discord_reference.guildId;
            this.message_id = discord_reference.messageId;
            logger.trace(`valid discord reference.`);
            logger.trace(this);
        } else {
            this.channel_id = '';
            this.guild_id = '';
            this.message_id = '';
        }
    }
}