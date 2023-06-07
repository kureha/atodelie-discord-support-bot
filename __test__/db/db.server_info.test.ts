import { Constants } from '../../common/constants';
const constants = new Constants();

import { ServerInfoRepository } from '../../db/server_info';

test("test for database initialize", () => {
    let server_info_repo = new ServerInfoRepository();
    expect(server_info_repo).not.toBe(undefined);
});

test("test for m_server_info c/r/u/d", () => {
    return new Promise<void>((resolve, reject) => {
        let server_info_repo = new ServerInfoRepository();

        let id = `test_id_for_jest_code`
        let server_info_data = {
            server_id: id,
            channel_id: `channel_id`,
            recruitment_target_role: `recruitment_target_role`,
            follow_time: new Date('1970-01-01T00:00:00.000Z'),
        }

        let server_info_data_for_test = {
            server_id: id,
            channel_id: `channel_id`,
            recruitment_target_role: `recruitment_target_role`,
            follow_time: new Date('1970-01-01T00:00:00.000Z'),
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
                expect(data.follow_time).toEqual(Constants.get_default_date());

                // insert check
                return server_info_repo.insert_m_server_info(server_info_data);
            })
            .then(() => {
                // select check
                return server_info_repo.get_m_server_info(id);
            })
            .then((data) => {
                // expect data
                expect(data).toEqual(server_info_data_for_test);

                // update time
                return server_info_repo.update_m_server_info_follow_time(server_info_data.server_id, follow_target_time);
            }).then(() => {
                // select check
                return server_info_repo.get_m_server_info(id);
            })
            .then((data) => {
                // expect data
                expect(data.follow_time).toEqual(follow_target_time);

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