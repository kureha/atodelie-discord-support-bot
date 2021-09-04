// define logger
import { logger } from '../common/logger';

// import constants
import { Constants } from '../common/constants';
const constants = new Constants();

export class ServerInfo {
    server_id: string;
    channel_id: string;
    recruitment_target_role: string;
    follow_time: Date;

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = Constants.get_default_date();
    }

    /**
     * データベースの行情報をオブジェクトに変換する
     * @param row ServerInfoテーブルのデータ列
     * @returns {ServerInfo} オブジェクト
     */
    static parse_from_db(row: any) {
        let v = new ServerInfo();

        try {
            v.server_id = row.server_id;
            v.channel_id = row.channel_id;
            v.recruitment_target_role = row.recruitment_target_role;
            // follow_time is nullable
            try {
                v.follow_time = new Date(row.follow_time);
            } catch (e) {
                v.follow_time = Constants.get_default_date();
            }
        } catch (e) {
            v = new ServerInfo();
        }

        return v;
    }
}