"use strict";
exports.__esModule = true;
var log4js = require("log4js");
var configuration = require("./../configs/log4js.configuration");
log4js.configure(configuration);
var logger = log4js.getLogger();
module.exports = logger;
