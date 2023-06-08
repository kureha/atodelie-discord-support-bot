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
exports.GameMasterRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import entities
const game_master_1 = require("../entity/game_master");
const common_1 = require("./common");
class GameMasterRepository {
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
    insert_m_game_master(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.regist_time = exeute_date;
            data.update_time = exeute_date;
            logger_1.logger.info(`insert into m_game_master. data = ${JSON.stringify(data)}`);
            const result = yield this.client.m_game_master.create({
                data: data
            });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * update data
     * @param data key is [data.server_id] and [data.game_id]
     * @returns
     */
    update_m_game_master(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.update_time = exeute_date;
            logger_1.logger.info(`update m_game_master. data = ${JSON.stringify(data)}`);
            try {
                const result = yield this.client.m_game_master.update({
                    where: {
                        server_id_game_id: {
                            server_id: data.server_id,
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
     * delete data by server_id and game_id
     * @param server_id
     * @param game_id
     * @returns
     */
    delete_m_game_master(server_id, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_game_master. server_id = ${server_id}, game_id = ${game_id}`);
            const result = yield this.client.m_game_master.deleteMany({
                where: {
                    server_id: server_id,
                    game_id: game_id,
                }
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete all data
     * @param server_id
     * @param game_id
     * @returns
     */
    delete_m_game_master_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_game_master all.`);
            const result = yield this.client.m_game_master.deleteMany({});
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * get data by game master
     * @returns data
     */
    get_m_game_master_all(server_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_game_master all. server_id = ${server_id}`);
            let ret = [];
            const result = yield this.client.m_game_master.findMany({
                where: {
                    server_id: server_id,
                    delete: false,
                }
            });
            result.forEach((v) => {
                ret.push(game_master_1.GameMaster.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data by game master
     * @returns data
     */
    get_m_game_master(server_id, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_game_master all.`);
            const data = yield this.client.m_game_master.findFirst({
                where: {
                    server_id: server_id,
                    game_id: game_id,
                    delete: false,
                }
            });
            if (data == null) {
                logger_1.logger.error(`data not found on m_game_master. server_id = ${server_id}`);
                throw `data not found on m_game_master. server_id = ${server_id}`;
            }
            else {
                logger_1.logger.info(`select successed. data = ${JSON.stringify(data)}`);
                return game_master_1.GameMaster.parse_from_db(data);
            }
        });
    }
    /**
     * get data by game master
     * @returns data
     */
    get_m_game_master_by_presence_name(server_id, presence_name) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_game_master by presence name. server_id = ${server_id}, precense_name = ${presence_name}`);
            let ret = [];
            const result = yield this.client.m_game_master.findMany({
                where: {
                    server_id: server_id,
                    presence_name: presence_name,
                    delete: false,
                }
            });
            result.forEach((v) => {
                ret.push(game_master_1.GameMaster.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
}
exports.GameMasterRepository = GameMasterRepository;
//# sourceMappingURL=game_master.js.map