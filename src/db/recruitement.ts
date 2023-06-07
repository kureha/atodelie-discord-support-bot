// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { Recruitment } from '../entity/recruitment';

// import uuid modules
import * as uuid from 'uuid';

// import utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class RecruitmentRepository {

    /**
     * create SQL
     */
    static SQL_CREATE_M_RECRUITMENT = 'CREATE TABLE IF NOT EXISTS [m_recruitment] ( [id] INTEGER NOT NULL UNIQUE, [server_id] TEXT NOT NULL, [message_id] TEXT, [thread_id] TEXT, [token] TEXT NOT NULL UNIQUE, [status] INTEGER NOT NULL, [limit_time] DATETIME NOT NULL, [name] TEXT NOT NULL, [owner_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id]) )';

    /**
     * select SQL
     */
    static SQL_SELECT_M_RECRUITMENT = 'SELECT m1.[id], m1.[server_id], m1.[message_id], m1.[thread_id], m1.[token], m1.[status], m1.[limit_time], m1.[name], m1.[owner_id], m1.[description], m1.[regist_time], m1.[update_time], m1.[delete] FROM [m_recruitment] m1 ';

    /**
     * insert SQL
     */
    static SQL_INSERT_M_RECRUITMENT = 'INSERT INTO [m_recruitment] ([id], [server_id], [message_id], [thread_id], [token], [status], [limit_time], [name], [owner_id], [description], [regist_time], [update_time], [delete]) values ($id, $server_id, $message_id, $thread_id, $token, $status, $limit_time, $name, $owner_id, $description, ' + SqliteUtils.get_now() + ', ' + SqliteUtils.get_now() + ', $delete) ';

    /**
     * update SQL
     */
    static SQL_UPDATE_M_RECRUITMENT = 'UPDATE [m_recruitment] SET [server_id] = $server_id, [message_id] = $message_id, [thread_id] = $thread_id, [status] = $status, [limit_time] = $limit_time, [name] = $name, [owner_id] = $owner_id, [description] = $description, [update_time] = ' + SqliteUtils.get_now() + ', [delete] = $delete ';

    /**
     * delete SQL
     */
    static SQL_DELETE_M_RECRUITMENT = 'DELETE FROM [m_recruitment] ';

    /**
     * get next id SQL
     */
    static SQL_SELECT_M_RECRUITMENT_MAX_ID = 'SELECT IFNULL(MAX(id) + 1, 1) AS id FROM [m_recruitment] ';

    /**
     * check token is exists SQL
     */
    static SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT = 'SELECT COUNT(*) AS [count] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ' + SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL) + ' ';

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
    get_db_instance(file_path: string) {
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
                db.run(RecruitmentRepository.SQL_CREATE_M_RECRUITMENT, [], ((err: any) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
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
     * get UUID format token
     * @returns UUID
     */
    static create_uuid_token(): string {
        return uuid.v4();
    }

    /**
     * insert data
     * @param data 
     * @returns
     */
    insert_m_recruitment(data: Recruitment): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_INSERT_M_RECRUITMENT}`;
                logger.info(`sql = ${sql}, id = ${data.id}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $id: data.id,
                    $server_id: data.server_id,
                    $message_id: data.message_id,
                    $thread_id: data.thread_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time.toISOString(),
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                    $delete: data.delete,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
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
     * update data
     * @param data 
     * @returns 
     */
    update_m_recruitment(data: Recruitment): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_UPDATE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $message_id: data.message_id,
                    $thread_id: data.thread_id,
                    $token: data.token,
                    $status: data.status,
                    $limit_time: data.limit_time.toISOString(),
                    $name: data.name,
                    $owner_id: data.owner_id,
                    $description: data.description,
                    $delete: data.delete
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
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
     * delete data
     * @param token 
     * @returns 
     */
    delete_m_recruitment(token: string): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${RecruitmentRepository.SQL_DELETE_M_RECRUITMENT} WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger.info(`sql = ${sql}, token = ${token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: token,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
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
     * get max id for m_recruitment
     * @returns max id number
     */
    get_m_recruitment_id(): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_MAX_ID}`;
                logger.info(`sql = ${sql}`);
                db.get(sql, [], ((err: any, row: any) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    logger.info(`selected max m_reqruitement id successed. : result = ${row.id}`);
                    resolve(row.id);
                }));
            });

            db.close();
        });
    }

    /**
     * get data list for follow 
     * @param server_id 
     * @param user_id 
     * @returns follow up data list
     */
    get_m_recruitment_for_user(server_id: string, user_id: string): Promise<Recruitment[]> {
        // return promise
        return new Promise<Recruitment[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[server_id] = $server_id AND m1.[owner_id] = $owner_id AND m1.[delete] = false and datetime([limit_time], \'localtime\') >= ` + SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL) + ` ORDER BY m1.[regist_time], m1.[id]`;
                logger.info(`sql = ${sql}, server_id = ${server_id}, owner_id = ${user_id}`);
                db.all(sql, {
                    $server_id: server_id,
                    $owner_id: user_id
                }, ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }
                    if (rows == undefined) {
                        logger.error(`no rows selected.`);
                        resolve([]);
                    } else {
                        // return valie list
                        const recruitment_list: Recruitment[] = [];
                        rows.forEach(v => {
                            recruitment_list.push(Recruitment.parse_from_db(v));
                        });

                        logger.info(`selected m_reqruitement followup list successed.`);
                        logger.trace(rows);
                        resolve(recruitment_list);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * get data list for follow 
     * @param server_id 
     * @param from_datetime 
     * @param to_datetime 
     * @returns follow up data list
     */
    get_m_recruitment_for_follow(server_id: string, from_datetime: Date, to_datetime: Date): Promise<Recruitment[]> {
        // return promise
        return new Promise<Recruitment[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[server_id] = $server_id AND datetime(m1.[limit_time], 'utc') > datetime($from_datetime) AND datetime(m1.[limit_time], 'utc') <= datetime($to_datetime) AND m1.[delete] = false ORDER BY m1.[limit_time], m1.[id]`;
                logger.info(`sql = ${sql}, server_id = ${server_id}, from_time = ${from_datetime.toLocaleString()}, to_datetime = ${to_datetime.toLocaleString()}`);
                db.all(sql, {
                    $server_id: server_id,
                    $from_datetime: from_datetime.toISOString(),
                    $to_datetime: to_datetime.toISOString(),
                }, ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${RecruitmentRepository.SQL_CREATE_M_RECRUITMENT}`);
                        reject(err);
                    }

                    // return valie list
                    const recruitment_list: Recruitment[] = [];
                    rows.forEach(v => {
                        recruitment_list.push(Recruitment.parse_from_db(v));
                    });

                    logger.info(`selected m_reqruitement followup list successed.`);
                    logger.trace(rows);
                    resolve(recruitment_list);
                }));
            });

            db.close();
        });
    }

    /**
     * get token for m_recruitment
     * if token is already exists, this function will by reject, please retry
     * @param token
     * @returns token string
     */
    get_m_recruitment_token(token?: string): Promise<string> {
        // return promise
        return new Promise<string>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                let target_token: string = '';
                if (token == undefined) {
                    // if undefined, create uuid token
                    target_token = RecruitmentRepository.create_uuid_token();
                } else {
                    // copy inputed token
                    target_token = token;
                }
                logger.debug(`token : ${target_token}`);

                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT} `;
                logger.info(`sql = ${sql}`);
                db.get(sql, {
                    $token: target_token
                }, ((err: any, row: any) => {
                    if (err) {
                        logger.error(`sql exception occured when select token count. sql = ${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT_TOKEN_COUNT}`);
                        reject(err);
                    }

                    if (row.count === 0) {
                        logger.info(`generate unique token id successed. : result = ${target_token}`);
                        resolve(target_token);
                    } else {
                        logger.info(`generated token is not unique, rejected.`);
                        reject(`generated token is not unique, rejected.`);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * select single data
     * @param token 
     * @returns recruitment data
     */
    get_m_recruitment(token: string): Promise<Recruitment> {
        // return promise
        return new Promise<Recruitment>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[token] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger.info(`sql = ${sql}, token = ${token}`);
                db.get(sql, [token], ((err: any, row: any) => {
                    if (err) {
                        logger.error(`select m_recruitment failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    else if (row === undefined) {
                        logger.error(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, key = ${token}`);
                    }

                    logger.info(`selected single m_reqruitement successed. : key = ${token}`);
                    logger.trace(row);
                    resolve(Recruitment.parse_from_db(row));
                }));
            });

            db.close();
        });
    }

    /**
     * select data by message id and owner id
     * @param message_id message id
     * @param owner_id owner id
     * @returns recruitment data
     */
    get_m_recruitment_by_message_id(message_id: string, owner_id: string): Promise<Recruitment> {
        // return promise
        return new Promise<Recruitment>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE m1.[message_id] = ? and m1.[owner_id] = ? and m1.[delete] = false and datetime(m1.[limit_time] , \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} `;
                logger.info(`sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                db.get(sql, [message_id, owner_id], ((err: any, row: any) => {
                    if (err) {
                        logger.error(`select m_recruitment failed. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                        reject(err);
                    }
                    else if (row === undefined || row.length === 0) {
                        logger.error(`data not found on m_recruitment. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                        reject(`data not found on m_recruitment. sql = ${sql}, message_id = ${message_id}, owner_id = ${owner_id}`);
                    }

                    logger.info(`selected single m_reqruitement successed. : message_id = ${message_id}, owner_id = ${owner_id}`);
                    logger.trace(row);
                    resolve(Recruitment.parse_from_db(row));
                }));
            });

            db.close();
        });
    }

    /**
     * select data list for server
     * @param server_id server id
     * @returns recruitment data
     */
    get_m_recruitment_latests(server_id: string, count: number): Promise<Recruitment[]> {
        // return promise
        return new Promise<Recruitment[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${RecruitmentRepository.SQL_SELECT_M_RECRUITMENT} WHERE [server_id] = ? AND datetime(m1.[limit_time], 'localtime') > ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} AND m1.[delete] = false ORDER BY m1.[limit_time] desc, m1.[id] asc LIMIT ${count}`;
                logger.info(`sql = ${sql}, token = ${server_id}`);
                db.all(sql, [server_id], ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`select m_recruitment failed. sql = ${sql}, key = ${server_id}`);
                        reject(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.info(`data not found on m_recruitment. sql = ${sql}, key = ${server_id}`);
                        resolve([]);
                    } else {
                        // return valie list
                        const recruitment_list: Recruitment[] = [];
                        rows.forEach(v => {
                            recruitment_list.push(Recruitment.parse_from_db(v));
                        });

                        logger.info(`selected latests m_reqruitement successed. : key = ${server_id}`);
                        logger.trace(rows);
                        resolve(recruitment_list);
                    }
                }));
            });

            db.close();
        });
    }
}