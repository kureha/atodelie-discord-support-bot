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
exports.DiscordCommon = void 0;
// import entity
const user_info_1 = require("../entity/user_info");
const game_master_1 = require("../entity/game_master");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import discord modules
const Discord = __importStar(require("discord.js"));
const logger_1 = require("../common/logger");
class DiscordCommon {
    //#region discord guild and user data utils
    /**
     * check privillege for commands.
     * @param admin_user_id
     * @param check_user_id
     * @param is_check_privillege dry run. if false, always return true.
     * @returns true: privillege ok
     */
    static check_privillege(admin_user_id, check_user_id, is_check_privillege = true) {
        let result = false;
        if (is_check_privillege == false) {
            result = true;
        }
        else if (admin_user_id == check_user_id) {
            result = true;
        }
        return result;
    }
    /**
     * Get Text Channel from Discord
     * @param client
     * @param channel_id
     * @returns discord channel. if error, throw error
     */
    static get_text_channel(client, channel_id) {
        // get chache channel
        const text_channel = client.channels.cache.get(channel_id);
        if (text_channel == undefined) {
            // check channel exists
            throw new Error(`Target channel is not exists.`);
        }
        else if (text_channel.isTextBased() == false) {
            // check target channel is text channel
            throw new Error(`Target channel is not text channel.`);
        }
        else {
            // return values
            return text_channel;
        }
    }
    /**
     * get voice channel id list from guild
     * @param guild
     * @returns
     */
    static get_voice_channel_id_list(guild) {
        // define id list
        const id_list = [];
        // get voice channel id lists
        guild.channels.cache.forEach((channel) => {
            // check channel is voice channel
            if (channel.isVoiceBased() == true) {
                id_list.push(channel.id);
            }
        });
        // return lists
        return id_list;
    }
    /**
     * get voice based channel object
     * @param channel_id
     * @param guild
     * @returns throws exception if target id channel is null
     */
    static get_voice_channel(guild, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // force fetch channel
            const fetch_channel = yield guild.channels.fetch(channel_id, {
                cache: false,
                force: true
            });
            if (fetch_channel == undefined) {
                // check channel is null
                throw `Target channel is not exists.`;
            }
            else if (fetch_channel.isVoiceBased()) {
                // check channel types
                return fetch_channel;
            }
            else {
                throw `Target channel is not voice channel.`;
            }
        });
    }
    /**
     * get guild id from guild.
     * @param guild
     * @returns
     */
    static get_guild_id_from_guild(guild) {
        if (guild == undefined) {
            throw new Error(`guild id is undefined.`);
        }
        else {
            return guild.id;
        }
    }
    /**
     * get user id from user
     * @param user
     * @returns
     */
    static get_user_id_from_user(user) {
        if (user == undefined) {
            throw new Error(`user id is undefined.`);
        }
        else {
            return user.id;
        }
    }
    /**
     * get user name from user
     * @param user
     * @returns
     */
    static get_user_name_from_user(user) {
        if (user == undefined) {
            throw new Error(`user name is undefined.`);
        }
        else {
            return user.username;
        }
    }
    /**
     * Replace role in description
     * @param description intaraction's description
     * @param role_info_list role info list
     * @return
     */
    static replace_intaraction_description_roles(description, role_info_list) {
        // get name
        let ret_value = description;
        let is_replaced = false;
        // replace role string
        role_info_list.forEach((v) => {
            ret_value = ret_value.replace(new RegExp(`@${v.name}`, 'gm'), `<@&${v.id}>`);
            is_replaced = true;
        });
        // result
        if (is_replaced) {
            logger_1.logger.debug(`replace role completed. before = ${description}, after = ${ret_value}`);
        }
        // return values
        return ret_value;
    }
    //#endregion
    //#region discord get value utils
    /**
     * get value from interaction value array.
     * @param values
     * @param idx
     */
    static get_interaction_value_by_idx(values, idx) {
        if (values.length == 0) {
            logger_1.logger.error(`target index value is not exists.`);
            throw new Error(`target index value is not exists.`);
        }
        else if (idx < 0 || values.length < idx + 1) {
            logger_1.logger.error(`target idx is out of range. idx = ${idx}, array length = ${values.length}`);
            throw new Error(`target idx is out of range. idx = ${idx}, array length = ${values.length}`);
        }
        else if (values[idx] == undefined) {
            logger_1.logger.error(`target idx is undefined. idx = ${idx}`);
            throw new Error(`target idx is undefined. idx = ${idx}`);
        }
        return values[idx] || constants_1.Constants.STRING_EMPTY;
    }
    /**
     * get single user info from list by user_id
     * @param user_id
     * @param user_info_list
     */
    static get_single_user_info(user_id, user_info_list) {
        let ret = new user_info_1.UserInfo();
        const idx_user_info_not_found = -1;
        let idx_user_info_found = idx_user_info_not_found;
        user_info_list.forEach((u, idx) => {
            if (user_id == u.id) {
                logger_1.logger.info(`get user_info ok. user_id = ${user_id}, user_name = ${u.name}`);
                ret = u;
                idx_user_info_found = idx;
            }
        });
        if (idx_user_info_found == idx_user_info_not_found) {
            logger_1.logger.error(`target user info is not found. user_id = ${user_id}`);
            throw new Error(`target user info is not found. user_id = ${user_id}`);
        }
        return ret;
    }
    //#endregion
    //#region app's entity utils which relations discord utils
    /**
     * get game master from db list.
     * if not found, throw error.
     * @param game_id
     * @param game_master_list
     */
    static get_game_master_from_list(game_id, game_master_list) {
        let ret = undefined;
        game_master_list.forEach((gm) => {
            if (gm.game_id == game_id) {
                logger_1.logger.debug(`target game found. game_id = ${game_id}, game_name = ${gm.game_name}`);
                ret = gm;
            }
        });
        if (ret == undefined) {
            logger_1.logger.error(`target game not found. game_id = ${game_id}`);
            throw new Error(`target game not found. game_id = ${game_id}`);
        }
        return ret;
    }
    /**
     * Get role info from guild object
     * @param guild
     * @returns if null or undefined, return blank array
     */
    static get_role_info_from_guild(guild) {
        if (guild == undefined) {
            return [];
        }
        else {
            return user_info_1.RoleInfo.parse_list_from_discordjs(guild);
        }
    }
    /**
     * Get game info
     */
    static get_game_master_from_guild(guild, ignore_role_name_list, other_role_count) {
        // game master list
        let game_master_list = [];
        if (guild == undefined) {
            logger_1.logger.warn(`guild is undefined, can't create game master list from guild object.`);
        }
        else {
            // get role info
            const role_info_list = user_info_1.RoleInfo.parse_list_from_discordjs(guild);
            // create game master from role info
            role_info_list.forEach((v) => {
                // ignore listed role
                if (ignore_role_name_list.includes(v.name)) {
                    logger_1.logger.trace(`role ${v.name} is ignore from game master. skipped.`);
                    return;
                }
                // create game master info
                const t = new game_master_1.GameMaster();
                t.game_id = v.id;
                t.game_name = v.name;
                t.server_id = guild.id;
                t.regist_time = new Date();
                t.update_time = new Date();
                logger_1.logger.trace(`game master created from role info.`);
                logger_1.logger.trace(t);
                game_master_list.push(t);
            });
            // sort by character
            game_master_list = game_master_list.sort((a, b) => {
                if (a.game_name >= b.game_name) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
            // add special game master info
            [...Array(other_role_count)].map((_, idx) => {
                const game_master_other = new game_master_1.GameMaster();
                // idx is negative, because discord's role id is positive value.
                game_master_other.game_id = (-1000 + idx * -1).toString();
                game_master_other.game_name = constants.DISCORD_FRIEND_CODE_OTHER_NAME_FORMAT.replace('%%DISCORD_FRIEND_CODE_OTHER_COUNT%%', (idx + 1).toString());
                game_master_other.server_id = guild.id;
                game_master_other.regist_time = new Date();
                game_master_other.update_time = new Date();
                game_master_list.push(game_master_other);
            });
            logger_1.logger.info(`game master final length: ${game_master_list.length}`);
        }
        // return empty array
        return game_master_list;
    }
    //#endregion
    //#region discord interaction action (select menu, modal, etc...) utils
    /**
     * create game master list for discord action row
     * @param custom_id discord action row's id
     * @param game_master_list game master list
     * @param split_length select menu's length. discord's limit is 25.
     * @returns
     */
    static get_game_master_list_select_menu(custom_id, game_master_list, split_length) {
        const row_list = [];
        // check input value
        if (split_length < 1) {
            throw new Error(`split length can't be under 1. split_length = ${split_length}`);
        }
        for (let select_idx = 0; select_idx < (game_master_list.length / split_length); select_idx++) {
            // create select custom id
            const select_custom_id = `${custom_id}-${select_idx}`;
            logger_1.logger.info(`create game select menu. idx = ${select_idx}, custom_id = ${select_custom_id}`);
            // create select menu
            const select_menu = new Discord.StringSelectMenuBuilder()
                .setCustomId(select_custom_id);
            // buffer of option label list
            const options_label_list = [];
            // push game list
            for (let i = 0; i < split_length; i++) {
                // calculate idx
                const target_idx = split_length * select_idx + i;
                // check array's value is not undedined
                if (game_master_list[target_idx] == undefined) {
                    logger_1.logger.info(`can't get game info from idx because idx is over. idx = ${target_idx}, list length = ${game_master_list.length}`);
                    break;
                }
                // push to select menu
                const game_master = game_master_list[target_idx] || new game_master_1.GameMaster();
                logger_1.logger.trace(`game master push to select menu. idx = ${target_idx}, list length = ${game_master_list.length}, game_name = ${game_master.game_name}`);
                select_menu.addOptions({
                    label: game_master.game_name,
                    value: game_master.game_id.toString(),
                });
                // copy to buffer
                options_label_list.push(game_master.game_name);
            }
            // set placeholder
            select_menu.setPlaceholder(`${options_label_list[0]} ～ ${options_label_list[options_label_list.length - 1]}`);
            // push component to action row builder
            row_list.push(new Discord.ActionRowBuilder()
                .addComponents(select_menu));
        }
        return row_list;
    }
    /**
     * create role list for discord action row
     * @param custom_id
     * @param placeholder
     * @param guild
     * @returns
     */
    static get_role_list_select_menu(custom_id, placeholder, guild) {
        // collect roles
        const role_list = [];
        guild.roles.cache.forEach((role) => {
            role_list.push(user_info_1.RoleInfo.parse_from_discordjs(role));
        });
        // show role list
        const select_members = new Discord.StringSelectMenuBuilder()
            .setCustomId(custom_id)
            .setPlaceholder(placeholder);
        // add select values
        role_list.forEach((role) => {
            select_members.addOptions({
                label: role.name,
                value: role.id,
            });
        });
        // create action row
        return new Discord.ActionRowBuilder()
            .addComponents(select_members);
    }
    //#endregion
    //#region date utils
    /**
     * Get string from date object
     * @param date Date object
     * @returns YY:MM string
     */
    static get_limit_time_str(date) {
        // get hour from date object
        let hour_str = date.getHours().toString();
        let minute_str = date.getMinutes().toString();
        if (hour_str.length == 1) {
            hour_str = `0${hour_str}`;
        }
        if (minute_str.length == 1) {
            minute_str = `0${minute_str}`;
        }
        // return values
        return `${hour_str}:${minute_str}`;
    }
    /**
     * get discord button instance
     * @param custom_id
     * @param label
     * @param button_style
     * @returns
     */
    static get_button(custom_id, label, button_style) {
        return new Discord.ButtonBuilder()
            .setCustomId(custom_id)
            .setLabel(label)
            .setStyle(button_style);
    }
    /**
     * get discord input instance
     * @param custom_id
     * @param label
     * @param input_style
     * @returns
     */
    static get_text_input(custom_id, label, input_style) {
        return new Discord.TextInputBuilder()
            .setCustomId(custom_id)
            .setLabel(label)
            .setStyle(input_style);
    }
}
exports.DiscordCommon = DiscordCommon;
/**
 * define button style
 */
DiscordCommon.BUTTON_STYLE_PRIMARY = 1;
DiscordCommon.BUTTON_STYLE_DANGER = 4;
DiscordCommon.BUTTON_STYLE_SUCCESS = 3;
/**
 * define text input stype
 */
DiscordCommon.TEXT_INPUT_STYLE_SHORT = 1;
DiscordCommon.TEXT_INPUT_STYLE_PHARAGRAPH = 2;
//# sourceMappingURL=discord_common.js.map