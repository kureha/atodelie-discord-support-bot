// ロガーを定義
import {logger} from '../common/logger';

// 定数定義を読み込む
import {Constants} from '../common/constants';
const constants = new Constants();

export class ServerInfo {
    server_id : string;
    channel_id : string;
    recruitment_target_role : string;
    follow_time : Date;

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