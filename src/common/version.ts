// import constants
import { VersionRepository } from '../db/version';

export class Version {

    public version_repo = new VersionRepository();

    /**
     * return application version
     * @returns version string of hard coding
     */
    async get_app_version(): Promise<string> {
        try {
            const result = await this.version_repo.get_m_version();
            return result.app_version;
        } catch (err) {
            throw `get app version failed. error = ${err}`;
        }
    }

    /**
     * return database version
     * @returns version string of database (m_version)
     */
    async get_database_version(): Promise<string> {
        try {
            const result = await this.version_repo.get_m_version();
            return result.database_version;
        } catch (err) {
            throw `get database version failed. error = ${err}`;
        }
    }
}