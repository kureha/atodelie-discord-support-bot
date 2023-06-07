// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

// import entities
import { FriendCode } from '../entity/friend_code';

// import utils
import { SqliteUtils } from '../logic/sqlite_utils';

export class FriendCodeHistoryRepository {

    /**
     * create data table SQL
     */
    static SQL_CREATE_T_FRIEND_CODE = 'CREATE TABLE IF NOT EXISTS [t_friend_code_history] ( [server_id] TEXT NOT NULL, [user_id] TEXT NOT NULL, [user_name] TEXT NOT NULL, [game_id] TEXT NOT NULL, [game_name] TEXT NOT NULL, [friend_code] TEXT NOT NULL, [regist_time] DATETIME NOT NULL, [update_time] DATETIME NOT NULL, [delete] BOOLEAN NOT NULL )';

    /**
     * insert SQL
     */
    static SQL_INSERT_T_FRIEND_CODE = 'INSERT INTO [t_friend_code_history] ([server_id], [user_id], [user_name], [game_id], [game_name], [friend_code], [regist_time], [update_time], [delete]) values ($server_id, $user_id, $user_name, $game_id, $game_name, $friend_code, $regist_time, $update_time, $delete) ';

    /**
     * update SQL
     */
    static SQL_UPDATE_T_FRIEND_CODE = 'UPDATE [t_friend_code_history] SET [server_id] = $server_id, [user_id] = $user_id, [user_name] = $user_name, [game_id] = $game_id, [game_name] = $game_name, [friend_code] = $friend_code, [regist_time] = $regist_time, [update_time] = $update_time, [delete] = $delete ';

    /**
     * select SQL
     */
    static SQL_SELECT_T_FRIEND_CODE = 'SELECT t1.[server_id], t1.[user_id], t1.[user_name], t1.[game_id], t1.[game_name], t1.[friend_code], t1.[regist_time], t1.[update_time], t1.[delete] FROM [t_friend_code_history] t1 ';

    /**
     * delete SQL
     */
    static SQL_DELETE_T_FRIEND_CODE = 'DELETE FROM [t_friend_code_history] ';

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
            // get execute sql lists
            const execute_sql_list: string[] = [FriendCodeHistoryRepository.SQL_CREATE_T_FRIEND_CODE];

            execute_sql_list.forEach((sql, idx) => {
                const stmt = db.prepare(sql);
                stmt.run({}, (err: any) => {
                    if (err) {
                        logger.error(`sql exception occured when create table. sql = ${sql}`);
                        logger.error(err);
                        reject(err);
                    }
                    // if list is ended, resolve
                    if (idx + 1 == execute_sql_list.length) {
                        resolve();
                    }
                });
                stmt.finalize();
            });
            db.close();
        });
    }

    /**
     * insert data
     * @param data 
     * @returns 
     */
    insert_t_friend_code(data: FriendCode): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeHistoryRepository.SQL_INSERT_T_FRIEND_CODE}`;
                logger.info(`sql = ${sql}, server_id = ${data.server_id}, user_name = ${data.user_name}, game_name = ${data.game_name}, friend_code = ${data.friend_code}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $user_id: data.user_id,
                    $user_name: data.user_name,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $friend_code: data.friend_code,
                    $regist_time: data.regist_time,
                    $update_time: data.update_time,
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
     * @param data key is [data.user_id] and [data.game_id]
     * @returns 
     */
    update_t_friend_code(data: FriendCode): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeHistoryRepository.SQL_UPDATE_T_FRIEND_CODE} WHERE [server_id] = $server_id AND [user_id] = $user_id AND [game_id] = $game_id`;
                logger.info(`sql = ${sql}, server_id = ${data.server_id}, user_id = ${data.user_id}, game_id = ${data.game_id}, friend_code = ${data.friend_code}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: data.server_id,
                    $user_id: data.user_id,
                    $user_name: data.user_name,
                    $game_id: data.game_id,
                    $game_name: data.game_name,
                    $friend_code: data.friend_code,
                    $regist_time: data.regist_time,
                    $update_time: data.update_time,
                    $delete: data.delete,
                }, (err: any) => {
                    if (err) {
                        logger.error(`update t_friend_code error. detail = ${err}`);
                        reject(`update t_friend_code error. detail = ${err}`);
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
     * delete data by user_id and game_id
     * @param server_id
     * @param user_id
     * @param game_id 
     * @returns 
     */
    delete_t_friend_code(server_id: string, user_id: string, game_id: string): Promise<number> {
        // return promise
        return new Promise<number>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);
            db.serialize(function () {
                // get prepared statement
                const sql = `${FriendCodeHistoryRepository.SQL_DELETE_T_FRIEND_CODE} WHERE [server_id] = $server_id AND [user_id] = $user_id AND [game_id] = $game_id `;
                logger.info(`sql = ${sql}, user_id = ${user_id}, game_id = ${game_id}`);
                const stmt = db.prepare(sql);
                stmt.run({
                    $server_id: server_id,
                    $user_id: user_id,
                    $game_id: game_id,
                }, (err: any) => {
                    if (err) {
                        logger.error(`delete t_friend_code error. detail = ${err}`);
                        reject(`delete t_friend_code error. detail = ${err}`);
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
     * get data by game friend_code info
     * @param server_id
     * @returns data
     */
    get_t_friend_code_all(server_id: string): Promise<FriendCode[]> {
        // return promise
        return new Promise<FriendCode[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeHistoryRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[delete] = false ORDER BY t1.[user_id], t1.[game_id]`;
                logger.info(`sql = ${sql}`);
                db.all(sql, [server_id], ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    } else {
                        // return value list
                        const game_friend_code_list: FriendCode[] = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(FriendCode.parse_from_db(v));
                        });

                        // return correct data
                        logger.info(`selected t_friend_code successed.`);
                        logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @param user_id
     * @returns data
     */
    get_t_friend_code(server_id: string, user_id: string): Promise<FriendCode[]> {
        // return promise
        return new Promise<FriendCode[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeHistoryRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[user_id] = $user_id AND t1.[delete] = false ORDER BY t1.[user_name], t1.[game_id]`;
                logger.info(`sql = ${sql}`);
                db.all(sql, [server_id, user_id], ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    } else {
                        // return value list
                        const game_friend_code_list: FriendCode[] = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(FriendCode.parse_from_db(v));
                        });

                        // return correct data
                        logger.info(`selected t_friend_code successed.`);
                        logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });

            db.close();
        });
    }

    /**
     * get data by game friend_code info
     * @param server_id
     * @param game_id
     * @returns data
     */
    get_t_friend_code_from_game_id(server_id: string, game_id: string): Promise<FriendCode[]> {
        // return promise
        return new Promise<FriendCode[]>((resolve, reject) => {
            const db = this.get_db_instance(this.sqlite_file_path);

            db.serialize(function () {
                // run serialize
                const sql = `${FriendCodeHistoryRepository.SQL_SELECT_T_FRIEND_CODE} WHERE t1.[server_id] = $server_id AND t1.[game_id] = $game_id AND t1.[delete] = false ORDER BY t1.[user_id], t1.[game_id]`;
                logger.info(`sql = ${sql}`);
                db.all(sql, [server_id, game_id], ((err: any, rows: any[]) => {
                    if (err) {
                        logger.error(`select t_friend_code failed. sql = ${sql}`);
                        // return blank data
                        resolve(err);
                    }
                    else if (rows === undefined || rows === null || rows.length === 0) {
                        logger.info(`data not found on t_friend_code. sql = ${sql}`);
                        // return blank data
                        resolve([]);
                    } else {
                        // return value list
                        const game_friend_code_list: FriendCode[] = [];
                        rows.forEach((v) => {
                            game_friend_code_list.push(FriendCode.parse_from_db(v));
                        });

                        // return correct data
                        logger.info(`selected t_friend_code successed.`);
                        logger.trace(rows);
                        resolve(game_friend_code_list);
                    }
                }));
            });

            db.close();
        });
    }
}