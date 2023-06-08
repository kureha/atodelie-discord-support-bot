"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RecruitmentRepository = void 0;
// define logger
const logger_1 = require("../common/logger");
// import constants
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
// import entities
const recruitment_1 = require("../entity/recruitment");
// import uuid modules
const uuid = __importStar(require("uuid"));
const common_1 = require("./common");
class RecruitmentRepository {
    constructor() {
        /**
         * Prisma client
         */
        this.client = common_1.Common.get_prisma_client();
    }
    /**
     * get UUID format token
     * @returns UUID
     */
    static create_uuid_token() {
        return uuid.v4();
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
     * insert data
     * @param data
     * @returns
     */
    insert_m_recruitment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.regist_time = exeute_date;
            data.update_time = exeute_date;
            logger_1.logger.info(`insert into insert_m_recruitment. data = ${JSON.stringify(data)}`);
            const result = yield this.client.m_recruitment.create({
                data: this.exclude(data, ['user_list'])
            });
            logger_1.logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        });
    }
    /**
     * update data
     * @param data
     * @returns
     */
    update_m_recruitment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // update date
            const exeute_date = new Date();
            data.update_time = exeute_date;
            logger_1.logger.info(`update m_recruitment. data = ${JSON.stringify(data)}, key = { id: ${data.id} }`);
            try {
                const result = yield this.client.m_recruitment.update({
                    where: {
                        id: data.id,
                    },
                    data: this.exclude(data, ['user_list']),
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
     * delete data
     * @param token
     * @returns
     */
    delete_m_recruitment(token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete m_recruitment. token = ${token}`);
            const result = yield this.client.m_recruitment.deleteMany({
                where: {
                    token: token
                },
            });
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * delete data
     * @param server_id
     * @param user_id
     * @param game_id
     * @returns
     */
    delete_m_recruitment_all() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`delete all m_recruitment.`);
            const result = yield this.client.m_recruitment.deleteMany({});
            logger_1.logger.info(`delete succeeded. count = ${result.count}`);
            return result.count;
        });
    }
    /**
     * get max id for m_recruitment
     * @returns max id number
     */
    get_m_recruitment_id() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment max id`);
            const data = yield this.client.m_recruitment.findFirst({
                orderBy: {
                    id: 'desc',
                }
            });
            if (data == null) {
                logger_1.logger.info(`record not found. max id = 1`);
                return 1;
            }
            else {
                logger_1.logger.info(`select successed. max id = ${data.id + 1}`);
                return data.id + 1;
            }
        });
    }
    /**
     * get data list for follow
     * @param server_id
     * @param user_id
     * @returns follow up data list
     */
    get_m_recruitment_for_user(server_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. server_id = ${server_id}, user_id = ${user_id}`);
            let ret = [];
            const result = yield this.client.m_recruitment.findMany({
                where: {
                    server_id: server_id,
                    owner_id: user_id,
                    limit_time: {
                        gte: this.get_condition_limit_date(),
                    },
                    delete: false,
                },
                orderBy: {
                    limit_time: 'desc'
                }
            });
            result.forEach((v) => {
                ret.push(recruitment_1.Recruitment.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get data list for follow
     * @param server_id
     * @param from_datetime
     * @param to_datetime
     * @returns follow up data list
     */
    get_m_recruitment_for_follow(server_id, from_datetime, to_datetime) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. server_id = ${server_id}, from_datetime = ${from_datetime.toISOString()}, to_datetime = ${to_datetime.toISOString()}`);
            let ret = [];
            const result = yield this.client.m_recruitment.findMany({
                where: {
                    server_id: server_id,
                    limit_time: {
                        gte: from_datetime,
                        lte: to_datetime
                    },
                    delete: false
                },
                orderBy: {
                    limit_time: 'desc'
                }
            });
            result.forEach((v) => {
                ret.push(recruitment_1.Recruitment.parse_from_db(v));
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
    /**
     * get token for m_recruitment
     * if token is already exists, this function will by reject, please retry
     * @param token
     * @returns token string
     */
    get_m_recruitment_token(token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. token = ${token}`);
            if (token == undefined) {
                token = RecruitmentRepository.create_uuid_token();
                logger_1.logger.info(`generate token (no check m_recruitment). token = ${token}`);
            }
            const data = yield this.client.m_recruitment.findFirst({
                where: {
                    token: token,
                    limit_time: {
                        gte: this.get_condition_limit_date(),
                    },
                    delete: false
                }
            });
            if (data == null) {
                logger_1.logger.info(`token check by m_recruitment ok. same token is not found.`);
                return token || '';
            }
            else {
                logger_1.logger.error(`generated token is not unique, rejected. same token found.`);
                throw `generated token is not unique, rejected.`;
            }
        });
    }
    /**
     * select single data
     * @param token
     * @returns recruitment data
     */
    get_m_recruitment(token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. token = ${token}`);
            const data = yield this.client.m_recruitment.findFirst({
                where: {
                    token: token,
                    limit_time: {
                        gte: this.get_condition_limit_date(),
                    },
                    delete: false
                }
            });
            if (data == null) {
                logger_1.logger.error(`data not found on m_recruitment. token = ${token}`);
                throw `data not found on m_recruitment.`;
            }
            else {
                logger_1.logger.info(`select successed. data = ${JSON.stringify(data)}`);
                return recruitment_1.Recruitment.parse_from_db(data);
            }
        });
    }
    /**
     * select data by message id and owner id
     * @param message_id message id
     * @param owner_id owner id
     * @returns recruitment data
     */
    get_m_recruitment_by_message_id(message_id, owner_id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. message_id = ${message_id}, owner_id = ${owner_id}`);
            const data = yield this.client.m_recruitment.findFirst({
                where: {
                    message_id: message_id,
                    owner_id: owner_id,
                    limit_time: {
                        gte: this.get_condition_limit_date(),
                    },
                    delete: false
                }
            });
            if (data == null) {
                logger_1.logger.error(`data not found on m_recruitment. message_id = ${message_id}, owner_id = ${owner_id}`);
                throw `data not found on m_recruitment.`;
            }
            else {
                logger_1.logger.info(`select successed. data = ${JSON.stringify(data)}`);
                return recruitment_1.Recruitment.parse_from_db(data);
            }
        });
    }
    /**
     * select data list for server
     * @param server_id server id
     * @returns recruitment data
     */
    get_m_recruitment_latests(server_id, count) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`select m_recruitment. server_id = ${server_id}, count = ${count}`);
            let ret = [];
            yield this.client.m_recruitment.findMany({
                where: {
                    server_id: server_id,
                    limit_time: {
                        gte: this.get_condition_limit_date(),
                    },
                    delete: false
                },
                orderBy: {
                    limit_time: 'desc'
                },
                skip: 0,
                take: count
            }).then((list) => {
                list.forEach((v) => {
                    ret.push(recruitment_1.Recruitment.parse_from_db(v));
                });
            });
            logger_1.logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        });
    }
}
exports.RecruitmentRepository = RecruitmentRepository;
//# sourceMappingURL=recruitement.js.map