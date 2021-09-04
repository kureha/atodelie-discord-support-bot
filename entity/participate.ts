// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

export class Participate {
    id: number;
    token: string;
    status: number;
    user_id: string;
    description: string;
    delete: boolean;

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.user_id = '';
        this.description = '';
        this.delete = false;
    }

    /**
     * データベースの行情報をオブジェクトに変換する
     * @param row Participateテーブルのデータ列
     * @returns {Participate} オブジェクト
     */
    static parse_from_db(row: any) {
        let v = new Participate();

        try {
            v.id = row.id;
            v.token = row.token;
            v.status = row.status;
            v.user_id = row.user_id;
            v.description = row.description;
            v.delete = row.delete;
        } catch (e) {
            // if error, re-create new instance
            v = new Participate();
        }

        return v;
    }
}