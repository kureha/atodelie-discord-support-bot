"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Version = void 0;
// import constants
const version_1 = require("../db/version");
class Version {
    constructor() {
        this.version_repo = new version_1.VersionRepository();
    }
    /**
     * return application version
     * @returns version string of hard coding
     */
    get_app_version() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.version_repo.get_m_version();
                return result.app_version;
            }
            catch (err) {
                throw `get app version failed. error = ${err}`;
            }
        });
    }
    /**
     * return database version
     * @returns version string of database (m_version)
     */
    get_database_version() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.version_repo.get_m_version();
                return result.database_version;
            }
            catch (err) {
                throw `get database version failed. error = ${err}`;
            }
        });
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map