"use strict";
exports.__esModule = true;
exports.Recruitment = void 0;
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
var Recruitment = /** @class */ (function () {
    /**
     * コンストラクタ
     * @constructor
     */
    function Recruitment() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = constants_1.Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this["delete"] = false;
        // insert participate array
        this.user_list = [];
    }
    return Recruitment;
}());
exports.Recruitment = Recruitment;
