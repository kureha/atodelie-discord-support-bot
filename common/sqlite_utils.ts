export class SqliteUtils {
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
        if (extend !== undefined) {
            arr.push('\'' + extend + '\'');
        }
        
        // join and retrun
        return `datetime(${arr.join(', ')})`;
    }
}