"use strict";
exports.__esModule = true;
exports.logger = void 0;
var log4js = require("log4js");
var configuration = require("./../configs/log4js.configuration");
log4js.configure(configuration);
exports.logger = log4js.getLogger();
