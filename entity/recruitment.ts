// ロガーを定義
import {logger} from '../common/logger';

// 定数定義を読み込む
import {Constants} from '../common/constants';
const constants = new Constants();

// 参加情報を定義
import {Participate} from './participate';

export class Recruitment {
    id : number;
    server_id : string;
    token : string;
    status : number;
    limit_time : Date;
    name : string;
    owner_id : string;
    description : string;
    delete : boolean;

    user_list : Participate[];

    /**
     * コンストラクタ
     * @constructor
     */
    constructor() {
        this.id = constants.ID_INVALID;
        this.server_id = '';
        this.token = '';
        this.status = constants.STATUS_DISABLED;
        this.limit_time = Constants.get_default_date();
        this.name = '';
        this.owner_id = '';
        this.description = '';
        this.delete = false;

        // insert participate array
        this.user_list = [];
    }
}