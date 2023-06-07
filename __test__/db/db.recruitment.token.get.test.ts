import { logger } from '../../common/logger';

import { RecruitmentRepository } from '../../db/recruitement';

test("test for get token", () => {
    return new Promise<void>((resolve, reject) => {
        const recruitment = new RecruitmentRepository();
        const token_function = recruitment.get_m_recruitment_token();
        token_function
            .then((token) => {
                resolve();
            })
            .catch(err => {
                logger.error(err);
                expect(true).toEqual(false);
                reject(err);
            });
    });
});