// define logger
import { logger } from '../common/logger';

// import entities
import { FriendCode } from '../entity/friend_code';

// import utils
import { PrismaClient, t_friend_code_history } from '@prisma/client';
import { Common } from './common';

export class FriendCodeHistoryRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * insert data
     * @param data 
     * @returns 
     */
    async insert_t_friend_code(data: FriendCode): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.regist_time = exeute_date;
        data.update_time = exeute_date;

        logger.info(`insert into t_friend_code_history. data = ${JSON.stringify(data)}`);

        const result = await this.client.t_friend_code_history.create({ data: data });

        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    async delete_t_friend_code(server_id: string, user_id: string, game_id: string): Promise<number> {
        logger.info(`delete t_friend_code_history. server_id = ${server_id}, user_id = ${user_id}, game_id = ${game_id}`);

        const result = await this.client.t_friend_code_history.deleteMany({
            where: {
                server_id: server_id,
                user_id: user_id,
                game_id: game_id
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    async delete_t_friend_code_all(): Promise<number> {
        logger.info(`delete all t_friend_code_history.`);

        const result = await this.client.t_friend_code_history.deleteMany({});

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    async get_t_friend_code_all(server_id: string): Promise<FriendCode[]> {
        logger.info(`select t_friend_code_history. server_id = ${server_id}`);

        let ret: FriendCode[] = [];

        const result: t_friend_code_history[] = await this.client.t_friend_code_history.findMany({
            where: {
                server_id: server_id,
                delete: false
            }
        });

        result.forEach((v) => {
            ret.push(FriendCode.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @param user_id
     * @returns data
     */
    async get_t_friend_code(server_id: string, user_id: string): Promise<FriendCode[]> {
        logger.info(`select t_friend_code_history. server_id = ${server_id}, user_id = ${user_id}`);

        let ret: FriendCode[] = [];

        const result: t_friend_code_history[] = await this.client.t_friend_code_history.findMany({
            where: {
                server_id: server_id,
                user_id: user_id,
                delete: false
            }
        });

        result.forEach((v) => {
            ret.push(FriendCode.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @param game_id
     * @returns data
     */
    async get_t_friend_code_from_game_id(server_id: string, game_id: string): Promise<FriendCode[]> {
        logger.info(`select t_friend_code_history. server_id = ${server_id}, game_id = ${game_id}`);

        let ret: FriendCode[] = [];

        const result = await this.client.t_friend_code_history.findMany({
            where: {
                server_id: server_id,
                game_id: game_id,
                delete: false
            }
        });

        result.forEach((v) => {
            ret.push(FriendCode.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }
}