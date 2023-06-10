// setup for mock
import * as Discord from 'discord.js';

// mock all objects
jest.mock('discord.js');

// mock classes
const EmbedBuilderMock = Discord.EmbedBuilder as unknown as jest.Mock;
const ModalBuilderMock = Discord.ModalBuilder as unknown as jest.Mock;
const ButtonInteractionMock = Discord.ButtonInteraction as jest.Mock;
const TextInputBuilderMock = Discord.TextInputBuilder as unknown as jest.Mock;

const ClientMock = Discord.Client as unknown as jest.Mock;
const ButtonBuilderMock = Discord.ButtonBuilder as unknown as jest.Mock;
const SelectMenuInteractionMock = Discord.SelectMenuInteraction as jest.Mock;
const ModalSubmitInteractionMock = Discord.ModalSubmitInteraction as jest.Mock;
const ChatInputCommandInteractionMock = Discord.ChatInputCommandInteraction as jest.Mock;
const MessageMock = Discord.Message as jest.Mock;

export class TestDiscordMock {
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
                addFields: (v: any): void => {
                    return;
                },
            }
        });
    }

    /**
     * discord modal mock
     */
    static modal_builder_mock() {
        ModalBuilderMock.mockReset();
        ModalBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v: any): any => {
                    return new ModalBuilderMock();
                },
                setTitle: (v: any): any => {
                    return new ModalBuilderMock();
                },
                setLabel: (v: any): any => {
                    return new ModalBuilderMock();
                },
                setStyle: (v: any): any => {
                    return new ModalBuilderMock();
                },
                addComponents: (v: any): any => {
                    return new ModalBuilderMock();
                }
            }
        });
    }

    /**
     * discord button mock
     */
    static button_builder_mock() {
        ButtonBuilderMock.mockReset();
        ButtonBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v: any): any => {
                    return new ButtonBuilderMock();
                },
                setTitle: (v: any): any => {
                    return new ButtonBuilderMock();
                },
                setLabel: (v: any): any => {
                    return new ButtonBuilderMock();
                },
                setStyle: (v: any): any => {
                    return new ButtonBuilderMock();
                },
            }
        });
    }

    /**
     * discord modal mock
     */
    static text_input_builder_mock() {
        TextInputBuilderMock.mockReset();
        TextInputBuilderMock.mockImplementation(() => {
            return {
                setCustomId: (v: any): any => {
                    return new TextInputBuilderMock();
                },
                setTitle: (v: any): any => {
                    return new TextInputBuilderMock();
                },
                setLabel: (v: any): any => {
                    return new TextInputBuilderMock();
                },
                setStyle: (v: any): any => {
                    return new TextInputBuilderMock();
                },
                setValue: (v: any): void => {
                    return;
                },
            }
        });
    }

    /**
     * discord client mock
     * @param guild_list 
     * @returns 
     */
    static client_mock(guild_list: any) {
        ClientMock.mockReset();
        ClientMock.mockImplementationOnce(() => {
            return {
                guilds: {
                    cache: guild_list,
                },
                channels: {
                    cache: {
                        get: (k: string): any => {
                            return {
                                isTextBased: (): boolean => {
                                    return true;
                                },
                                isVoiceBased: (): boolean => {
                                    return false;
                                },
                            }
                        }
                    },
                    fetch: (k: string): any => {
                        return {
                            isTextBased: (): boolean => {
                                return true;
                            },
                            isVoiceBased: (): boolean => {
                                return false;
                            },
                        }
                    },
                },
            }
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
    static button_interaction_mock(custom_id: any, guild_id: any, user_id: any): jest.Mock<any, any> {
        ButtonInteractionMock.mockReset();
        ButtonInteractionMock.mockImplementationOnce(() => {
            return {
                customId: custom_id,
                guildId: guild_id,
                user: {
                    id: user_id,
                },
                reply: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
            }
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
    static select_menu_interaction_mock(custom_id: any, guild_id: any, user_id: any, input_values: string[]): jest.Mock<any, any> {
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
                reply: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                showModal: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
            }
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
    static modal_submit_interaction_mock(custom_id: any, guild_id: any, user_id: any, input_value: string): jest.Mock<any, any> {
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
                        list: (): Promise<any> => {
                            return new Promise<any>((resolve, reject) => {
                                resolve([]);
                            })
                        }
                    },
                    memberCount: 10,
                    roles: {
                        cache: [],
                    }
                },
                fields: {
                    getTextInputValue: (k: string): string => {
                        return input_value;
                    },
                },
                reply: (v: any): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
            }
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
    static chat_input_command_interaction_mock(custom_id: any, guild_id: any, user_id: any): jest.Mock<any, any> {
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
                        list: (): Promise<any> => {
                            return new Promise<any>((resolve, reject) => {
                                resolve([]);
                            })
                        }
                    },
                    memberCount: 10,
                },
                reply: (v: any): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                update: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                },
                showModal: (): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        resolve(true);
                    });
                }
            }
        });

        return ChatInputCommandInteractionMock;
    }

    /**
     * discord message mock
     */
    static message_mock(user_id: any, content: any) {
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
                        has: (v: string): boolean => {
                            if (v == user_id) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                    },
                },
                reply: (): Promise<any> => {
                    return new Promise<boolean>((resolve, reject) => {
                        resolve(true);
                    });
                },
            }
        });

        return MessageMock;
    }
}