"use strict";
exports.__esModule = true;
exports.Participate = void 0;
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
var Participate = /** @class */ (function () {
    /**
     * コンストラクタ
     * @constructor
     */
    function Participate() {
        this.id = constants.ID_INVALID;
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.user_id = '';
        this.description = '';
        this["delete"] = false;
    }
    return Participate;
}());
exports.Participate = Participate;
