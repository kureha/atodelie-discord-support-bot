"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ロガーを定義
const logger_1 = require("./common/logger");
// 定数定義を読み込む
const constants_1 = require("./common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
// check db and init
const initialize_1 = require("./db/initialize");
initialize_1.InitializeRepository.initialize_database_if_not_exists();
// ready event
client.on('ready', () => {
    client.user.setPresence({ activity: { name: constants.DISCORD_ACTIVITY_NAME }, status: 'online' });
    logger_1.logger.info(`logged on discord server.`);
});
// message is sended event
const discord_message_controller_1 = require("./controller/discord_message_controller");
client.on('messageCreate', (message) => {
    // call message recieve controller
    discord_message_controller_1.DiscordMessageController.recirve_controller(client, message);
});
// interaction event
const discord_interaction_controller_1 = require("./controller/discord_interaction_controller");
client.on('interactionCreate', async (interaction) => {
    // call interaction recieve controller
    discord_interaction_controller_1.DiscordInteractionController.recirve_controller(client, interaction);
});
// cron event
const node_cron_1 = __importDefault(require("node-cron"));
logger_1.logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
const cron_controller_1 = require("./controller/cron_controller");
node_cron_1.default.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
    // follow recruitment member
    cron_controller_1.CronController.follow_recruitment_member(client);
}));
// discord client login
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=bot.js.map