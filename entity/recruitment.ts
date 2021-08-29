// ロガーを定義
import {logger} from '../common/logger';

// 定数定義を読み込む
import {Constants} from '../common/constants';
const constants = new Constants();

// 参加情報を定義
import {Participate} from './participate';

export class Recruitment {
    id : number;
    server_id : string;
    token : string;
    status : number;
    name : string;
    owner_id : string;
    description : string;
    delete : boolean;

    /**
     * 注意：本変数は日時をISO形式で保持するため、外部からはアクセサを使用する
     */
    private limit_time : string;

    user_list : Participate[];

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = Constants.get_default_date().toISOString();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.delete = false;

        // insert participate array
        this.user_list = [];
    }

    /**
     * 募集の期限日時を設定する
     * @param {Date} v 対象日時
     */
    set_limit_time(v : Date) {
        this.limit_time = v.toISOString();
    }

    /**
     * 募集の期限日時を取得する
     * @returns {Date} 期限日時
     */
    get_limit_time() {
        return new Date(this.limit_time);
    }

    /**
     * データベースの行情報をオブジェクトに変換する
     * @param row Recruitmentテーブルのデータ列
     * @returns {Recruitment} オブジェクト
     */
    static parse_from_db(row : any) {
        const v = new Recruitment();
        v.id = row.id;
        v.server_id = row.server_id;
        v.token = row.token;
        v.status = row.status;
        v.set_limit_time(new Date(row.limit_time));
        v.name = row.name;
        v.owner_id = row.owner_id;
        v.description = row.description;
        v.delete = row.delete;

        return v;
    }
}