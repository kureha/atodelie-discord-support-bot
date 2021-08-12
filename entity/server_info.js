const logger = require('../common/logger');

// 定数定義を読み込む
const Constants = require('../common/constants');
const constants = new Constants();

module.exports = class ServerInfo {
    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.server_id = '';
        this.channel_id = '';
        this.recruitment_target_role = '';
        this.follow_time = Constants.get_default_date();
    }
}