// import sqlite utils
import { SqliteUtils } from "../logic/sqlite_utils";

export class Version {
    app_version: string;
    database_version: string;

    /**
     * constructor
     * @constructor
     */
    constructor() {
        this.app_version = '';
        this.database_version = '';
    }

    /**
     * convert database select data to instance
     * @param row m_version table single row
     * @returns version instance, return blank instance if error occuered
     */
    static parse_from_db(row: any): Version {
        let v = new Version();

        try {
            v.app_version = SqliteUtils.get_value(row.app_version);
            v.database_version = SqliteUtils.get_value(row.database_version);
        } catch (e) {
            v = new Version();
        }

        return v;
    }
}