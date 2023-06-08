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
exports.ActivityHistoryRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import utils
const activity_history_1 = require("../entity/activity_history");
const common_1 = require("./common");
class ActivityHistoryRepository {
    constructor() {
        /**
         * Prisma client
         */
        this.client = common_1.Common.get_prisma_client();
    }
    /**
     * insert data
     * @param data
     * @returns
     */
    insert_t_activity_history(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.regist_time = exeute_date;
            data.update_time = exeute_date;
            logger_1.logger.info(`insert into t_activity_history. data = ${JSON.stringify(data)}`);
            const result = yield this.client.t_activity_history.create({
                data: data
            });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * delete data by change_time before input param
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_t_activity_history(server_id, change_time) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete t_activity_history. server_id = ${server_id}, change_time(lte) = ${change_time}`);
            const result = yield this.client.t_activity_history.deleteMany({
                where: {
                    server_id: server_id,
                    change_time: {
                        lte: change_time,
                    },
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete data by change_time before input param
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_t_activity_history_all(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete t_activity_history all. server_id = ${server_id}`);
            const result = yield this.client.t_activity_history.deleteMany({
                where: {
                    server_id: server_id,
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    get_t_activity_history_all(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select t_activity_history all. server_id = ${server_id}`);
            let ret = [];
            const result = yield this.client.t_activity_history.findMany({
                where: {
                    server_id: server_id,
                    delete: false,
                },
                orderBy: {
                    change_time: 'desc'
                }
            });
            result.forEach((v) => {
                ret.push(activity_history_1.ActivityHistory.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @param channel_id
     * @returns data
     */
    get_t_activity_history(server_id, channel_id, limit_number) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select t_activity_history. server_id = ${server_id}, channel_id = ${channel_id}, limit_number = ${limit_number}`);
            let ret = [];
            const result = yield this.client.t_activity_history.findMany({
                where: {
                    server_id: server_id,
                    channel_id: channel_id,
                    delete: false,
                },
                skip: 0,
                take: limit_number,
                orderBy: {
                    change_time: 'desc',
                }
            });
            result.forEach((v) => {
                ret.push(activity_history_1.ActivityHistory.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
}
exports.ActivityHistoryRepository = ActivityHistoryRepository;
//# sourceMappingURL=activity_history.js.map