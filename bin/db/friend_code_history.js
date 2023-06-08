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
exports.FriendCodeHistoryRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import entities
const friend_code_1 = require("../entity/friend_code");
const common_1 = require("./common");
class FriendCodeHistoryRepository {
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
    insert_t_friend_code(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.regist_time = exeute_date;
            data.update_time = exeute_date;
            logger_1.logger.info(`insert into t_friend_code_history. data = ${JSON.stringify(data)}`);
            const result = yield this.client.t_friend_code_history.create({ data: data });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * update data
     * @param data key is [data.user_id] and [data.game_id]
     * @returns
     */
    update_t_friend_code(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.update_time = exeute_date;
            logger_1.logger.info(`update t_friend_code_history. data = ${JSON.stringify(data)}, key = { server_id: ${data.server_id}, user_id = ${data.user_id}, game_id = ${data.game_id} }`);
            try {
                const result = yield this.client.t_friend_code_history.update({
                    where: {
                        server_id_user_id_regist_time_game_id: {
                            server_id: data.server_id,
                            user_id: data.user_id,
                            regist_time: data.regist_time,
                            game_id: data.game_id,
                        }
                    },
                    data: data
                });
                logger_1.logger.info(`update succeeded. data = ${JSON.stringify(result)}`);
                return 1;
            }
            catch (err) {
                logger_1.logger.info(`no record updated. error = ${err}`);
                return 0;
            }
        });
    }
    /**
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_t_friend_code(server_id, user_id, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete t_friend_code_history. server_id = ${server_id}, user_id = ${user_id}, game_id = ${game_id}`);
            const result = yield this.client.t_friend_code_history.deleteMany({
                where: {
                    server_id: server_id,
                    user_id: user_id,
                    game_id: game_id
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_t_friend_code_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete all t_friend_code_history.`);
            const result = yield this.client.t_friend_code_history.deleteMany({});
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    get_t_friend_code_all(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select t_friend_code_history. server_id = ${server_id}`);
            let ret = [];
            const result = yield this.client.t_friend_code_history.findMany({
                where: {
                    server_id: server_id,
                    delete: false
                }
            });
            result.forEach((v) => {
                ret.push(friend_code_1.FriendCode.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @param user_id
     * @returns data
     */
    get_t_friend_code(server_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select t_friend_code_history. server_id = ${server_id}, user_id = ${user_id}`);
            let ret = [];
            const result = yield this.client.t_friend_code_history.findMany({
                where: {
                    server_id: server_id,
                    user_id: user_id,
                    delete: false
                }
            });
            result.forEach((v) => {
                ret.push(friend_code_1.FriendCode.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data by game friend_code info
     * @param server_id
     * @param game_id
     * @returns data
     */
    get_t_friend_code_from_game_id(server_id, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select t_friend_code_history. server_id = ${server_id}, game_id = ${game_id}`);
            let ret = [];
            const result = yield this.client.t_friend_code_history.findMany({
                where: {
                    server_id: server_id,
                    game_id: game_id,
                    delete: false
                }
            });
            result.forEach((v) => {
                ret.push(friend_code_1.FriendCode.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
}
exports.FriendCodeHistoryRepository = FriendCodeHistoryRepository;
//# sourceMappingURL=friend_code_history.js.map