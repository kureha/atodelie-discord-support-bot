// define logger
import { logger } from '../common/logger';

// import entities
import { ServerInfo } from '../entity/server_info';
import { PrismaClient, m_server_info } from '@prisma/client';
import { Common } from './common';

export class ServerInfoRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * get data by server id
     * @returns data
     */
    async get_m_server_info_all(): Promise<ServerInfo[]> {
        logger.info(`select m_server_info all.`);

        let ret: ServerInfo[] = [];

        const result: m_server_info[] = await this.client.m_server_info.findMany({
            orderBy: {
                server_id: 'asc'
            },
        });

        result.forEach((v) => {
            ret.push(ServerInfo.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data by server id
     * @param server_id 
     * @returns data
     */
    async get_m_server_info(server_id: string): Promise<ServerInfo> {
        logger.info(`select m_server_info.`);

        const data: m_server_info | null = await this.client.m_server_info.findFirst({
            where: {
                server_id: server_id
            }
        });

        if (data == null) {
            logger.error(`data not found on m_server_info. please setting m_server_info. server_id = ${server_id}`);
            throw `data not found on m_server_info. please setting m_server_info. server_id = ${server_id}`;
        } else {
            logger.info(`select successed. data = ${JSON.stringify(data)}`);
            return ServerInfo.parse_from_db(data);
        }
    }

    /**
     * insert data
     * @param server_info_data 
     * @returns
     */
    async insert_m_server_info(data: ServerInfo): Promise<number> {
        logger.info(`insert into m_server_info. data = ${JSON.stringify(data)}`);

        const result: m_server_info = await this.client.m_server_info.create({
            data: data
        });
        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * update data
     * @param server_info_data 
     * @returns
     */
    async update_m_server_info(data: ServerInfo): Promise<number> {
        logger.info(`update m_server_info. data = ${JSON.stringify(data)}`);
        try {
            const result: m_server_info = await this.client.m_server_info.update({
                where: {
                    server_id: data.server_id,
                }, data: data
            });
            logger.info(`update successful. data = ${JSON.stringify(result)}`);
            return 1;
        } catch (err) {
            logger.error(`update failed. error = ${err}`)
            return 0;
        }
    }

    /**
     * update m_server follow time data
     * @param server_id 
     * @param follow_time
     * @returns
     */
    async update_m_server_info_follow_time(server_id: string, follow_time: Date): Promise<number> {
        logger.info(`update m_server_info follow time. server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
        try {
            const result = await this.client.m_server_info.update({
                where: {
                    server_id: server_id,
                }
                , data: {
                    follow_time: follow_time
                }
            });
            logger.info(`update succeeded. data = ${JSON.stringify(result)}`);
            return 1;
        } catch (err) {
            logger.error(`update failed. error = ${err}`);
            return 0;
        }
    }

    /**
     * delete data by server id
     * @param server_id 
     * @returns 
     */
    async delete_m_server_info(server_id: string): Promise<number> {
        logger.info(`delete m_server_info. server_id = ${server_id}`);

        const result = await this.client.m_server_info.deleteMany({
            where: {
                server_id: server_id,
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete data by server id
     * @param server_id 
     * @returns 
     */
    async delete_m_server_info_all(): Promise<number> {
        logger.info(`delete m_server_info all.`);

        const result = await this.client.m_server_info.deleteMany({});

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }
}