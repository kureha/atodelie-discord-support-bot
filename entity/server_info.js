"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfo = void 0;
// import constants
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
     * データベースの行情報をオブジェクトに変換する
     * @param row ServerInfoテーブルのデータ列
     * @returns {ServerInfo} オブジェクト
     */
    static parse_from_db(row) {
        let v = new ServerInfo();
        try {
            v.server_id = row.server_id;
            v.channel_id = row.channel_id;
            v.recruitment_target_role = row.recruitment_target_role;
            // follow_time is nullable
            try {
                v.follow_time = new Date(row.follow_time);
            }
            catch (e) {
                v.follow_time = constants_1.Constants.get_default_date();
            }
        }
        catch (e) {
            v = new ServerInfo();
        }
        return v;
    }
}
exports.ServerInfo = ServerInfo;
//# sourceMappingURL=server_info.js.map