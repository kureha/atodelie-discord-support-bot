import { logger } from './../../common/logger';

describe("log4js outputtest.", () => {
    test("test for loggers each level output logs.", () => {
        logger.trace("trace test");
        logger.debug("debug test");
        logger.info("info test");
        logger.warn("warn test");
        logger.error("error test");
        logger.fatal("fatal test");
    });
});
