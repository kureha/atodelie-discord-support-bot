"use strict";
exports.__esModule = true;
exports.logger = void 0;
var log4js = require("log4js");
var log4js_configuration_1 = require("./../configs/log4js.configuration");
// log4js initialize
log4js.configure(log4js_configuration_1.configuration);
// export logger
exports.logger = log4js.getLogger();
