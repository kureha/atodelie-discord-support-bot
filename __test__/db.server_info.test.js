const logger = require('../common/logger');
const RecruitmentRepository = require('../db/recruitement');
const ParticipateRepository = require('../db/participate')
const ServerInfoRepository = require('../db/server_info');

const Constants = require('../common/constants');
const constants = new Constants();

test("test for database initialize", () => {
    let server_info_repo = new ServerInfoRepository();
    expect(server_info_repo).not.toBe(undefined);
});

test("test for m_server_info c/r/u/d", () => {
    return new Promise((resolve, reject) => {
        let recruitment_repo = new RecruitmentRepository();
        let participate_repo = new ParticipateRepository();
        let server_info_repo = new ServerInfoRepository();

        let id = `test_id_for_jest_code`
        let server_info_data = {
            server_id: id,
            channel_id: `channel_id`,
            recruitment_target_role: `recruitment_target_role`,
            follow_time: null,
        }

        let follow_target_time = new Date('2021-08-11T17:30:00.000Z');

        // delete first
        server_info_repo.delete_m_server_info(id)
        .then(() => {
            // get blank data
            return server_info_repo.get_m_server_info(id);
        })
        .then((data) => {
            // check expected
            expect(data.server_id).toEqual(id);
            expect(data.channel_id).toEqual(constants.RECRUITMENT_INVALID_CHANNEL_ID);
            expect(data.recruitment_target_role).toEqual(constants.RECRUITMENT_INVALID_ROLE);
            expect(data.follow_time).toEqual(null);

            // insert check
            return server_info_repo.insert_m_server_info(server_info_data);
        })
        .then(() => {
            // select check
            return server_info_repo.get_m_server_info(id);
        })
        .then((data) => {
            // expect data
            expect(data).toEqual(server_info_data);
            
            // update time
            return server_info_repo.update_m_server_info_follow_time(server_info_data.server_id, follow_target_time);
        }).then(() => {
            // select check
            return server_info_repo.get_m_server_info(id);
        })
        .then((data) => {
            // expect data
            expect(data.follow_time).toEqual(follow_target_time.toISOString());

            // delete test data
            return server_info_repo.delete_m_server_info(id);
        })
        .then(() => {
            // test complete ok all data
            resolve();
        })
        .catch((err) => {
            console.log(err);
            expect(true).toBe(false);
            reject(err);
        });
    });
});