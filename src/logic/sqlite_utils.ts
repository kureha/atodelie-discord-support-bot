export class SqliteUtils {
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