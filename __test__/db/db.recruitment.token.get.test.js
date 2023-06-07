"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../common/logger");
const recruitement_1 = require("../../db/recruitement");
test("test for get token", () => {
    return new Promise((resolve, reject) => {
        const recruitment = new recruitement_1.RecruitmentRepository();
        const token_function = recruitment.get_m_recruitment_token();
        token_function
            .then((token) => {
            resolve();
        })
            .catch(err => {
            logger_1.logger.error(err);
            expect(true).toEqual(false);
            reject(err);
        });
    });
});
//# sourceMappingURL=db.recruitment.token.get.test.js.map