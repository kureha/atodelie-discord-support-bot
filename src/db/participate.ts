// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Participate } from '../entity/participate';

// import utils
import { PrismaClient, m_recruitment, t_participate } from '@prisma/client';
import { Recruitment } from '../entity/recruitment';
import { Common } from './common';

export class ParticipateRepository {
    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * exclude user list element object (shallow copy)
     * @param recruitment 
     * @param keys 
     * @returns 
     */
    exclude<Participate, Key extends keyof Participate>(
        recruitment: Participate,
        keys: Key[]
    ): Omit<Participate, Key> {
        let result: Participate = { ...recruitment };
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
     * select m_recruitment by token.
     * @param token 
     * @returns 
     */
    async select_m_recruitment_by_token(token: string): Promise<Recruitment | null> {
        const data: m_recruitment | null = await this.client.m_recruitment.findFirst({
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
        } else {
            return Recruitment.parse_from_db(data);
        }
    }

    /**
     * insert data
     * @param data 
     * @returns 
     */
    async insert_t_participate(data: Participate): Promise<number> {
        logger.info(`insert into t_participate. data(exclude id) = ${JSON.stringify(data)}`);

        // select recruitment by token
        let recruitment = await this.select_m_recruitment_by_token(data.token);

        if (recruitment == null) {
            logger.error(`insert failed. id = ${data.id}, token = ${data.token}`);
            return 0;
        } else {
            // set id
            logger.info(`target t_participate's id = ${recruitment.id}`);
            data.id = recruitment.id;
            // update date
            const exeute_date: Date = new Date();
            data.regist_time = exeute_date;
            data.update_time = exeute_date;

            const result = await this.client.t_participate.create({
                data: this.exclude(data, ['token']),
            });
            logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);

            return 1;
        }
    }

    /**
     * insert data lists
     * @param data_list 
     * @returns 
     */
    async insert_t_participate_list(data_list: Participate[]): Promise<number> {
        // define return
        let ret: number = 0;

        logger.info(`insert into t_participate lsit. list = ${JSON.stringify(data_list)}`);
        // loop insert
        for (let v of data_list) {
            ret = ret + await this.insert_t_participate(v);
        }

        logger.info(`insert succeeded. result count = ${ret}`);
        return ret;
    }

    /**
     * update data
     * @param data key is [data.id] and [data.user_id]
     * @returns 
     */
    async update_t_participate(data: Participate): Promise<number> {
        logger.info(`update t_participate. data = ${JSON.stringify(data)}, key = { id: ${data.id} }`);

        // select recruitment by token
        let recruitment = await this.select_m_recruitment_by_token(data.token);

        if (recruitment == null) {
            logger.error(`update failed. id = ${data.id}, token = ${data.token}`);
            return 0;
        } else {
            // set id
            logger.info(`target t_participate's id = ${recruitment.id}`);
            data.id = recruitment.id;
            // update date
            const exeute_date: Date = new Date();
            data.update_time = exeute_date;

            const result = await this.client.t_participate.update({
                where: {
                    id_user_id: {
                        id: data.id,
                        user_id: data.user_id,
                    }
                },
                data: this.exclude(data, ['token']),
            });

            logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
            return 1;
        }
    }

    /**
     * delete data by token
     * @param token 
     * @returns 
     */
    async delete_t_participate(token: string): Promise<number> {
        logger.info(`delete t_participate. token = ${token}`);
        let recruitment = await this.select_m_recruitment_by_token(token);

        if (recruitment == null) {
            logger.error(`target token data not found on m_recruitment. token = ${token}`)
            return 0;
        } else {
            logger.info(`target token select successded. token = ${token}, id = ${recruitment.id}`);
            const delete_payload = await this.client.t_participate.deleteMany({
                where: {
                    id: recruitment.id,
                }
            });
            logger.info(`delete t_participate succeeeded. count = ${delete_payload}`);
            return delete_payload.count;
        }
    }

    /**
     * delete all data
     * @param token 
     * @returns 
     */
    async delete_t_participate_all(): Promise<number> {
        logger.info(`delete all t_participate.`);

        const delete_payload = await this.client.t_participate.deleteMany();
        logger.info(`delete t_participate succeeeded. count = ${delete_payload}`);
        return delete_payload.count;
    }

    /**
     * select data list by token
     * @param token 
     * @returns participate data list
     */
    async get_t_participate(token: string): Promise<Participate[]> {
        logger.info(`get t_participate. token = ${token}`);
        let recruitment = await this.select_m_recruitment_by_token(token);

        if (recruitment == null) {
            logger.info(`target token data not found on m_recruitment. token = ${token}`)
            return [];
        } else {
            logger.info(`target token select successded. token = ${token}, id = ${recruitment.id}`);
            const ret: Participate[] = [];
            await this.client.t_participate.findMany({
                where: {
                    id: recruitment.id,
                    delete: false,
                },
                orderBy: {
                    regist_time: 'desc',
                }
            }).then((list: t_participate[]) => {
                list.forEach((v) => {
                    ret.push(Participate.parse_from_db(v, token));
                });
            });

            logger.info(`select successed. result count = ${ret.length}`);
            return ret;
        }
    }
}