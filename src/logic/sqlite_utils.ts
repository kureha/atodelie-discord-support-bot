import { Constants } from "../common/constants";

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

    /**
     * get date value from object. if undefined, return default value.
     * @param v 
     * @returns 
     */
    static get_date_value(v: any): Date {
        let result: Date = new Date(v);
        if (Number.isNaN(result.getTime())) {
            return Constants.get_default_date();
        } else {
            return result;
        }
    }
}