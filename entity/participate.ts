// ロガーを定義
import {logger} from '../common/logger';

// 定数定義を読み込む
import {Constants} from '../common/constants';
const constants = new Constants();

export class Participate {
    id : number;
    token : string;
    status : number;
    user_id : string;
    description : string;
    delete : boolean;

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