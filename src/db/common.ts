// define logger
import { logger } from '../common/logger';

// import file module
import { PrismaClient } from '@prisma/client';

export class Common {
    /**
     * Prisma client
     */
    private static client: PrismaClient | null = null;

    /**
     * returns prisma client (singleton)
     * @returns 
     */
    static get_prisma_client(): PrismaClient {
        // if client is not existed, create instance.
        if (this.client == null) {
            this.client = new PrismaClient();
            logger.info(`create prisma client completed.`);
        }
        // return instance.
        return this.client;
    }
}