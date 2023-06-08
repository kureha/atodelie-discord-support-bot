// define logger
import { logger } from '../common/logger';

// import utils
import { AnnouncementHistory } from '../entity/announcement_history';
import { PrismaClient, t_announcement_history } from '@prisma/client';
import { Common } from './common';

export class AnnouncementHistoryRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * insert data
     * @param data 
     * @returns 
     */
    async insert_t_announcement(data: AnnouncementHistory): Promise<number> {
        logger.info(`insert into t_announcement_history. data = ${JSON.stringify(data)}`);

        const result: t_announcement_history = await this.client.t_announcement_history.create({
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
    async delete_t_announcement(server_id: string, announcement_time: Date): Promise<number> {
        logger.info(`delete t_announcement_history. server_id = ${server_id}, announcement_time = ${announcement_time.toISOString()}`);

        const result = await this.client.t_announcement_history.deleteMany({
            where: {
                server_id: server_id,
                announcement_time: {
                    lte: announcement_time,
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
    async delete_t_announcement_all(server_id: string): Promise<number> {
        logger.info(`delete t_announcement_history all. server_id = ${server_id}`);

        const result = await this.client.t_announcement_history.deleteMany({
            where: {
                server_id: server_id,
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * get data by server id info
     * @param server_id
     * @returns data
     */
    async get_t_announcement_all(server_id: string): Promise<AnnouncementHistory[]> {
        logger.info(`select t_announcement_history. server_id = ${server_id}`);

        let ret: AnnouncementHistory[] = [];

        const result: t_announcement_history[] = await this.client.t_announcement_history.findMany({
            where: {
                server_id: server_id
            },
            orderBy: {
                announcement_time: 'desc',
            },
        });

        result.forEach((v) => {
            ret.push(AnnouncementHistory.parse_from_db(v));
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
    async get_t_announcement(server_id: string, channel_id: string, limit_number: number): Promise<AnnouncementHistory[]> {
        logger.info(`select t_announcement_history. server_id = ${server_id}, channel_id = ${channel_id}, limit_number = ${limit_number}`);

        let ret: AnnouncementHistory[] = [];

        const result: t_announcement_history[] = await this.client.t_announcement_history.findMany({
            where: {
                server_id: server_id,
                channel_id: channel_id,
            },
            skip: 0,
            take: limit_number,
            orderBy: {
                announcement_time: 'desc',
            },
        });

        result.forEach((v) => {
            ret.push(AnnouncementHistory.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }
}