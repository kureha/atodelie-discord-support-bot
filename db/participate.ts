// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import utils
import { SqliteUtils } from '../common/sqlite_utils';

// import entities
import { Participate } from '../entity/participate';

export class ParticipateRepository {

    /**
     * create SQL
     */
    static SQL_CREATE_T_PARTICIPATE = 'CREATE TABLE IF NOT EXISTS [t_participate] ( [id] INTEGER NOT NULL, [status] INTEGER NOT NULL, [user_id] TEXT NOT NULL, [description] TEXT, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL, PRIMARY KEY([id],[user_id]) )';

    /**
     * select SQL
     */
    static SQL_SELECT_T_PARTICIPATE = 'SELECT t1.[id], t1.[status], t1.[user_id], t1.[description], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_participate] t1 ';

    /**
     * insert SQL
     */
    static SQL_INSERT_T_PARTICIPATE = 'INSERT INTO [t_participate] ([id], [status], [user_id], [description], [regist_time], [update_time], [delete]) SELECT [id], $status, $user_id, $description, ' + SqliteUtils.get_now() + ', ' + SqliteUtils.get_now() + ', false FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ' + SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL) + ' ';

    /**
     * update SQL
     */
    static SQL_UPDATE_T_PARTICIPATE = 'UPDATE [t_participate] SET [status] = $status, [description] = $description, [update_time] = ' + SqliteUtils.get_now() + ', [delete] = $delete ';

    /**
     * delete SQL
     */
    static SQL_DELETE_T_PARTICIPATE = 'DELETE FROM [t_participate] ';

    /**
     * constructor
     */
    constructor() {
        const db = this.get_db_instance(constants.SQLITE_FILE);
        logger.info(`database open successed. db = ${db}`);
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
    create_all_database(db: any) {
        return new Promise<void>((resolve, reject) => {
            db.serialize(function () {
                // run serialize
                db.run(ParticipateRepository.SQL_CREATE_T_PARTICIPATE, [], ((err: any) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${ParticipateRepository.SQL_CREATE_T_PARTICIPATE}`);
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
     * insert data
     * @param data 
     * @returns 
     */
    insert_t_participate(data: Participate): Promise<any> {
        // return promise
        return new Promise<void>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_INSERT_T_PARTICIPATE}`;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $status: data.status,
                    $user_id: data.user_id,
                    $description: data.description,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    // resolve ended this sql
                    resolve();
                });
                stmt.finalize();
            });
            db.close();
        });
    }

    /**
     * update data
     * @param data key is [data.token] and [data.user_id]
     * @returns 
     */
    update_t_participate(data: Participate): Promise<any> {
        // return promise
        return new Promise<void>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_UPDATE_T_PARTICIPATE} where [id] = (select [id] from [m_recruitment] where [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)}) AND [user_id] = $user_id `;
                logger.info(`sql = ${sql}, token = ${data.token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: data.token,
                    $user_id: data.user_id,
                    $status: data.status,
                    $description: data.description,
                    $delete: data.delete,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    // resolve ended this sql
                    resolve();
                });
                stmt.finalize();
            });
            db.close();
        });
    }


    /**
     * delete data by token
     * @param token 
     * @returns 
     */
    delete_t_participate(token: string): Promise<any> {
        // return promise
        return new Promise<void>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);
            db.serialize(function () {
                // get prepared statement
                const sql = `${ParticipateRepository.SQL_DELETE_T_PARTICIPATE} WHERE [id] = (SELECT [id] FROM [m_recruitment] WHERE [token] = $token and [delete] = false and datetime([limit_time], \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)}) `;
                logger.info(`sql = ${sql}, token = ${token}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $token: token,
                }, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    }
                    // resolve ended this sql
                    resolve();
                });
                stmt.finalize();
            });
            db.close();
        });
    }

    /**
     * select data list by token
     * @param token 
     * @returns participate data list
     */
    get_t_participate(token: string): Promise<Participate[]> {
        // return promise
        return new Promise<Participate[]>((resolve, reject) => {
            const db = this.get_db_instance(constants.SQLITE_FILE);

            db.serialize(function () {
                // run serialize
                const sql = `${ParticipateRepository.SQL_SELECT_T_PARTICIPATE} inner join [m_recruitment] m1 on t1.[id] = m1.[id] where m1.[token] = $token and m1.[delete] = false and t1.[delete] = false and datetime(m1.[limit_time], \'localtime\') >= ${SqliteUtils.get_now_with_extend(constants.DISCORD_RECRUITMENT_EXPIRE_DELAY_MINUTE_SQL)} order by t1.[update_time] `;
                logger.info(`sql = ${sql}, token = ${token}`);

                db.all(sql, [token], ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`select t_participate failed. sql = ${sql}, key = ${token}`);
                        reject(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.info(`data not found on t_participate. sql = ${sql}, key = ${token}`);
                        resolve([]);
                    } else {
                        // return value list
                        const participate_list: Participate[] = [];
                        rows.forEach(v => {
                            participate_list.push(Participate.parse_from_db(v));
                        });

                        logger.info(`selected t_participate successed. : key = ${token}`);
                        logger.trace(rows);
                        resolve(participate_list);
                    }
                }));
            });

            db.close();
        });
    }
}