module.exports = class DiscordAnalyzer {

    static TYPE_INIT = 0;
    static TYPE_RECRUITEMENT = 1;
    static TYPE_JOIN = 2;
    static TYPE_DECLINE = 3;
    static TYPE_LIST = 4;

    static TIME_DEFAULT = "23:00";
    static MAX_NUMBERS_DEFAULT = 6;
    static ERROR_CHANNEL_ID = "ERR_CHR";

    /**
     * 
     * @param {string} mes 
     * @param {string} user_id
     */
    constructor(mes, channel_id, user_id) {
        if (typeof (mes) == "string") {
            if (typeof (user_id) == "string") {
                // user.idは消去する
                this.message = mes.replace('<@!' + user_id + '> ', "");
            } else {
                this.message = mes;
            }
        } else {
            return;
        }

        if (typeof (channel_id) == "string") {
            this.channel_id = channel_id;
        } else {
            this.channel_id = DiscordAnalyzer.ERROR_CHANNEL_ID;
        }

        // 募集の有効無効を示す
        this.isValid = true;
        this.id = 0;
        this.errorMessage = [];
        this.type = DiscordAnalyzer.TYPE_INIT;
        let tmpErrorMsg = [];

        if (DiscordAnalyzer.CheckRecruitment(this.message) == true) {
            this.type = DiscordAnalyzer.TYPE_RECRUITEMENT;
            this.title = DiscordAnalyzer.GetRecruitmentText(this.message);
            // 以下は可能なら切り出す…　時間指定と人数指定
            // TODO:書式文字列をYYYY-MM-DD HH24:MI:SSで返す
            this.time = DiscordAnalyzer.GetRecruitmentTime(this.message);
            if (this.time === undefined) {
                // TODO:書式文字列をYYYY-MM-DD HH24:MI:SSで返す
                this.time = DiscordAnalyzer.TIME_DEFAULT;
            }
            this.max_number = DiscordAnalyzer.GetRecruitmentNumbers(this.message);
            if (this.max_number === undefined) {
                this.max_number = DiscordAnalyzer.MAX_NUMBERS_DEFAULT;
                // この場合のみ最大人数を自動付与
                this.title = this.title + ` (最大人数 : ${this.max_number}人)`;
            }
        }
        else if (DiscordAnalyzer.CheckJoin(this.message) == true) {
            this.type = DiscordAnalyzer.TYPE_JOIN;
            this.id = DiscordAnalyzer.GetJoinId(this.message);
        }
        else if (DiscordAnalyzer.CheckDecline(this.message) == true) {
            this.type = DiscordAnalyzer.TYPE_DECLINE;
            this.id = DiscordAnalyzer.GetDeclineId(this.message);
        }
        else if (DiscordAnalyzer.CheckTypeList(this.message) == true) {
            this.type = DiscordAnalyzer.TYPE_LIST;
        }
        else {
            this.isValid = false;
            tmpErrorMsg.push("募集や参加以外で話しかけられても困る…");
        }

        // 有効な場合はインスタンスを返す
        if (this.isValid === true) {

        } else {
            this.errorMessage = tmpErrorMsg;
        }
    }

    /**
     * 指定メッセージを切り出して返却する
     * @param {string} mes 
     * @param {string} regexp 
     */
    static ExtractByRegexp(mes, regexp) {
        var result = undefined;

        if (typeof (mes) == "string") {
            // ok
        } else {
            return undefined;
        }

        // 正規表現の解析を使用
        const re = new RegExp(regexp, 'g');

        const re_result = re.exec(mes);

        // 結果が含まれる場合それを返す
        if (re_result !== null && re_result.length > 0) {
            result = re_result[0];
        }

        return result;
    }

    /**
     * 時刻を認識し、hh24:mi形式で返却します
     * @param {string} mes 
     * @returns 
     */
    static GetRecruitmentTime(mes) {
        // needed variables
        var hour = undefined;
        var minute = undefined;

        // check1
        var re_result = mes.match(/(\d{1,2})時/);
        if (re_result != undefined && re_result != null && re_result.length > 1) {
            hour = re_result[1];
            // 24時だけは特殊処理
            if (hour == 24) {
                hour = "0";
            }
            minute = "0";
        }

        // if failed check 1
        if (hour === undefined || minute === undefined) {
            // check2
            re_result = mes.match(/(\d{2})[:]{0,1}(\d{2})/);
            if (re_result != undefined && re_result != null && re_result.length > 2) {
                hour = re_result[1];
                minute = re_result[2];
            }
        }

        // 値をチェックし、有効であれば値を返します
        if (hour === undefined || minute === undefined) {
            return undefined;
        } else {
            return DiscordAnalyzer.GetRecruitmentDate(hour, minute);
        }
    }

    /**
     * 募集時間を求めます。
     * 募集時間が過ぎていたら翌日の募集とする。
     * @param {int} hour 
     * @param {int} minute 
     */
    static GetRecruitmentDate(hour, minute) {
        if (hour < 0 || hour > 23) {
            // error
            return undefined;
        }

        if (minute < 0 || minute > 59) {
            // error
            return undefined;
        }

        // set target date as TODAY
        var targetDate = new Date();
        targetDate.setHours(hour);
        targetDate.setMinutes(minute);

        // compare time to now
        var nowDate = new Date();

        // if target is past time, add date
        if (targetDate < nowDate) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        // return values
        return targetDate;
    }

    /**
     * 参加人数を返却します
     * @param {string}} mes 
     * @returns 
     */
    static GetRecruitmentNumbers(mes) {
        // check1
        var re_result = mes.match(/@([0-9]{1,2})/);
        if (re_result != undefined && re_result != null && re_result.length > 1) {
            let num = re_result[1];
            return parseInt(num);
        }

        return undefined;
    }

    /**
     * メッセージが募集文であるかを確認します
     * @param {string} mes 
     * @returns 
     */
    static CheckRecruitment(mes) {
        if (this.ExtractByRegexp(mes, '^(募集|ぼしゅう)[^ 　]*[ 　]') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 募集文を取得します
     * @param {string}} mes 
     * @returns 
     */
    static GetRecruitmentText(mes) {
        return mes.replace(/^(募集|ぼしゅう)[^ 　]*[ 　]/, "");
    }

    /**
     * メッセージが参加文であるかを確認します
     * @param {string} mes 
     * @returns 
     */
    static CheckJoin(mes) {
        if (this.ExtractByRegexp(mes, '^[ 　]*\\d{1,}[ 　]*参加') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 対象の参加IDを取得します
     * @param {string} mes 
     */
    static GetJoinId(mes) {
        let result = undefined;
        let re_result = mes.match(/^[ 　]*(\d{1,})[ 　]*参加/);

        if (re_result === undefined || re_result === null) {
            // no action
        } else if (re_result.length >= 2) {
            result = re_result[1];
        }

        return result;
    }

    /**
     * メッセージが辞退であるかを確認します
     * @param {string} mes 
     * @returns 
     */
    static CheckDecline(mes) {
        if (this.ExtractByRegexp(mes, '^[ 　]*\\d{1,}[ 　]*(行|い)けない') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 対象の辞退IDを取得します
     * @param {string} mes 
     */
    static GetDeclineId(mes) {
        let result = undefined;
        let re_result = mes.match(/^[ 　]*(\d{1,})[ 　]*(行|い)けない/);

        if (re_result === undefined || re_result === null) {
            // no action
        } else if (re_result.length >= 2) {
            result = re_result[1];
        }

        return result;
    }

    /**
     * メッセージがリストであるかを確認します
     * @param {string} mes 
     */
    static CheckTypeList(mes) {
        if (this.ExtractByRegexp(mes, '^[ 　]*(リスト|一覧)') === undefined) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 募集文を返却します
     * @param {string} title 
     * @param {int} id 
     * @param {Array(string)} user_id_list 
     */
    static GetEmbedMessage(title, id, user_id_list) {
        let result = "";

        result = `募集名 : ${title}\n識別ID : ${id}\n参加者 : `;
        user_id_list.forEach(element => {
            result = result + `<@!${element}> `;
        });

        return result;
    }

    /**
     * 一覧を返却します
     * @param {Array(hash)} data 
     */
    static GetEmbedList(data) {
        let result = `募集一覧 : \n`;

        data.forEach(element => {
            result = result + `ID : ${element.id}、募集名 : ${element.title}、参加者：${element.user_name}\n`;
        });

        return result;
    }
}