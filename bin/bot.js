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
// import discord modules
const Discord = __importStar(require("discord.js"));
const command_controller_1 = require("./controller/command_controller");
const modal_submit_controller_1 = require("./controller/modal_submit_controller");
const button_interaction_controller_1 = require("./controller/button_interaction_controller");
const select_interaction_controller_1 = require("./controller/select_interaction_controller");
// import cron modules
const cron = __importStar(require("node-cron"));
const cron_follow_controller_1 = require("./controller/cron_follow_controller");
// import constants
const constants_1 = require("./common/constants");
const constants = new constants_1.Constants();
// import fs modules
const fs = __importStar(require("fs"));
const message_controller_1 = require("./controller/message_controller");
const cron_voice_channel_rename_controller_1 = require("./controller/cron_voice_channel_rename_controller");
try {
    // check database file
    if (fs.existsSync(constants.SQLITE_FILE)) {
        logger_1.logger.debug(`database file is ok. path = ${constants.SQLITE_FILE}`);
    }
    else {
        logger_1.logger.warn(`database file is not exists. initialize file. from = ${constants.SQLITE_TEMPLATE_FILE}, dest = ${constants.SQLITE_FILE}`);
        fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, constants.SQLITE_FILE);
        logger_1.logger.info(`database file initialize ok.`);
    }
    // create client
    const client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildPresences,
            Discord.GatewayIntentBits.GuildVoiceStates
        ]
    });
    // client is ready?
    client.once(Discord.Events.ClientReady, () => {
        logger_1.logger.info(`discord client is ready.`);
    });
    // login
    client.login(process.env['DISCORD_BOT_TOKEN']);
    // message section
    client.on(Discord.Events.MessageCreate, (message) => {
        if (client.user != undefined) {
            // call message controller
            message_controller_1.MessageController.recirve(message, client.user.id);
        }
    });
    // interaction section
    client.on(Discord.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (interaction.isChatInputCommand()) {
            // call command controller
            command_controller_1.CommandController.recieve(interaction);
        }
        ;
        if (interaction.isStringSelectMenu()) {
            // call select menu controller
            select_interaction_controller_1.SelectInteractionController.recieve(interaction);
        }
        if (interaction.isButton()) {
            // call button controller
            button_interaction_controller_1.ButtonInteractionController.recieve(interaction);
        }
        if (interaction.isModalSubmit()) {
            // call modal submit controller
            modal_submit_controller_1.ModalSubmitController.recieve(interaction);
        }
    }));
    // cron section for change name
    logger_1.logger.info(`update channel name cron setting : ${constants.DISCORD_UPDATE_CHANNEL_NAME_CRON}`);
    cron.schedule(constants.DISCORD_UPDATE_CHANNEL_NAME_CRON, (() => {
        cron_voice_channel_rename_controller_1.CronVoiceChannelRenameController.update_voice_channel_name(client);
    }));
    // cron section for follow
    logger_1.logger.info(`follow cron setting : ${constants.DISCORD_FOLLOW_CRON}`);
    cron.schedule(constants.DISCORD_FOLLOW_CRON, (() => {
        // follow recruitment member
        cron_follow_controller_1.CronFollowController.follow_recruitment_member(client);
    }));
}
catch (err) {
    // loggin error
    logger_1.logger.error(`fatal error. error = ${err}`);
}
//# sourceMappingURL=bot.js.map