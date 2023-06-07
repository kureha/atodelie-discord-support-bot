import { RecruitmentRepository } from '../../db/recruitement';
import { ParticipateRepository } from '../../db/participate';
import { ServerInfoRepository } from '../../db/server_info';

import { Recruitment } from '../../entity/recruitment';
import { Participate } from '../../entity/participate';

test("test for database initialize", () => {
    let recruitment_repo = new RecruitmentRepository();
    expect(recruitment_repo).not.toBe(undefined);
    let participate_repo = new ParticipateRepository();
    expect(participate_repo).not.toBe(undefined);
    let server_info_repo = new ServerInfoRepository();
    expect(server_info_repo).not.toBe(undefined);
});

test("test for m_recruitment c/r/u/d", () => {
    return new Promise<void>((resolve, reject) => {
        let recruitment_repo = new RecruitmentRepository();

        let test_token: string = 'token_';
        let test_id: number = 0;

        // get id test
        recruitment_repo.get_m_recruitment_id()
            .then((id) => {
                // get id
                test_id = id;
                return recruitment_repo.get_m_recruitment_token();
            }).then((token) => {
                // get token
                test_token = token;

                let rec = new Recruitment();
                rec.id = test_id;
                rec.server_id = "testingid";
                rec.token = test_token;
                rec.status = 2;
                rec.limit_time = new Date("2099-12-31T11:59:59.000Z");
                rec.name = "myname";
                rec.owner_id = "owenr_id"
                rec.description = "description";

                return recruitment_repo.insert_m_recruitment(rec);
            })
            .then(() => {
                // select test
                return recruitment_repo.get_m_recruitment(test_token);
            })
            .then((data) => {
                // expect
                expect(data.id).toEqual(test_id);
                expect(data.server_id).toEqual("testingid");
                expect(data.token).toEqual(test_token);
                expect(data.status).toEqual(2);
                expect(data.name).toEqual("myname");
                expect(data.owner_id).toEqual("owenr_id");
                expect(data.description).toEqual("description");
                expect(data.delete).toEqual(0);

                // update data
                data.status = 3;
                data.description = "updated";

                // update test
                return recruitment_repo.update_m_recruitment(data);
            })
            .then(() => {
                // select test
                return recruitment_repo.get_m_recruitment(test_token);
            }).then((data) => {
                // expect
                expect(data.id).toEqual(test_id);
                expect(data.server_id).toEqual("testingid");
                expect(data.token).toEqual(test_token);
                expect(data.status).toEqual(3);
                expect(data.name).toEqual("myname");
                expect(data.owner_id).toEqual("owenr_id");
                expect(data.description).toEqual("updated");
                expect(data.delete).toEqual(0);

                // delete test
                return recruitment_repo.delete_m_recruitment(test_token);
            }).then(() => {
                // ok all test
                resolve();
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            });
    });
});

test('test for t_participate c/r/u/d', () => {
    return new Promise<void>((resolve, reject) => {
        let recruitment_repo = new RecruitmentRepository();
        let participate_repo = new ParticipateRepository();
        let test_token = 'token_';
        let test_id: number = 0;

        let p01 = new Participate();
        p01.token = test_token;
        p01.status = 2;
        p01.user_id = `test_user_${test_id}`;
        p01.description = "participate desc.";
        p01.delete = false;

        let p02 = new Participate();
        p02.token = test_token;
        p02.status = 2;
        p02.user_id = `test_user2_${test_id}`;
        p02.description = "participate desc 2.";
        p02.delete = false;

        // get id test
        recruitment_repo.get_m_recruitment_id()
            .then((id) => {
                // insert test
                test_id = id;
                test_token = `test_token_${id}`;

                let rec = new Recruitment();
                rec.id = id;
                rec.server_id = "testingid";
                rec.token = test_token;
                rec.status = 2;
                rec.limit_time = new Date("2099-12-31T11:59:59.000Z");
                rec.name = "myname";
                rec.owner_id = "owenr_id";
                rec.description = "description";

                return recruitment_repo.insert_m_recruitment(rec);
            })
            .then(() => {
                p01.token = test_token;

                // insert participate
                return participate_repo.insert_t_participate(p01);
            })
            .then(() => {
                p02.token = test_token;

                // insert participate
                return participate_repo.insert_t_participate(p02);
            })
            .then(() => {
                p01.status = 5;
                p01.description = "participate desc 3.";
                p01.delete = false;

                // update
                return participate_repo.update_t_participate(p01);
            })
            .then(() => {
                // get
                return participate_repo.get_t_participate(test_token);
            })
            .then((datas) => {
                expect(datas.length).toBe(2);

                datas.forEach(v => {
                    if (v.user_id == p01.user_id) {
                        expect(v.id).toEqual(test_id);
                        expect(v.status).toEqual(p01.status);
                        expect(v.description).toEqual(p01.description);
                        expect(v.delete).toEqual(p01.delete ? 1 : 0);
                    }

                    if (v.user_id == p02.user_id) {
                        expect(v.id).toEqual(test_id);
                        expect(v.status).toEqual(p02.status);
                        expect(v.description).toEqual(p02.description);
                        expect(v.delete).toEqual(p02.delete ? 1 : 0);
                    }
                });

                // delete test
                return participate_repo.delete_t_participate(test_token);
            })
            .then(() => {
                // delete master
                return recruitment_repo.delete_m_recruitment(test_token);
            })
            .then(() => {
                // all ok
                resolve();
            })
            .catch((err) => {
                console.log(err);
                expect(true).toBe(false);
                reject(err);
            });
    })
});