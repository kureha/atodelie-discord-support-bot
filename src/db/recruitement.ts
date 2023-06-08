// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Recruitment } from '../entity/recruitment';

// import uuid modules
import * as uuid from 'uuid';

// import utils
import { PrismaClient, m_recruitment } from '@prisma/client';
import { Common } from './common';

export class RecruitmentRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * get UUID format token
     * @returns UUID
     */
    static create_uuid_token(): string {
        return uuid.v4();
    }

    /**
     * exclude user list element object (shallow copy)
     * @param recruitment 
     * @param keys 
     * @returns 
     */
    exclude<Recruitment, Key extends keyof Recruitment>(
        recruitment: Recruitment,
        keys: Key[]
    ): Omit<Recruitment, Key> {
        let result: Recruitment = { ...recruitment };
        for (let key of keys) {
            delete result[key];
        }
        return result;
    }

    /**
     * returns condition limit date
     * @returns 
     */
    get_condition_limit_date(): Date {
        let target_date: Date = new Date();
        target_date.setMinutes(target_date.getMinutes() - constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE);
        return target_date;
    }

    /**
     * insert data
     * @param data 
     * @returns
     */
    async insert_m_recruitment(data: Recruitment): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.regist_time = exeute_date;
        data.update_time = exeute_date;

        logger.info(`insert into insert_m_recruitment. data = ${JSON.stringify(data)}`);
        const result: m_recruitment = await this.client.m_recruitment.create({
            data: this.exclude(data, ['user_list'])
        });

        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * update data
     * @param data 
     * @returns 
     */
    async update_m_recruitment(data: Recruitment): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.update_time = exeute_date;

        logger.info(`update m_recruitment. data = ${JSON.stringify(data)}, key = { id: ${data.id} }`);

        try {
            const result: m_recruitment = await this.client.m_recruitment.update({
                where: {
                    id: data.id,
                },
                data: this.exclude(data, ['user_list']),
            });
            logger.info(`update successful. data = ${JSON.stringify(result)}`);
            return 1;
        } catch (err) {
            logger.error(`update failed. error = ${err}`);
            return 0;
        }
    }

    /**
     * delete data
     * @param token 
     * @returns 
     */
    async delete_m_recruitment(token: string): Promise<number> {
        logger.info(`delete m_recruitment. token = ${token}`);

        const result = await this.client.m_recruitment.deleteMany({
            where: {
                token: token
            },
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete data 
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    async delete_m_recruitment_all(): Promise<number> {
        logger.info(`delete all m_recruitment.`);

        const result = await this.client.m_recruitment.deleteMany({});

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * get max id for m_recruitment
     * @returns max id number
     */
    async get_m_recruitment_id(): Promise<number> {
        logger.info(`select m_recruitment max id`);

        const data: m_recruitment | null = await this.client.m_recruitment.findFirst({
            orderBy: {
                id: 'desc',
            }
        });

        if (data == null) {
            logger.info(`record not found. max id = 1`);
            return 1;
        } else {
            logger.info(`select successed. max id = ${data.id + 1}`);
            return data.id + 1;
        }
    }

    /**
     * get data list for follow 
     * @param server_id 
     * @param user_id 
     * @returns follow up data list
     */
    async get_m_recruitment_for_user(server_id: string, user_id: string): Promise<Recruitment[]> {
        logger.info(`select m_recruitment. server_id = ${server_id}, user_id = ${user_id}`);

        let ret: Recruitment[] = [];

        const result: m_recruitment[] = await this.client.m_recruitment.findMany({
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
            ret.push(Recruitment.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data list for follow 
     * @param server_id 
     * @param from_datetime 
     * @param to_datetime 
     * @returns follow up data list
     */
    async get_m_recruitment_for_follow(server_id: string, from_datetime: Date, to_datetime: Date): Promise<Recruitment[]> {
        logger.info(`select m_recruitment. server_id = ${server_id}, from_datetime = ${from_datetime.toISOString()}, to_datetime = ${to_datetime.toISOString()}`);

        let ret: Recruitment[] = [];

        const result: m_recruitment[] = await this.client.m_recruitment.findMany({
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
            ret.push(Recruitment.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get token for m_recruitment
     * if token is already exists, this function will by reject, please retry
     * @param token
     * @returns token string
     */
    async get_m_recruitment_token(token?: string): Promise<string> {
        logger.info(`select m_recruitment. token = ${token}`);

        if (token == undefined) {
            token = RecruitmentRepository.create_uuid_token();
            logger.info(`generate token (no check m_recruitment). token = ${token}`);
        }

        const data: m_recruitment | null = await this.client.m_recruitment.findFirst({
            where: {
                token: token,
                limit_time: {
                    gte: this.get_condition_limit_date(),
                },
                delete: false
            }
        });

        if (data == null) {
            logger.info(`token check by m_recruitment ok. same token is not found.`);
            return token || '';
        } else {
            logger.error(`generated token is not unique, rejected. same token found.`);
            throw `generated token is not unique, rejected.`;
        }
    }

    /**
     * select single data
     * @param token 
     * @returns recruitment data
     */
    async get_m_recruitment(token: string): Promise<Recruitment> {
        logger.info(`select m_recruitment. token = ${token}`);

        const data: m_recruitment | null = await this.client.m_recruitment.findFirst({
            where: {
                token: token,
                limit_time: {
                    gte: this.get_condition_limit_date(),
                },
                delete: false
            }
        });

        if (data == null) {
            logger.error(`data not found on m_recruitment. token = ${token}`);
            throw `data not found on m_recruitment.`;
        } else {
            logger.info(`select successed. data = ${JSON.stringify(data)}`);
            return Recruitment.parse_from_db(data);
        }
    }

    /**
     * select data by message id and owner id
     * @param message_id message id
     * @param owner_id owner id
     * @returns recruitment data
     */
    async get_m_recruitment_by_message_id(message_id: string, owner_id: string): Promise<Recruitment> {
        logger.info(`select m_recruitment. message_id = ${message_id}, owner_id = ${owner_id}`);

        const data: m_recruitment | null = await this.client.m_recruitment.findFirst({
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
            logger.error(`data not found on m_recruitment. message_id = ${message_id}, owner_id = ${owner_id}`);
            throw `data not found on m_recruitment.`;
        } else {
            logger.info(`select successed. data = ${JSON.stringify(data)}`);
            return Recruitment.parse_from_db(data);
        }
    }

    /**
     * select data list for server
     * @param server_id server id
     * @returns recruitment data
     */
    async get_m_recruitment_latests(server_id: string, count: number): Promise<Recruitment[]> {
        logger.info(`select m_recruitment. server_id = ${server_id}, count = ${count}`);

        let ret: Recruitment[] = [];

        await this.client.m_recruitment.findMany({
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
        }).then((list: m_recruitment[]) => {
            list.forEach((v) => {
                ret.push(Recruitment.parse_from_db(v));
            });
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }
}