// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { ServerInfo } from '../entity/server_info';

// import utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class ServerInfoRepository {

    /**
     * create table SQL
     */
    static SQL_CREATE_M_SERVER_INFO = 'CREATE TABLE IF NOT EXISTS [m_server_info] ( [server_id] TEXT NOT NULL UNIQUE, [channel_id] TEXT NOT NULL, [recruitment_target_role] TEXT NOT NULL, [follow_time] DATETIME, PRIMARY KEY([server_id]) )';

    /**
     * insert SQL
     */
    static SQL_INSERT_M_SERVER_INFO = 'INSERT INTO [m_server_info] ([server_id] , [channel_id], [recruitment_target_role], [follow_time]) VALUES ($server_id, $channel_id, $recruitment_target_role, $follow_time) ';

    /**
     * update SQL
     */
    static SQL_UPDATE_M_SERVER_INFO = 'UPDATE [m_server_info] set [channel_id] = $channel_id, [recruitment_target_role] = $recruitment_target_role, [follow_time] = $follow_time ';

    /**
     * update SQL follow time
     */
    static SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME = 'UPDATE [m_server_info] SET follow_time = $follow_time ';

    /**
     * select SQL
     */
    static SQL_SELECT_M_SERVER_INFO = 'SELECT m1.[server_id] , m1.[channel_id], m1.[recruitment_target_role], m1.[follow_time] FROM [m_server_info] m1 ';

    /**
     * delete SQL
     */
    static SQL_DELETE_M_SERVER_INFO = 'DELETE FROM [m_server_info] ';

    /**
     * SQLITE FILE PATH
     */
    private sqlite_file_path: string = Constants.STRING_EMPTY;

    /**
     * constructor
     */
    constructor(file_path: string = constants.SQLITE_FILE) {
        // check database file path / memory
        if (SqliteUtils.check_open_database(file_path) == false) {
            logger.error(`database file is not found. file_path = ${file_path}`);
            throw new Error(`database file is not found. file_path = ${file_path}`);
        }

        // try to open
        const db = this.get_db_instance(file_path);
        logger.info(`database open successed. db = ${db}`);

        // set file path to instance
        this.sqlite_file_path = file_path;
        logger.info(`database file path is set to ${this.sqlite_file_path}. `);
    }

    /**
     * get using sqlite file path for this instance.
     * @returns sqlite file path
     */
    get_sqlite_file_path(): string {
        return this.sqlite_file_path;
    }

    /**
     * get sqlite3 database instance
     * @param file_path sqlite3 file path
     * @returns sqlite3 database instance
     */
    get_db_instance(file_path: string): any {
        // initialize SQLite instance
        const sqlite = require(constants.REQUIRE_NAME_SQLITE3).verbose();
        var db = new sqlite.Database(file_path);

        // detect SQLite error from instance
        if (db === undefined || db === null) {
            logger.error(`database instance is undefined or null.`);
            throw `database instance is undefined or null.`;
        } else {
            // return SQLite instance if status is good
            return db;
        }
    }

    /**
     * create table
     * @param db sqlite3 database instance
     */
    create_all_database(db: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            db.serialize(function () {
                // run serialize
                db.run(ServerInfoRepository.SQL_CREATE_M_SERVER_INFO, [], ((err: any) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${ServerInfoRepository.SQL_CREATE_M_SERVER_INFO}`);
                        reject(err);
                    }

                    // resolve after all sql completed
                    resolve();
                }));
            });

            db.close();
        });
    }

    /**
     * get data by server id
     * @returns data
     */
    get_m_server_info_all(): Promise<ServerInfo[]> {
        // define return values
        let result_list: ServerInfo[] = [];

        // return promise
        return new Promise<ServerInfo[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_SELECT_M_SERVER_INFO}`;
                logger.info(`sql = ${sql}`);
                db.all(sql, [], ((err: any, rows: any[]) => {
                    // create error server_info data
                    const error_server_info = new ServerInfo();
                    // return blank data
                    error_server_info.server_id = Constants.STRING_EMPTY;
                    error_server_info.channel_id = constants.RECRUITMENT_INVALID_CHANNEL_ID;
                    error_server_info.recruitment_target_role = constants.RECRUITMENT_INVALID_ROLE;
                    error_server_info.follow_time = Constants.get_default_date();

                    if (err) {
                        logger.error(`select m_server_info failed. please setting m_server_info. sql = ${sql}`);
                        // return blank data
                        resolve(result_list);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.error(`data not found on m_server_info. please setting m_server_info. sql = ${sql}`);
                        // return blank data
                        resolve(result_list);
                    } else {
                        // return correct data
                        logger.info(`selected m_server_info successed.`);
                        logger.trace(rows);
                        rows.forEach((v) => {
                            result_list.push(ServerInfo.parse_from_db(v));
                        });
                        resolve(result_list);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * get data by server id
     * @param server_id 
     * @returns data
     */
    get_m_server_info(server_id: string): Promise<ServerInfo> {
        // return promise
        return new Promise<ServerInfo>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_SELECT_M_SERVER_INFO} WHERE m1.[server_id] = ? `;
                logger.info(`sql = ${sql}, server_id = ${server_id}`);
                db.get(sql, [server_id], ((err: any, row: any) => {
                    // create error server_info data
                    const error_server_info = new ServerInfo();
                    // return blank data
                    error_server_info.server_id = server_id;
                    error_server_info.channel_id = constants.RECRUITMENT_INVALID_CHANNEL_ID;
                    error_server_info.recruitment_target_role = constants.RECRUITMENT_INVALID_ROLE;
                    error_server_info.follow_time = Constants.get_default_date();

                    if (err) {
                        logger.error(`select m_server_info failed. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // return blank data
                        resolve(error_server_info);
                    }
                    else if (row === undefined || row === null || row.length === 0) {
                        logger.error(`data not found on m_server_info. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                        // if not found, reject
                        reject(`data not found on m_server_info. please setting m_server_info. sql = ${sql}, key = ${server_id}`);
                    } else {
                        // return correct data
                        logger.info(`selected m_server_info successed. : server_id = ${server_id}`);
                        logger.trace(row);
                        resolve(ServerInfo.parse_from_db(row));
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * insert data
     * @param server_info_data 
     * @returns
     */
    insert_m_server_info(server_info_data: ServerInfo): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = ServerInfoRepository.SQL_INSERT_M_SERVER_INFO;
                logger.info(`sql = ${sql}, server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role,
                    $follow_time: server_info_data.follow_time,
                }, (err: any) => {
                    if (err) {
                        logger.error(`insert m_server_info failed. err = ${err}`);
                        reject(err);
                    } else {
                        logger.info(`insert m_server_info successed. : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                        // affected row numbers
                        let changes: number = 0;
                        // get affected row numbers from db object
                        if (stmt.changes != undefined) {
                            changes = stmt.changes as number;
                        }
                        // resolve ended this sql
                        resolve(changes);
                    }
                });
                stmt.finalize();
            });

            db.close();
        });
    }

    /**
     * update data
     * @param server_info_data 
     * @returns
     */
    update_m_server_info(server_info_data: ServerInfo): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO} WHERE [server_id] = $server_id`;
                logger.info(`sql = ${sql}, server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_info_data.server_id,
                    $channel_id: server_info_data.channel_id,
                    $recruitment_target_role: server_info_data.recruitment_target_role,
                    $follow_time: server_info_data.follow_time,
                }, (err: any) => {
                    if (err) {
                        logger.error(`update m_server_info failed. err = ${err}`);
                        reject(err);
                    } else {
                        logger.info(`update m_server_info successed. : server_id = ${server_info_data.server_id}, channel_id = ${server_info_data.channel_id}, recruitment_target_role = ${server_info_data.recruitment_target_role}, follow_time = ${server_info_data.follow_time}`);
                        // affected row numbers
                        let changes: number = 0;
                        // get affected row numbers from db object
                        if (stmt.changes != undefined) {
                            changes = stmt.changes as number;
                        }
                        // resolve ended this sql
                        resolve(changes);
                    }
                });
                stmt.finalize();
            });

            db.close();
        });
    }

    /**
     * update m_server follow time data
     * @param server_id 
     * @param follow_time
     * @returns
     */
    update_m_server_info_follow_time(server_id: string, follow_time: Date): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_UPDATE_M_SERVER_INFO_FOLLOW_TIME} WHERE server_id = $server_id`;
                logger.info(`sql = ${sql}, server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_id,
                    $follow_time: follow_time.toISOString(),
                }, (err: any) => {
                    if (err) {
                        logger.error(`update m_server_info failed. err = ${err}`);
                        reject(err);
                    }

                    logger.info(`update m_server_info successed. : server_id = ${server_id}, follow_time = ${follow_time.toISOString()}`);
                    // affected row numbers
                    let changes: number = 0;
                    // get affected row numbers from db object
                    if (stmt.changes != undefined) {
                        changes = stmt.changes as number;
                    }
                    // resolve ended this sql
                    resolve(changes);
                });
                stmt.finalize();
            });

            db.close();
        });
    }

    /**
     * delete data by server id
     * @param server_id 
     * @returns 
     */
    delete_m_server_info(server_id: string): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${ServerInfoRepository.SQL_DELETE_M_SERVER_INFO} WHERE [server_id] = $server_id`;
                logger.info(`sql = ${sql}, server_id = ${server_id}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_id,
                }, (err: any) => {
                    if (err) {
                        logger.error(`delete m_server_info failed. err = ${err}`);
                        reject(err);
                    }

                    logger.info(`delete m_server_info successed. : server_id = ${server_id}`);
                    // affected row numbers
                    let changes: number = 0;
                    // get affected row numbers from db object
                    if (stmt.changes != undefined) {
                        changes = stmt.changes as number;
                    }
                    // resolve ended this sql
                    resolve(changes);
                });
                stmt.finalize();
            });

            db.close();
        });
    }
}