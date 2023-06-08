"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
const version_1 = require("../entity/version");
const common_1 = require("./common");
class VersionRepository {
    constructor() {
        /**
         * Prisma client
         */
        this.client = common_1.Common.get_prisma_client();
    }
    /**
     * get data
     * @param
     * @returns single data
     */
    get_m_version() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_version.`);
            let list = yield this.client.m_version.findMany({
                orderBy: {
                    app_version: 'desc',
                }
            });
            if (list.length == 0) {
                logger_1.logger.error(`not found on m_version. return initial version. result count = ${list.length}`);
                let initial_version = new version_1.Version();
                initial_version.app_version = VersionRepository.VERSION_DEFAULT;
                initial_version.database_version = VersionRepository.VERSION_DEFAULT;
                return initial_version;
            }
            else if (list.length == 1) {
                logger_1.logger.info(`select successed. data = ${JSON.stringify(list)}`);
                return version_1.Version.parse_from_db(list[0]);
            }
            else {
                logger_1.logger.error(`more than 2 datas found on m_version. result count = ${list.length}`);
                throw `more than 2 datas found on m_version. result count = ${list.length}`;
            }
        });
    }
    /**
     * insert data
     * @param version_data
     * @returns
     */
    insert_m_version(version_data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`insert into m_version. data = ${JSON.stringify(version_data)}`);
            const result = yield this.client.m_version.create({
                data: version_data
            });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * delete data
     * @param token
     * @returns
     */
    delete_m_version(version_data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_version. token = ${version_data}`);
            const result = yield this.client.m_version.deleteMany({
                where: {
                    app_version: version_data.app_version,
                    database_version: version_data.database_version,
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete data
     * @param token
     * @returns
     */
    delete_m_version_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_version all.`);
            const result = yield this.client.m_version.deleteMany({});
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
}
/**
 * Version of default
 */
VersionRepository.VERSION_DEFAULT = '1.0.0.0';
exports.VersionRepository = VersionRepository;
//# sourceMappingURL=version.js.map