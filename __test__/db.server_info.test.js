const logger = require('../common/logger');
const Recruitment = require('../db/recruitement');
const Participate = require('../db/participate')
const ServerInfo = require('../db/server_info');

const Constants = require('../common/constants');
const constants = new Constants();

test("test for database initialize", () => {
    let server_info = new ServerInfo();
    expect(server_info).not.toBe(undefined);
});

test("test for m_server_info c/r/u/d", () => {
    return new Promise((resolve, reject) => {
        let recruitment = new Recruitment();
        let participate = new Participate();
        let server_info = new ServerInfo();

        let id = `test_id_for_jest_code`
        let server_info_data = {
            server_id: id,
            channel_id: `channel_id`,
            recruitment_target_role: `recruitment_target_role`,
            follow_time: null,
        }

        let follow_target_time = new Date('2021-08-11T17:30:00.000Z');

        // delete first
        server_info.delete_m_server_info(id)
        .then(() => {
            // get blank data
            return server_info.get_m_server_info(id);
        })
        .then((data) => {
            // check expected
            expect(data.server_id).toEqual(id);
            expect(data.channel_id).toEqual(constants.RECRUITMENT_INVALID_CHANNEL_ID);
            expect(data.recruitment_target_role).toEqual(constants.RECRUITMENT_INVALID_ROLE);
            expect(data.follow_time).toEqual(null);

            // insert check
            return server_info.insert_m_server_info(server_info_data);
        })
        .then(() => {
            // select check
            return server_info.get_m_server_info(id);
        })
        .then((data) => {
            // expect data
            expect(data).toEqual(server_info_data);
            
            // update time
            return server_info.update_m_server_info_follow_time(server_info_data.server_id, follow_target_time);
        }).then(() => {
            // select check
            return server_info.get_m_server_info(id);
        })
        .then((data) => {
            // expect data
            expect(data.follow_time).toEqual(follow_target_time.toISOString());

            // delete test data
            return server_info.delete_m_server_info(id);
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