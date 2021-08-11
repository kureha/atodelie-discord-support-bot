const logger = require('../common/logger');

// 定数定義を読み込む
const Constants = require('../common/constants');
const constants = new Constants();

module.exports = class Recruitment {
    constructor() {
        this.id = -1;
        this.server_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = new Date('2000-01-01T00:00:00.000Z');
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.delete = false;

        // insert participate array
        this.user_list = [];
    }
}