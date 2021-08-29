"use strict";
exports.__esModule = true;
// 定数定義を読み込む
var constants_1 = require("../common/constants");
var constants = new constants_1.Constants();
module.exports = /** @class */ (function () {
    /**
     * コンストラクタ
     * @constructor
     */
    function ServerInfo() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = constants_1.Constants.get_default_date();
    }
    return ServerInfo;
}());
