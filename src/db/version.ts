// define logger
import { logger } from '../common/logger';

import { Version } from '../entity/version';
import { PrismaClient, m_version } from '@prisma/client';
import { Common } from './common';

export class VersionRepository {

    /**
     * Prisma client
     */
    public client: PrismaClient = Common.get_prisma_client();

    /**
     * Version of default
     */
    public static VERSION_DEFAULT: string = '1.0.0.0';

    /**
     * get data
     * @param  
     * @returns single data
     */
    async get_m_version(): Promise<Version> {
        logger.info(`select m_version.`);

        let list: m_version[] = await this.client.m_version.findMany({
            orderBy: {
                app_version: 'desc',
            }
        });

        if (list.length == 0) {
            logger.error(`not found on m_version. return initial version. result count = ${list.length}`);
            let initial_version: Version = new Version();
            initial_version.app_version = VersionRepository.VERSION_DEFAULT;
            initial_version.database_version = VersionRepository.VERSION_DEFAULT;
            return initial_version;
        } else {
            logger.info(`select successed. data = ${JSON.stringify(list[0])}`);
            return Version.parse_from_db(list[0]);
        }
    }

    /**
     * insert data
     * @param version_data 
     * @returns
     */
    async insert_m_version(version_data: Version): Promise<number> {
        logger.info(`insert into m_version. data = ${JSON.stringify(version_data)}`);

        const result = await this.client.m_version.create({
            data: version_data
        });

        logger.info(`insert succeeded. result data = ${JSON.stringify(result)}`);
        return 1;
    }

    /**
     * delete data
     * @param token 
     * @returns 
     */
    async delete_m_version(version_data: Version): Promise<number> {
        logger.info(`delete m_version. token = ${version_data}`);

        const result = await this.client.m_version.deleteMany({
            where: {
                app_version: version_data.app_version,
                database_version: version_data.database_version,
            }
        });

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }

    /**
     * delete data
     * @param token 
     * @returns 
     */
    async delete_m_version_all(): Promise<number> {
        logger.info(`delete m_version all.`);

        const result = await this.client.m_version.deleteMany({});

        logger.info(`delete succeeded. count = ${result.count}`);
        return result.count;
    }
}