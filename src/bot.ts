// define logger
import { logger } from './common/logger';

// import discord modules
import * as Discord from 'discord.js';
import { CommandController } from './controller/command_controller';
import { ModalSubmitController } from './controller/modal_submit_controller';
import { ButtonInteractionController } from './controller/button_interaction_controller';
import { SelectInteractionController } from './controller/select_interaction_controller';

// import cron modules
import * as cron from 'node-cron';
import { CronFollowController } from './controller/cron_follow_controller';

// import constants
import { Constants } from './common/constants';
const constants = new Constants();

// import fs modules
import { MessageController } from './controller/message_controller';
import { CronVoiceChannelRenameController } from './controller/cron_voice_channel_rename_controller';
import { CronAnnouncementController } from './controller/cron_announcement_controller';
import { CronActivityRecordController } from './controller/cron_activity_controller';

try {
    // create client
    const client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.GuildVoiceStates]
    });

    // client is ready?
    client.once(Discord.Events.ClientReady, () => {
        logger.info(`discord client is ready.`);
    });

    // login
    client.login(process.env['DISCORD_BOT_TOKEN']);

    // message section
    client.on(Discord.Events.MessageCreate, (message: Discord.Message<boolean>) => {
        if (client.user != undefined) {
            // call message controller
            MessageController.recirve(message, client.user.id);
        }
    });

    // interaction section
    client.on(Discord.Events.InteractionCreate, async (interaction: Discord.Interaction) => {
        if (interaction.isChatInputCommand()) {
            // call command controller
            CommandController.recieve(interaction);
        };

        if (interaction.isStringSelectMenu()) {
            // call select menu controller
            SelectInteractionController.recieve(interaction);
        }

        if (interaction.isButton()) {
            // call button controller
            ButtonInteractionController.recieve(interaction);
        }

        if (interaction.isModalSubmit()) {
            // call modal submit controller
            ModalSubmitController.recieve(interaction);
        }
    });

    // cron section for follow
    logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
    cron.schedule(constants.DISCORD_FOLLOW_CRON, (async () => {
        const follow_controller = new CronFollowController();
        await follow_controller.follow_recruitment_member(client);
    }));

    // cron section for record activity
    logger.info(`record activity cron setting : ${constants.DISCORD_ACTIVITY_RECORD_CRON}`);
    cron.schedule(constants.DISCORD_ACTIVITY_RECORD_CRON, (async () => {
        const activity_record_controller = new CronActivityRecordController();
        await activity_record_controller.activity_history_regist(client)
    }));

    // cron section for auto announcement
    logger.info(`auto announcement setting : ${constants.DISCORD_AUTO_ANNOUNCE_CRON}`);
    cron.schedule(constants.DISCORD_AUTO_ANNOUNCE_CRON, (async () => {
        const announcement_controller = new CronAnnouncementController();
        await announcement_controller.auto_annoucement(client);
    }));

    // cron section for update channel name
    logger.info(`update channel name cron setting : ${constants.DISCORD_UPDATE_CHANNEL_NAME_CRON}`);
    cron.schedule(constants.DISCORD_UPDATE_CHANNEL_NAME_CRON, (async () => {
        const channel_rename_controller = new CronVoiceChannelRenameController();
        await channel_rename_controller.update_voice_channel_name(client);
    }));

} catch (err) {
    // loggin error
    logger.error(`fatal error. bot stopped.`, err)
}