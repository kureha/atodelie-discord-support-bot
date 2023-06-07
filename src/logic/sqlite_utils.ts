
// import file module
import * as fs from 'fs';

export class SqliteUtils {
    /**
     * check open database for file / memory.
     * @param file_path 
     */
    static check_open_database(file_path: string): boolean {
        if (file_path == ':memory:') {
            // if sqlite3 db is memory, return true
            return true;
        } else if (fs.existsSync(file_path) === true) {
            // check file path exists, return true
            return true;
        } else {
            // error for open database
            return false;
        }
    }

    /**
     * Get string for sqlite now datetime
     */
    static get_now(): string {
        return this.get_now_with_extend(undefined);
    }

    /**
     * Get string for sqlite now datetime with extend time
     * @param extend 
     */
    static get_now_with_extend(extend: string | undefined): string {
        const arr = ['\'now\'', '\'localtime\''];

        // if extend is enabled, add extend to array
        if (extend !== undefined && extend.trim().length > 0) {
            arr.push('\'' + extend + '\'');
        }

        // join and retrun
        return `datetime(${arr.join(', ')})`;
    }

    /**
     * get value from object. if undefined, throw new error.
     * @param v 
     */
    static get_value(v: any): any {
        if (v == undefined) {
            throw new Error(`value is undefined or null.`);
        } else {
            return v;
        }
    }
}