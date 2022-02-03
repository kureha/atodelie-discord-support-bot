import { logger } from './../../common/logger';

test("test for loggers", () => {
    logger.trace("trace test");
    logger.debug("debug test");
    logger.info("info test");
    logger.warn("warn test");
    logger.error("error test");
    logger.fatal("fatal test");
});