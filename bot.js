"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// define logger
const logger_1 = require("./common/logger");
// import constants
const constants_1 = require("./common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = __importStar(require("discord.js"));
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
// check db and init
const initialize_1 = require("./db/initialize");
initialize_1.InitializeRepository.initialize_database_if_not_exists();
// ready event
client.on('ready', () => {
    if (client.user != null) {
        client.user.setPresence({ activities: [{ name: constants.DISCORD_ACTIVITY_NAME }], status: 'online' });
        logger_1.logger.info(`logged on discord server.`);
    }
    else {
        logger_1.logger.error(`client is not logined.`);
    }
});
// message is sended event
const discord_message_controller_1 = require("./controller/discord_message_controller");
client.on('messageCreate', (message) => {
    // call message recieve controller
    discord_message_controller_1.DiscordMessageController.recieve_controller(client, message);
});
// interaction event
const discord_interaction_controller_1 = require("./controller/discord_interaction_controller");
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isButton() == true) {
        // call interaction recieve controller
        discord_interaction_controller_1.DiscordInteractionController.recieve_controller(client, interaction);
    }
}));
// cron event
const cron = __importStar(require("node-cron"));
logger_1.logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
const cron_controller_1 = require("./controller/cron_controller");
cron.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
    // follow recruitment member
    cron_controller_1.CronController.follow_recruitment_member(client);
}));
// discord client login
client.login(process.env['DISCORD_BOT_TOKEN']);
//# sourceMappingURL=bot.js.map