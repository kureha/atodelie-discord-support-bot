// <APP ROOT>/config/log4js.configuration.js
const path = require("path");

// ログ出力先は、サーバー内の絶対パスを動的に取得して出力先を設定したい
const APP_ROOT = path.join(__dirname, "../");

module.exports = {
    appenders: {
        console: {
            type: "console"
        },
        // ADD
        error: {
            type: "file",
            filename: path.join(APP_ROOT, "./logs/error.log"),
            maxLogSize: 5000000, // 5MB
            backups: 5 // 世代管理は5ファイルまで、古いやつgzで圧縮されていく
        }
    },
    categories: {
        default: {
            // appendersで設定した名称を指定する
            // levelは出力対象とするものを設定ここではALL（すべて）
            appenders: ["console"],
            level: "ALL"
        },
        // ADD
        system: {
            appenders: ["error"],
            level: "ERROR"
        }
    }
}