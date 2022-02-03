"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./../../common/logger");
test("test for loggers", () => {
    logger_1.logger.trace("trace test");
    logger_1.logger.debug("debug test");
    logger_1.logger.info("info test");
    logger_1.logger.warn("warn test");
    logger_1.logger.error("error test");
    logger_1.logger.fatal("fatal test");
});
//# sourceMappingURL=logger.test.js.map