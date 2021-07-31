const logger = require('../common/logger');
const Recruitment = require('./../db/recruitement');

test("test for database initialize", () => {
    var recruitment = new Recruitment();
    expect(recruitment).not.toBe(undefined);
});

test("test for m_recruitment c/r/u/d", () => {
    return new Promise((resolve, reject) => {
        let recruitment = new Recruitment();
        let test_token = 'token_';
        let test_id = undefined;

        // get id test
        recruitment.get_m_recruitment_id()
            .then((id) => {
                // insert test
                test_id = id;
                test_token = `test_token_${id}`;
                console.log(`test_id = ${test_id}, test_token = ${test_token}`);

                return recruitment.insert_m_recruitment({
                    id: id,
                    channel_id: "testingid",
                    token: test_token,
                    status: 2,
                    limit_time: "2099-12-31 11:59:59",
                    name: "myname",
                    owner_id: "owenr_id",
                    description: "description",
                });
            })
            .then(() => {
                // select test
                return recruitment.get_m_recruitment(test_token);
            })
            .then((data) => {
                // expect
                expect(data.id).toEqual(test_id);
                expect(data.channel_id).toEqual("testingid");
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
                return recruitment.update_m_recruitment(data);
            })
            .then(() => {
                // select test
                return recruitment.get_m_recruitment(test_token);
            }).then((data) => {
                // expect
                expect(data.id).toEqual(test_id);
                expect(data.channel_id).toEqual("testingid");
                expect(data.token).toEqual(test_token);
                expect(data.status).toEqual(3);
                expect(data.name).toEqual("myname");
                expect(data.owner_id).toEqual("owenr_id");
                expect(data.description).toEqual("updated");
                expect(data.delete).toEqual(0);

                // delete test
                return recruitment.delete_m_recruitment(test_token);
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
    return new Promise((resolve, reject) => {
        let recruitment = new Recruitment();
        let test_token = 'token_';
        let test_id = undefined;

        let p01 = {
            token: test_token,
            status: 2,
            user_id: `test_user_${test_id}`,
            description: "participate desc.",
            delete: false,
        };

        let p02 = {
            token: test_token,
            status: 2,
            user_id: `test_user2_${test_id}`,
            description: "participate desc 2.",
            delete: false,
        };

        // get id test
        recruitment.get_m_recruitment_id()
            .then((id) => {
                // insert test
                test_id = id;
                test_token = `test_token_${id}`;
                console.log(`test_id = ${test_id}, test_token = ${test_token}`);

                return recruitment.insert_m_recruitment({
                    id: id,
                    channel_id: "testingid",
                    token: test_token,
                    status: 2,
                    limit_time: "2099-12-31 11:59:59",
                    name: "myname",
                    owner_id: "owenr_id",
                    description: "description",
                });
            })
            .then(() => {
                p01.token = test_token;

                // insert participate
                return recruitment.insert_t_participate(p01);
            })
            .then(() => {
                p02.token = test_token;

                // insert participate
                return recruitment.insert_t_participate(p02);
            })
            .then(() => {
                p01.status = 5;
                p01.description = "participate desc 3.";
                p01.delete = false;

                // update
                return recruitment.update_t_participate(p01);
            })
            .then(() => {
                // get
                return recruitment.get_t_participate(test_token);
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
                return recruitment.delete_t_participate(test_token);
            })
            .then(() => {
                // delete master
                return recruitment.delete_m_recruitment(test_token);
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