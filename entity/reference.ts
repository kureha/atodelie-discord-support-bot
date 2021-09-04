// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

export class Reference {
    channel_id: string;
    guild_id: string;
    message_id: string;

    /**
     * コンストラクタ
     * @param discord_reference Discordのmessage.reference
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