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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDiscordMock = void 0;
// setup for mock
const Discord = __importStar(require("discord.js"));
// mock all objects
jest.mock('discord.js');
// mock classes
const EmbedBuilderMock = Discord.EmbedBuilder;
const ModalBuilderMock = Discord.ModalBuilder;
const ButtonInteractionMock = Discord.ButtonInteraction;
const TextInputBuilderMock = Discord.TextInputBuilder;
const ClientMock = Discord.Client;
const ButtonBuilderMock = Discord.ButtonBuilder;
const SelectMenuInteractionMock = Discord.SelectMenuInteraction;
const ModalSubmitInteractionMock = Discord.ModalSubmitInteraction;
const ChatInputCommandInteractionMock = Discord.ChatInputCommandInteraction;
const MessageMock = Discord.Message;
class TestDiscordMock {
    /**
     * get discord embed mock
     */
    static embed_mock() {
        EmbedBuilderMock.mockReset();
        EmbedBuilderMock.mockImplementation(() => {
            return {
                description: '',
                timestamp: '',
                fields: [],
                addFields: (v) => {
                    return;
                },
            };
        });
    }
    /**
     * discord modal mock
     */
    static modal_builder_mock() {
        ModalBuilderMock.mockReset();
        ModalBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v) => {
                    return new ModalBuilderMock();
                },
                setTitle: (v) => {
                    return new ModalBuilderMock();
                },
                setLabel: (v) => {
                    return new ModalBuilderMock();
                },
                setStyle: (v) => {
                    return new ModalBuilderMock();
                },
                addComponents: (v) => {
                    return new ModalBuilderMock();
                }
            };
        });
    }
    /**
     * discord button mock
     */
    static button_builder_mock() {
        ButtonBuilderMock.mockReset();
        ButtonBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v) => {
                    return new ButtonBuilderMock();
                },
                setTitle: (v) => {
                    return new ButtonBuilderMock();
                },
                setLabel: (v) => {
                    return new ButtonBuilderMock();
                },
                setStyle: (v) => {
                    return new ButtonBuilderMock();
                },
            };
        });
    }
    /**
     * discord modal mock
     */
    static text_input_builder_mock() {
        TextInputBuilderMock.mockReset();
        TextInputBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v) => {
                    return new TextInputBuilderMock();
                },
                setTitle: (v) => {
                    return new TextInputBuilderMock();
                },
                setLabel: (v) => {
                    return new TextInputBuilderMock();
                },
                setStyle: (v) => {
                    return new TextInputBuilderMock();
                },
                setValue: (v) => {
                    return;
                },
            };
        });
    }
    /**
     * discord client mock
     * @param guild_list
     * @returns
     */
    static client_mock(guild_list) {
        ClientMock.mockReset();
        ClientMock.mockImplementationOnce(() => {
            return {
                guilds: {
                    cache: guild_list,
                },
                channels: {
                    cache: {
                        get: (k) => {
                            return {
                                isTextBased: () => {
                                    return true;
                                },
                                isVoiceBased: () => {
                                    return false;
                                },
                            };
                        }
                    },
                    fetch: (k) => {
                        return {
                            isTextBased: () => {
                                return true;
                            },
                            isVoiceBased: () => {
                                return false;
                            },
                        };
                    },
                },
            };
        });
        return ClientMock;
    }
    /**
     * create button interaction mock
     * @param custom_id
     * @param guild_id
     * @param user_id
     * @returns
     */
    static button_interaction_mock(custom_id, guild_id, user_id) {
        ButtonInteractionMock.mockReset();
        ButtonInteractionMock.mockImplementationOnce(() => {
            return {
                customId: custom_id,
                guildId: guild_id,
                user: {
                    id: user_id,
                },
                reply: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
            };
        });
        return ButtonInteractionMock;
    }
    /**
     * select menu interaction mock
     * @param custom_id
     * @param guild_id
     * @param user_id
     * @returns
     */
    static select_menu_interaction_mock(custom_id, guild_id, user_id, input_values) {
        SelectMenuInteractionMock.mockReset();
        SelectMenuInteractionMock.mockImplementationOnce(() => {
            return {
                customId: custom_id,
                guildId: guild_id,
                user: {
                    id: user_id,
                    username: user_id,
                },
                guild: {
                    id: guild_id,
                },
                values: input_values,
                reply: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                showModal: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
            };
        });
        return SelectMenuInteractionMock;
    }
    /**
     * modal submit interaction mock
     * @param custom_id
     * @param guild_id
     * @param user_id
     * @returns
     */
    static modal_submit_interaction_mock(custom_id, guild_id, user_id, input_value) {
        ModalSubmitInteractionMock.mockReset();
        ModalSubmitInteractionMock.mockImplementationOnce(() => {
            return {
                customId: custom_id,
                guildId: guild_id,
                user: {
                    id: user_id,
                },
                guild: {
                    members: {
                        list: () => {
                            return new Promise((resolve, reject) => {
                                resolve([]);
                            });
                        }
                    },
                    memberCount: 10,
                    roles: {
                        cache: [],
                    }
                },
                fields: {
                    getTextInputValue: (k) => {
                        return input_value;
                    },
                },
                reply: (v) => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
            };
        });
        return ModalSubmitInteractionMock;
    }
    /**
     * create chat input command interaction mock
     * @param custom_id
     * @param guild_id
     * @param user_id
     * @returns
     */
    static chat_input_command_interaction_mock(custom_id, guild_id, user_id) {
        ChatInputCommandInteractionMock.mockReset();
        ChatInputCommandInteractionMock.mockImplementationOnce(() => {
            return {
                customId: custom_id,
                guildId: guild_id,
                user: {
                    id: user_id,
                },
                guild: {
                    members: {
                        list: () => {
                            return new Promise((resolve, reject) => {
                                resolve([]);
                            });
                        }
                    },
                    memberCount: 10,
                },
                reply: (v) => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
                showModal: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                }
            };
        });
        return ChatInputCommandInteractionMock;
    }
    /**
     * discord message mock
     */
    static message_mock(user_id, content) {
        MessageMock.mockReset();
        MessageMock.mockImplementation(() => {
            return {
                client: {
                    user: {
                        id: user_id,
                    },
                },
                content: content,
                mentions: {
                    users: {
                        has: (v) => {
                            if (v == user_id) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        },
                    },
                },
                reply: () => {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                },
            };
        });
        return MessageMock;
    }
}
exports.TestDiscordMock = TestDiscordMock;
//# sourceMappingURL=test_discord_mock.js.map