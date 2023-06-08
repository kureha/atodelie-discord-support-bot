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
exports.ServerInfoRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import entities
const server_info_1 = require("../entity/server_info");
const common_1 = require("./common");
class ServerInfoRepository {
    constructor() {
        /**
         * Prisma client
         */
        this.client = common_1.Common.get_prisma_client();
    }
    /**
     * get data by server id
     * @returns data
     */
    get_m_server_info_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_server_info all.`);
            let ret = [];
            const result = yield this.client.m_server_info.findMany({
                orderBy: {
                    server_id: 'asc'
                },
            });
            result.forEach((v) => {
                ret.push(server_info_1.ServerInfo.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data by server id
     * @param server_id
     * @returns data
     */
    get_m_server_info(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_server_info.`);
            const data = yield this.client.m_server_info.findFirst({
                where: {
                    server_id: server_id
                }
            });
            if (data == null) {
                logger_1.logger.error(`data not found on m_server_info. please setting m_server_info. server_id = ${server_id}`);
                throw `data not found on m_server_info. please setting m_server_info. server_id = ${server_id}`;
            }
            else {
                logger_1.logger.info(`select successed. data = ${JSON.stringify(data)}`);
                return server_info_1.ServerInfo.parse_from_db(data);
            }
        });
    }
    /**
     * insert data
     * @param server_info_data
     * @returns
     */
    insert_m_server_info(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`insert into m_server_info. data = ${JSON.stringify(data)}`);
            const result = yield this.client.m_server_info.create({
                data: data
            });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * update data
     * @param server_info_data
     * @returns
     */
    update_m_server_info(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`update m_server_info. data = ${JSON.stringify(data)}`);
            try {
                const result = yield this.client.m_server_info.update({
                    where: {
                        server_id: data.server_id,
                    }, data: data
                });
                logger_1.logger.info(`update successful. data = ${JSON.stringify(result)}`);
                return 1;
            }
            catch (err) {
                logger_1.logger.error(`update failed. error = ${err}`);
                return 0;
            }
        });
    }
    /**
     * update m_server follow time data
     * @param server_id
     * @param follow_time
     * @returns
     */
    update_m_server_info_follow_time(server_id, follow_time) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`update m_server_info follow time. server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
            try {
                const result = yield this.client.m_server_info.update({
                    where: {
                        server_id: server_id,
                    },
                    data: {
                        follow_time: follow_time
                    }
                });
                logger_1.logger.info(`update succeeded. data = ${JSON.stringify(result)}`);
                return 1;
            }
            catch (err) {
                logger_1.logger.error(`update failed. error = ${err}`);
                return 0;
            }
        });
    }
    /**
     * delete data by server id
     * @param server_id
     * @returns
     */
    delete_m_server_info(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_server_info. server_id = ${server_id}`);
            const result = yield this.client.m_server_info.deleteMany({
                where: {
                    server_id: server_id,
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete data by server id
     * @param server_id
     * @returns
     */
    delete_m_server_info_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_server_info all.`);
            const result = yield this.client.m_server_info.deleteMany({});
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
}
exports.ServerInfoRepository = ServerInfoRepository;
//# sourceMappingURL=server_info.js.map