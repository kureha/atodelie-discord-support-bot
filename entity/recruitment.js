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
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.delete = false;
        // insert participate array
        this.user_list = [];
    }
}
exports.Recruitment = Recruitment;
//# sourceMappingURL=recruitment.js.map