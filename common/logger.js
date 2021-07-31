const log4js = require("log4js");
const configuration = require("./../configs/log4js.configuration");

log4js.configure(configuration);

const logger = log4js.getLogger();
module.exports = logger;