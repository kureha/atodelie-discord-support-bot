"use strict";
exports.__esModule = true;
exports.DiscordInteractionAnalyzer = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import entities
var participate_1 = require("../entity/participate");
var DiscordInteractionAnalyzer = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function DiscordInteractionAnalyzer() {
        // properties
        this.id = 0;
        this.token = '';
        this.status = constants.STATUS_ENABLED;
        this.user_id = '';
        this.valid = false;
        this.type = constants.TYPE_INIT;
        this.description = '';
        this.error_messages = [];
        this["delete"] = true;
    }
    /**
     * analyze discord interaction, save data to this instance.
     * @param custom_id recruitment id
     * @param user_id discord bot's id
     */
    DiscordInteractionAnalyzer.prototype.analyze = function (custom_id, user_id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // check custom id for recruitment join
            if (custom_id.match(new RegExp("^".concat(constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX)))) {
                logger_1.logger.debug("interaction is valid. type = ".concat(constants.TYPE_JOIN));
                _this.type = constants.TYPE_JOIN;
                _this["delete"] = false;
                // status
                _this.status = constants.STATUS_ENABLED;
                // get token from custom id
                _this.token = _this.get_token(custom_id, constants.DISCORD_BUTTON_ID_JOIN_RECRUITMENT_PREFIX);
            }
            else if (custom_id.match(new RegExp("^".concat(constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX)))) {
                logger_1.logger.debug("interaction is valid.. type = ".concat(constants.TYPE_VIEW));
                _this.type = constants.TYPE_VIEW;
                _this["delete"] = false;
                // change status
                _this.status = constants.STATUS_VIEW;
                // get token from custom id
                _this.token = _this.get_token(custom_id, constants.DISCORD_BUTTON_ID_VIEW_RECRUITMENT_PREFIX);
            }
            else if (custom_id.match(new RegExp("^".concat(constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX)))) {
                logger_1.logger.debug("interaction is valid.. type = ".concat(constants.TYPE_DECLINE));
                _this.type = constants.TYPE_DECLINE;
                _this["delete"] = true;
                // status
                _this.status = constants.STATUS_DISABLED;
                // get token from custom id
                _this.token = _this.get_token(custom_id, constants.DISCORD_BUTTON_ID_DECLINE_RECRUITMENT_PREFIX);
            }
            else {
                // error
                logger_1.logger.warn("this interaction dosen't match join recruitment. : customId = ".concat(custom_id));
                _this.error_messages.push("this interaction dosen't match join recruitment. : customId = ".concat(custom_id));
                // this is not valid interaction.
                _this.valid = false;
                // ng
                reject();
                return;
            }
            // this is valid interaction.
            _this.valid = true;
            logger_1.logger.info("this is valid interaction. token = ".concat(_this.token));
            // set valiables
            _this.user_id = user_id;
            _this.description = constants.RECRUITMENT_DEFAULT_DESCRIPTION;
            // ok
            resolve();
        });
    };
    /**
     * save new recruitment's id
     * @param new_id
     */
    DiscordInteractionAnalyzer.prototype.set_id = function (new_id) {
        this.id = new_id;
    };
    /**
     * save new recruitment's token
     * @param {string} new_token
     */
    DiscordInteractionAnalyzer.prototype.set_token = function (new_token) {
        this.token = new_token;
    };
    /**
     * extract token from discord interaction button's id
     * @param custom_id button's id
     * @returns extracted token
     */
    DiscordInteractionAnalyzer.prototype.get_token = function (custom_id, token_prefix) {
        var token_regexp = new RegExp("^".concat(token_prefix, "(.+)$"));
        var match_result = custom_id.match(token_regexp);
        if (match_result === null || match_result.length < 2) {
            return constants.ERROR_RECRUITMENT_TOKEN;
        }
        else {
            return match_result[1] || '';
        }
    };
    /**
     * get analyze result
     * @returns participate instance
     */
    DiscordInteractionAnalyzer.prototype.get_join_participate = function () {
        var participate = new participate_1.Participate();
        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.user_id;
        participate.description = this.description;
        participate["delete"] = this["delete"];
        return participate;
    };
    return DiscordInteractionAnalyzer;
}());
exports.DiscordInteractionAnalyzer = DiscordInteractionAnalyzer;
