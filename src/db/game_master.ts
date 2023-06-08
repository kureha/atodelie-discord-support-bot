// define logger
import { logger } from '../common/logger';

// import entities
import { GameMaster } from '../entity/game_master';

// import utils
import { PrismaClient, m_game_master } from '@prisma/client';
import { Common } from './common';

export class GameMasterRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * insert data
     * @param data 
     * @returns 
     */
    async insert_m_game_master(data: GameMaster): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.regist_time = exeute_date;
        data.update_time = exeute_date;

        logger.info(`insert into m_game_master. data = ${JSON.stringify(data)}`);

        const result = await this.client.m_game_master.create({
            data: data
        });

        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * update data
     * @param data key is [data.server_id] and [data.game_id]
     * @returns 
     */
    async update_m_game_master(data: GameMaster): Promise<number> {
        // update date
        const exeute_date: Date = new Date();
        data.update_time = exeute_date;

        logger.info(`update m_game_master. data = ${JSON.stringify(data)}`);
        try {
            const result: m_game_master = await this.client.m_game_master.update({
                where: {
                    server_id_game_id: {
                        server_id: data.server_id,
                        game_id: data.game_id,
                    }
                },
                data: data
            });

            logger.info(`update succeeded. data = ${JSON.stringify(result)}`);
            return 1;
        } catch (err) {
            logger.info(`no record updated. error = ${err}`);
            return 0;
        }
    }

    /**
     * delete data by server_id and game_id
     * @param server_id
     * @param game_id 
     * @returns 
     */
    async delete_m_game_master(server_id: string, game_id: string): Promise<number> {
        logger.info(`delete m_game_master. server_id = ${server_id}, game_id = ${game_id}`);

        const result = await this.client.m_game_master.deleteMany({
            where: {
                server_id: server_id,
                game_id: game_id,
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete all data
     * @param server_id
     * @param game_id 
     * @returns 
     */
    async delete_m_game_master_all(): Promise<number> {
        logger.info(`delete m_game_master all.`);

        const result = await this.client.m_game_master.deleteMany({});

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * get data by game master
     * @returns data
     */
    async get_m_game_master_all(server_id: string): Promise<GameMaster[]> {
        logger.info(`select m_game_master all. server_id = ${server_id}`);

        let ret: GameMaster[] = [];

        const result: m_game_master[] = await this.client.m_game_master.findMany({
            where: {
                server_id: server_id,
                delete: false,
            }
        });

        result.forEach((v) => {
            ret.push(GameMaster.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }

    /**
     * get data by game master
     * @returns data
     */
    async get_m_game_master(server_id: string, game_id: string): Promise<GameMaster> {
        logger.info(`select m_game_master all.`);

        const data: m_game_master | null = await this.client.m_game_master.findFirst({
            where: {
                server_id: server_id,
                game_id: game_id,
                delete: false,
            }
        });

        if (data == null) {
            logger.error(`data not found on m_game_master. server_id = ${server_id}`);
            throw `data not found on m_game_master. server_id = ${server_id}`;
        } else {
            logger.info(`select successed. data = ${JSON.stringify(data)}`);
            return GameMaster.parse_from_db(data);
        }
    }

    /**
     * get data by game master
     * @returns data
     */
    async get_m_game_master_by_presence_name(server_id: string, presence_name: string): Promise<GameMaster[]> {
        logger.info(`select m_game_master by presence name. server_id = ${server_id}, precense_name = ${presence_name}`);

        let ret: GameMaster[] = [];

        const result: m_game_master[] = await this.client.m_game_master.findMany({
            where: {
                server_id: server_id,
                presence_name: presence_name,
                delete: false,
            }
        });

        result.forEach((v) => {
            ret.push(GameMaster.parse_from_db(v));
        });

        logger.info(`select successed. result count = ${ret.length}`);
        return ret;
    }
}