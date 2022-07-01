"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_message_analyzer_1 = require("../../logic/discord_message_analyzer");
test.each([
    ["", ""],
    ["１２３４５６７８９０", "1234567890"],
    [" １２３４５６７８９０", " 1234567890"],
    ["１２３４５６７８９０ ", "1234567890 "],
    ["１a２b３c４d５e６f７g８h９i０", "1a2b3c4d5e6f7g8h9i0"],
    ["あいうえお１２３４５かきくけこ", "あいうえお12345かきくけこ"],
    ["1234567890", "1234567890"],
])('test for full-width character replace tests, %s -> %s', (input, expected) => {
    expect(discord_message_analyzer_1.DiscordMessageAnalyzer.remove_full_wide_digits(input)).toBe(expected);
});
//# sourceMappingURL=logic.discord_analyzer.remove_full_wide_digits.test.js.map