"use strict";
exports.__esModule = true;
exports.DiscordMessageAnalyzer = void 0;
// define logger
var logger_1 = require("../common/logger");
// import constants
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
// import entities
var recruitment_1 = require("../entity/recruitment");
var participate_1 = require("../entity/participate");
var recruitement_1 = require("../db/recruitement");
var participate_2 = require("../db/participate");
var DiscordMessageAnalyzer = /** @class */ (function () {
    /**
     * constructor
     * @constructor
     */
    function DiscordMessageAnalyzer() {
        // remove user.id from message
        this.message = '';
        // copy server id
        this.server_id = '';
        // initialize variables
        this.message_id = '';
        this.thread_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.max_number = DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
        this.description = '';
        this["delete"] = true;
        // this is "recruitment" is valid
        this.valid = false;
        this.id = 0;
        this.error_messages = [];
        this.type = constants.TYPE_INIT;
        // participate members
        this.user_list = [];
        // default limit date
        this.default_date = new Date();
        this.default_date.setHours(this.default_date.getHours() + DiscordMessageAnalyzer.HOURS_DEFAULT);
    }
    /**
     * analyze discord message, save data to this instance.
     * @param mes discord message
     * @param server_id discord server id
     * @param message_user_id discord message's sender id
     * @param user_id discord bot's id
     * @param reference message reference object (if exists when edit ... reply)
     */
    DiscordMessageAnalyzer.prototype.analyze = function (mes, server_id, message_user_id, user_id, reference) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // remove user.id from message
            _this.message = mes.replace(new RegExp('^[ 　]*<@[!]*' + user_id + '>[ 　]*'), "");
            // copy server id
            _this.server_id = server_id;
            // detect recruitment
            if (DiscordMessageAnalyzer.check_recruitment(_this.message) == true) {
                logger_1.logger.info("target message is new recruitment. : mes = ".concat(_this.message));
                _this.type = constants.TYPE_RECRUITEMENT;
                _this.name = DiscordMessageAnalyzer.get_recruitment_text(_this.message);
                _this.owner_id = message_user_id;
                logger_1.logger.debug("recruitment's name, owner_id : name = ".concat(_this.name, ", owner_id = ").concat(message_user_id));
                // recruitmentis valid
                _this.valid = true;
                // token is setted after
                _this.token = '';
                // analyze limit_time and max_member
                _this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(_this.message, constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || _this.default_date;
                logger_1.logger.debug("recruitment's target time : ".concat(_this.limit_time));
                _this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(_this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                logger_1.logger.debug("recruitment's target number : ".concat(_this.max_number));
                // initialize other values
                _this.status = constants.STATUS_ENABLED;
                _this.description = "";
                _this["delete"] = false;
                // add owner info to participate members
                _this.user_list.push(_this.get_owner_participate());
                // ok
                resolve();
            }
            else if (DiscordMessageAnalyzer.check_edit(_this.message) == true) {
                // edit command
                logger_1.logger.info("target message is editing. : mes = ".concat(_this.message));
                _this.type = constants.TYPE_EDIT;
                // try to load id from message id and owner id
                var recruitment_repo = new recruitement_1.RecruitmentRepository();
                var participate_repo_1 = new participate_2.ParticipateRepository();
                recruitment_repo.get_m_recruitment_by_message_id(reference.message_id, message_user_id)
                    .then(function (recruitment) {
                    logger_1.logger.info("loaded successful. message_id : ".concat(reference.message_id, ", owner_id = ").concat(message_user_id));
                    _this.set_recruitment(recruitment);
                    // edit attributes
                    _this.name = DiscordMessageAnalyzer.get_edit_text(_this.message);
                    logger_1.logger.debug("recruitment's name, owner_id : name = ".concat(_this.name, ", owner_id = ").concat(message_user_id));
                    // set limit time
                    _this.limit_time = DiscordMessageAnalyzer.get_recruitment_time(_this.message, constants.DISCORD_COMMAND_EXCEPT_WORDS_OF_TIME) || _this.default_date;
                    logger_1.logger.debug("recruitment's target time : ".concat(_this.limit_time));
                    // max number
                    _this.max_number = DiscordMessageAnalyzer.get_recruitment_numbers(_this.message) || DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT;
                    logger_1.logger.debug("recruitment's target number : ".concat(_this.max_number));
                    return participate_repo_1.get_t_participate(_this.token);
                })
                    .then(function (user_list) {
                    // load user
                    logger_1.logger.info("loaded user list completed. count = ".concat(user_list.length));
                    _this.user_list = user_list;
                    // ok
                    resolve();
                })["catch"](function () {
                    logger_1.logger.info("loaded unsuccessful. message_id : ".concat(reference.message_id, ", owner_id = ").concat(message_user_id));
                    _this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                    // ng
                    reject();
                });
            }
            else if (DiscordMessageAnalyzer.check_delete(_this.message) == true) {
                // edit command
                logger_1.logger.info("target message is delete. : mes = ".concat(_this.message));
                _this.type = constants.TYPE_DELETE;
                // try to load id from message id and owner id
                var recruitment_repo = new recruitement_1.RecruitmentRepository();
                var participate_repo_2 = new participate_2.ParticipateRepository();
                recruitment_repo.get_m_recruitment_by_message_id(reference.message_id, message_user_id)
                    .then(function (recruitment) {
                    logger_1.logger.info("loaded successful. message_id : ".concat(reference.message_id, ", owner_id = ").concat(message_user_id));
                    _this.set_recruitment(recruitment);
                    // edit attributes
                    _this.name = DiscordMessageAnalyzer.get_delete_text(_this.message);
                    logger_1.logger.debug("recruitment's name, owner_id : name = ".concat(_this.name, ", owner_id = ").concat(message_user_id));
                    // delete flag true
                    _this["delete"] = true;
                    return participate_repo_2.get_t_participate(_this.token);
                })
                    .then(function (user_list) {
                    // load user
                    logger_1.logger.info("loaded user list completed. count = ".concat(user_list.length));
                    _this.user_list = user_list;
                    // ok
                    resolve();
                })["catch"](function () {
                    logger_1.logger.info("loaded unsuccessful. message_id : ".concat(reference.message_id, ", owner_id = ").concat(message_user_id));
                    _this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                    // ng
                    reject();
                });
            }
            else if (DiscordMessageAnalyzer.check_type_list(_this.message) == true) {
                // show command
                logger_1.logger.info("target message is listing. : mes = ".concat(_this.message));
                _this.type = constants.TYPE_LIST;
                _this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                // ng
                reject();
            }
            else if (DiscordMessageAnalyzer.check_regist_master(_this.message) == true) {
                // regist command
                logger_1.logger.info("target message is regist master. : mes = ".concat(_this.message));
                // check id
                if (message_user_id == constants.DISCORD_BOT_ADMIN_USER_ID) {
                    _this.type = constants.TYPE_REGIST_MAETER;
                    // extract user id
                    var user_id_list = DiscordMessageAnalyzer.extract_mention_id_list(_this.message);
                    user_id_list.forEach(function (v) {
                        if (v != user_id) {
                            logger_1.logger.info("extracted message target id. : id = ".concat(v));
                            _this.owner_id = v;
                        }
                    });
                    // ok
                    resolve();
                }
                else {
                    logger_1.logger.warn("target user is not admin, can't execute regist master. : message_user_id = ".concat(message_user_id));
                    _this.error_messages.push(constants.DISCORD_MESSAGE_NO_PERMISSION);
                    // ng
                    reject();
                }
            }
            else if (DiscordMessageAnalyzer.check_user_info_list_get(_this.message) == true) {
                // user info list get command
                logger_1.logger.info("target message is user info get. : mes = ".concat(_this.message));
                _this.type = constants.TYPE_USER_INFO_LIST_GET;
                // ok
                resolve();
            }
            else {
                // this is not valid message
                logger_1.logger.info("target message is not valid. : mes = ".concat(_this.message));
                _this.error_messages.push(constants.DISCORD_MESSAGE_IS_INVALID);
                // edit attributes
                _this.name = DiscordMessageAnalyzer.get_recruitment_text(_this.message);
                // ng
                reject();
            }
        });
    };
    /**
     * save new recruitment's id
     * @param new_id recruitment's id
     */
    DiscordMessageAnalyzer.prototype.set_id = function (new_id) {
        this.id = new_id;
        this.user_list.forEach(function (v) {
            v.id = new_id;
        });
    };
    /**
     * save new recruitment's token
     * @param new_token token
     */
    DiscordMessageAnalyzer.prototype.set_token = function (new_token) {
        this.token = new_token;
        this.user_list.forEach(function (v) {
            v.token = new_token;
        });
    };
    /**
     * save new message id
     * @param new_id message id
     */
    DiscordMessageAnalyzer.prototype.set_message_id = function (new_id) {
        this.message_id = new_id;
    };
    /**
     * save new thread id
     * @param new_id thread id
     */
    DiscordMessageAnalyzer.prototype.set_thread_id = function (new_id) {
        this.thread_id = new_id;
    };
    /**
     * set recruitment instance to this instance
     * @param recruitment
     */
    DiscordMessageAnalyzer.prototype.set_recruitment = function (recruitment) {
        this.id = recruitment.id;
        this.server_id = recruitment.server_id;
        this.message_id = recruitment.message_id;
        this.thread_id = recruitment.thread_id;
        this.token = recruitment.token;
        this.status = recruitment.status;
        this.limit_time = recruitment.limit_time;
        this.name = recruitment.name;
        this.owner_id = recruitment.owner_id;
        this.description = recruitment.description;
        this["delete"] = recruitment["delete"];
        this.user_list = recruitment.user_list;
    };
    /**
     * get analyze result
     * @returns recruitment instance
     */
    DiscordMessageAnalyzer.prototype.get_recruitment = function () {
        var recruitment = new recruitment_1.Recruitment();
        recruitment.id = this.id;
        recruitment.server_id = this.server_id;
        recruitment.message_id = this.message_id;
        recruitment.thread_id = this.thread_id;
        recruitment.token = this.token;
        recruitment.status = this.status;
        recruitment.limit_time = this.limit_time;
        recruitment.name = this.name;
        recruitment.owner_id = this.owner_id;
        recruitment.description = this.description;
        recruitment["delete"] = this["delete"];
        // insert user list
        recruitment.user_list = this.user_list;
        return recruitment;
    };
    /**
     * get analyze result of recruitment owner's information by participate instance
     * @returns participate instance
     */
    DiscordMessageAnalyzer.prototype.get_owner_participate = function () {
        var participate = new participate_1.Participate();
        participate.id = this.id;
        participate.token = this.token;
        participate.status = this.status;
        participate.user_id = this.owner_id;
        participate.description = this.description;
        participate["delete"] = this["delete"];
        return participate;
    };
    /**
     * extract message by regexp
     * @param mes message
     * @param regexp regexp's string
     */
    DiscordMessageAnalyzer.extract_by_regexp = function (mes, regexp) {
        var result = undefined;
        // create RegExp from params
        var re = new RegExp(regexp, 'g');
        var re_result = re.exec(mes);
        // if include message return this
        if (re_result !== null && re_result.length > 0) {
            result = re_result[0];
        }
        return result;
    };
    /**
     * extract date string and convert date object
     * @param raw_mes message
     * @returns recruitment's limit date
     */
    DiscordMessageAnalyzer.get_recruitment_time = function (raw_mes, except_list) {
        if (except_list === void 0) { except_list = []; }
        // needed variables
        var hour = undefined;
        var minute = undefined;
        // remove except words
        var mes = raw_mes;
        except_list.forEach(function (v) {
            mes = mes.replace(v, '');
        });
        // check1
        var re_result = mes.match(/(\d{2})[:]{0,1}(\d{2})/);
        if (re_result != undefined && re_result != null && re_result.length > 2) {
            hour = re_result[1];
            minute = re_result[2];
        }
        // if failed check 1
        if (hour === undefined || minute === undefined) {
            // check2
            re_result = mes.match(/(\d{1,2})時/);
            if (re_result != undefined && re_result != null && re_result.length > 1) {
                hour = re_result[1];
                minute = '0';
            }
        }
        // if hour is 24, this is 0.
        if (hour == '24') {
            hour = '0';
        }
        // if include hour and minute return value
        if (hour === undefined || minute === undefined) {
            return undefined;
        }
        else {
            return DiscordMessageAnalyzer.get_recruitment_date(parseInt(hour), parseInt(minute));
        }
    };
    /**
     * analyze recruitment limit time
     * if already passwd today's ${hour}:${minute}, return tommorow's date
     * @param hour
     * @param minute
     * @returns recruitment's limit date
     */
    DiscordMessageAnalyzer.get_recruitment_date = function (hour, minute) {
        if (hour < 0 || hour > 23) {
            // error
            logger_1.logger.error("hour is out of range, return undefined. : hour = ".concat(hour, ", minute = ").concat(minute));
            return undefined;
        }
        if (minute < 0 || minute > 59) {
            // error
            logger_1.logger.error("minute is out of range, return undefined. : hour = ".concat(hour, ", minute = ").concat(minute));
            return undefined;
        }
        // set target date as TODAY
        var target_date = new Date();
        target_date.setHours(hour);
        target_date.setMinutes(minute);
        target_date.setSeconds(0);
        target_date.setMilliseconds(0);
        // compare time to now
        var now_date = new Date();
        // if target date is past, set tommorow
        if (target_date < now_date) {
            logger_1.logger.debug("target date is past, add 1 date.");
            target_date.setDate(target_date.getDate() + 1);
        }
        // return values
        return target_date;
    };
    /**
     * analyze recruitment member count
     * @param mes message
     * @returns recruitment member count. if member is not valid, return undefined.
     */
    DiscordMessageAnalyzer.get_recruitment_numbers = function (mes) {
        // check1
        var re_result = mes.match(/@([0-9]{1,2})/);
        if (re_result != undefined && re_result != null && re_result.length > 1) {
            var num = re_result[1];
            return parseInt(num || '0');
        }
        return undefined;
    };
    /**
     * check message is new recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_recruitment = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_NEW_RECRUITMENT, ")[^ \u3000]*[ \u3000]")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * get message of new recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.get_recruitment_text = function (mes) {
        return mes.replace(new RegExp("^^[ \u3000]*(".concat(constants.DISCORD_COMMAND_NEW_RECRUITMENT, ")[^ \u3000]*[ \u3000]")), "");
    };
    /**
     * check message is listing recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_type_list = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_LIST_RECRUITMENT, ")")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * check message is edit recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_edit = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_EDIT_RECRUITMENT, ")[^ \u3000]*[ \u3000]")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * get message of edit recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.get_edit_text = function (mes) {
        return mes.replace(new RegExp("^^[ \u3000]*(".concat(constants.DISCORD_COMMAND_EDIT_RECRUITMENT, ")[^ \u3000]*[ \u3000]")), "");
    };
    /**
     * check message is cancel recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_delete = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_DELETE_RECRUITMENT, ")[^ \u3000]*[ \u3000]")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * get message of cancel recruitment
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.get_delete_text = function (mes) {
        return mes.replace(new RegExp("^^[ \u3000]*(".concat(constants.DISCORD_COMMAND_DELETE_RECRUITMENT, ")[^ \u3000]*[ \u3000]")), "");
    };
    /**
     * check message is regist master
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_regist_master = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_REGIST_MASTER, ")[^ \u3000]*[ \u3000]")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * check message is user info list get
     * @param mes message
     * @returns
     */
    DiscordMessageAnalyzer.check_user_info_list_get = function (mes) {
        if (this.extract_by_regexp(mes.replace(/[\r\n|\r|\n]+/g, ' '), "^[ \u3000]*(".concat(constants.DISCORD_COMMAND_USER_INFO_LIST_GET, ")")) === undefined) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
     * extract mention id from message
     * @param mes
     * @returns mention id list
     */
    DiscordMessageAnalyzer.extract_mention_id_list = function (mes) {
        var result_list = [];
        var extract_id = new RegExp('<@&(\\d+)>', 'g');
        var temp_id = null;
        while ((temp_id = extract_id.exec(mes)) !== null) {
            if (temp_id[1]) {
                result_list.push(temp_id[1]);
            }
        }
        return result_list;
    };
    /**
     * default recruitment time
     */
    DiscordMessageAnalyzer.HOURS_DEFAULT = constants.RECRUITMENT_DEFAULT_LIMIT_HOURS;
    /**
     * default recruitment member count
     */
    DiscordMessageAnalyzer.MAX_NUMBERS_DEFAULT = constants.RECRUITMENT_DEFAULT_MAX_NUMBERS;
    return DiscordMessageAnalyzer;
}());
exports.DiscordMessageAnalyzer = DiscordMessageAnalyzer;
