"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfo = void 0;
// 定数定義を読み込む
const constants_1 = require("../common/constants");
const constants = new constants_1.Constants();
class ServerInfo {
    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = constants_1.Constants.get_default_date();
    }
    /**
     * フォロー済み日時を設定する
     * @param {Date} v 対象日時
     */
    set_follow_time(v) {
        this.follow_time = v;
    }
    /**
     * フォロー済み日時を取得する
     * @returns {Date} フォロー済み日時
     */
    get_follow_time() {
        return new Date(this.follow_time);
    }
    /**
     * データベースの行情報をオブジェクトに変換する
     * @param row ServerInfoテーブルのデータ列
     * @returns {ServerInfo} オブジェクト
     */
    static parse_from_db(row) {
        const v = new ServerInfo();
        v.server_id = row.server_id;
        v.channel_id = row.channel_id;
        v.recruitment_target_role = row.recruitment_target_role;
        // follow_timeはnullableとなる
        try {
            v.set_follow_time(new Date(row.follow_time));
        }
        catch (e) {
            v.set_follow_time(constants_1.Constants.get_default_date());
        }
        return v;
    }
}
exports.ServerInfo = ServerInfo;
//# sourceMappingURL=server_info.js.map