"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recruitment = void 0;
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class Recruitment {
    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date().toISOString();
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
    set_limit_time(v) {
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
    static parse_from_db(row) {
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
exports.Recruitment = Recruitment;
//# sourceMappingURL=recruitment.js.map