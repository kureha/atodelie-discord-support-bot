const logger_1 = require('./../common/logger');
let logger = logger_1.logger;

test("test for loggers", () => {
    logger.trace("trace test");
    logger.debug("debug test");
    logger.info("info test");
    logger.warn("warn test");
    logger.error("error test");
    logger.fatal("fatal test");
});