"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participate = void 0;
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class Participate {
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
    static parse_from_db(row) {
        const v = new Participate();
        v.id = row.id;
        v.token = row.token;
        v.status = row.status;
        v.user_id = row.user_id;
        v.description = row.description;
        v.delete = row.delete;
        return v;
    }
}
exports.Participate = Participate;
//# sourceMappingURL=participate.js.map