const logger = require('../common/logger');
const Recruitment = require('../db/recruitement');

test("test for get token", () => {
    return new Promise((resolve, reject) => {
        const recruitment = new Recruitment();
        const token_function = recruitment.get_m_recruitment_token();
        token_function
            // retry max 3 times
            .catch(token_function)
            .catch(token_function)
            .catch(token_function)
            .then((token) => {
                logger.debug(`token : ${token}`);
                resolve();
            })
            .catch(err => {
                logger.error(err);
                expect(true).toEqual(false);
                reject(err);
            });
    });
});