// define logger
import { logger } from '../common/logger';

// import utils
import { ActivityHistory } from '../entity/activity_history';
import { PrismaClient, t_activity_history } from '@prisma/client';
import { Common } from './common';

export class ActivityHistoryRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * insert data
     * @param data 
     * @returns 
     */
    async insert_t_activity_history(data: ActivityHistory): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.regist_time = exeute_date;
        data.update_time = exeute_date;
        
        logger.info(`insert into t_activity_history. data = ${JSON.stringify(data)}`);

        const result = await this.client.t_activity_history.create({
            data: data
        });

        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * delete data by change_time before input param
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    async delete_t_activity_history(server_id: string, change_time: Date): Promise<number> {
        logger.info(`delete t_activity_history. server_id = ${server_id}, change_time(lte) = ${change_time}`);

        const result = await this.client.t_activity_history.deleteMany({
            where: {
                server_id: server_id,
                change_time: {
                    lte: change_time,
                },
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete data by change_time before input param
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    async delete_t_activity_history_all(server_id: string): Promise<number> {
        logger.info(`delete t_activity_history all. server_id = ${server_id}`);

        const result = await this.client.t_activity_history.deleteMany({
            where: {
                server_id: server_id,
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    async get_t_activity_history_all(server_id: string): Promise<ActivityHistory[]> {
        logger.info(`select t_activity_history all. server_id = ${server_id}`);

        let ret: ActivityHistory[] = [];

        const result: t_activity_history[] = await this.client.t_activity_history.findMany({
            where: {
                server_id: server_id,
                delete: false,
            },
            orderBy: {
                change_time: 'desc'
            }
        });

        result.forEach((v) => {
            ret.push(ActivityHistory.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @param channel_id
     * @returns data
     */
    async get_t_activity_history(server_id: string, channel_id: string, limit_number: number): Promise<ActivityHistory[]> {
        logger.info(`select t_activity_history. server_id = ${server_id}, channel_id = ${channel_id}, limit_number = ${limit_number}`);

        let ret: ActivityHistory[] = [];

        const result: t_activity_history[] = await this.client.t_activity_history.findMany({
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
            ret.push(ActivityHistory.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }
}