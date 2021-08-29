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
}
exports.Participate = Participate;
//# sourceMappingURL=participate.js.map