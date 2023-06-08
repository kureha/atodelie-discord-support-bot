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
exports.ParticipateRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const participate_1 = require("../entity/participate");
const recruitment_1 = require("../entity/recruitment");
const common_1 = require("./common");
class ParticipateRepository {
    constructor() {
        /**
         * Prisma client
         */
        this.client = common_1.Common.get_prisma_client();
    }
    /**
     * exclude user list element object (shallow copy)
     * @param recruitment
     * @param keys
     * @returns
     */
    exclude(recruitment, keys) {
        let result = Object.assign({}, recruitment);
        for (let key of keys) {
            delete result[key];
        }
        return result;
    }
    /**
     * returns condition limit date
     * @returns
     */
    get_condition_limit_date() {
        let target_date = new Date();
        target_date.setMinutes(target_date.getMinutes() - constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE);
        return target_date;
    }
    /**
     * select m_recruitment by token.
     * @param token
     * @returns
     */
    select_m_recruitment_by_token(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.client.m_recruitment.findFirst({
                where: {
                    token: token,
                    limit_time: {
                        gte: this.get_condition_limit_date()
                    },
                    delete: false,
                }
            });
            if (data == null) {
                return null;
            }
            else {
                return recruitment_1.Recruitment.parse_from_db(data);
            }
        });
    }
    /**
     * insert data
     * @param data
     * @returns
     */
    insert_t_participate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`insert into t_participate. data(exclude id) = ${JSON.stringify(data)}`);
            // select recruitment by token
            let recruitment = yield this.select_m_recruitment_by_token(data.token);
            if (recruitment == null) {
                logger_1.logger.error(`insert failed. id = ${data.id}, token = ${data.token}`);
                return 0;
            }
            else {
                // set id
                logger_1.logger.info(`target t_participate's id = ${recruitment.id}`);
                data.id = recruitment.id;
                // update date
                const exeute_date = new Date();
                data.regist_time = exeute_date;
                data.update_time = exeute_date;
                const result = yield this.client.t_participate.create({
                    data: this.exclude(data, ['token']),
                });
                logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
                return 1;
            }
        });
    }
    /**
     * insert data lists
     * @param data_list
     * @returns
     */
    insert_t_participate_list(data_list) {
        return __awaiter(this, void 0, void 0, function* () {
            // define return
            let ret = 0;
            logger_1.logger.info(`insert into t_participate lsit. list = ${JSON.stringify(data_list)}`);
            // loop insert
            for (let v of data_list) {
                ret = ret + (yield this.insert_t_participate(v));
            }
            logger_1.logger.info(`insert succeeded. result count = ${ret}`);
            return ret;
        });
    }
    /**
     * update data
     * @param data key is [data.id] and [data.user_id]
     * @returns
     */
    update_t_participate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`update t_participate. data = ${JSON.stringify(data)}, key = { id: ${data.id} }`);
            // select recruitment by token
            let recruitment = yield this.select_m_recruitment_by_token(data.token);
            if (recruitment == null) {
                logger_1.logger.error(`update failed. id = ${data.id}, token = ${data.token}`);
                return 0;
            }
            else {
                // set id
                logger_1.logger.info(`target t_participate's id = ${recruitment.id}`);
                data.id = recruitment.id;
                // update date
                const exeute_date = new Date();
                data.update_time = exeute_date;
                const result = yield this.client.t_participate.update({
                    where: {
                        id_user_id: {
                            id: data.id,
                            user_id: data.user_id,
                        }
                    },
                    data: this.exclude(data, ['token']),
                });
                logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
                return 1;
            }
        });
    }
    /**
     * delete data by token
     * @param token
     * @returns
     */
    delete_t_participate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete t_participate. token = ${token}`);
            let recruitment = yield this.select_m_recruitment_by_token(token);
            if (recruitment == null) {
                logger_1.logger.error(`target token data not found on m_recruitment. token = ${token}`);
                return 0;
            }
            else {
                logger_1.logger.info(`target token select successded. token = ${token}, id = ${recruitment.id}`);
                const delete_payload = yield this.client.t_participate.deleteMany({
                    where: {
                        id: recruitment.id,
                    }
                });
                logger_1.logger.info(`delete t_participate succeeeded. count = ${delete_payload}`);
                return delete_payload.count;
            }
        });
    }
    /**
     * delete all data
     * @param token
     * @returns
     */
    delete_t_participate_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete all t_participate.`);
            const delete_payload = yield this.client.t_participate.deleteMany();
            logger_1.logger.info(`delete t_participate succeeeded. count = ${delete_payload}`);
            return delete_payload.count;
        });
    }
    /**
     * select data list by token
     * @param token
     * @returns participate data list
     */
    get_t_participate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`get t_participate. token = ${token}`);
            let recruitment = yield this.select_m_recruitment_by_token(token);
            if (recruitment == null) {
                logger_1.logger.info(`target token data not found on m_recruitment. token = ${token}`);
                return [];
            }
            else {
                logger_1.logger.info(`target token select successded. token = ${token}, id = ${recruitment.id}`);
                const ret = [];
                yield this.client.t_participate.findMany({
                    where: {
                        id: recruitment.id,
                        delete: false,
                    },
                    orderBy: {
                        regist_time: 'desc',
                    }
                }).then((list) => {
                    list.forEach((v) => {
                        ret.push(participate_1.Participate.parse_from_db(v, token));
                    });
                });
                logger_1.logger.info(`select successed. result count = ${ret.length}`);
                return ret;
            }
        });
    }
}
exports.ParticipateRepository = ParticipateRepository;
//# sourceMappingURL=participate.js.map