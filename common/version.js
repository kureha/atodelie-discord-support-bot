"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
// import constants
const version_1 = require("../db/version");
class Version {
    /**
     * return application version
     * @returns version string of hard coding
     */
    static get_app_version() {
        return new Promise((resolve, reject) => {
            const r = new version_1.VersionRepository();
            r.get_m_version()
                .then((data) => {
                resolve(data.app_version);
            })
                .catch(() => {
                reject();
            });
        });
    }
    /**
     * return database version
     * @returns version string of database (m_version)
     */
    static get_database_version() {
        return new Promise((resolve, reject) => {
            const r = new version_1.VersionRepository();
            r.get_m_version()
                .then((data) => {
                resolve(data.database_version);
            })
                .catch(() => {
                reject();
            });
        });
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map