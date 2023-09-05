"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = void 0;
// define logger
const logger_1 = require("../common/logger");
// import file module
const client_1 = require("@prisma/client");
class Common {
    /**
     * returns prisma client (singleton)
     * @returns
     */
    static get_prisma_client() {
        // if client is not existed, create instance.
        if (this.client == null) {
            this.client = new client_1.PrismaClient();
            logger_1.logger.info(`create prisma client completed.`);
        }
        // return instance.
        return this.client;
    }
}
exports.Common = Common;
/**
 * Prisma client
 */
Common.client = null;
//# sourceMappingURL=common.js.map