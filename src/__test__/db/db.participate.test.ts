import { RecruitmentRepository } from '../../db/recruitement';
import { ParticipateRepository } from '../../db/participate';

import { Participate } from '../../entity/participate';


// import test entities
import { TestEntity } from '../common/test_entity';

// create rep
const rec_rep = new RecruitmentRepository();
const par_rep = new ParticipateRepository();

describe("db.participate test.", () => {
    beforeEach(async () => {
        await rec_rep.delete_m_recruitment_all();
        await par_rep.delete_t_participate_all();
    });

    test("select participate test: empty result", async () => {
        // select empty
        let result = await par_rep.get_t_participate('');
        expect(result.length).toEqual(0);

        // create recruitment
        let test_rec = TestEntity.get_test_recruitment();
        await rec_rep.insert_m_recruitment(test_rec);

        // select empty
        result = await par_rep.get_t_participate('');
        expect(result.length).toEqual(0);
    });

    test("select participate test: insert(multi) -> select(multi) -> insert(single) -> select(single)", async () => {
        // create recruitment
        let test_rec = TestEntity.get_test_recruitment();
        await rec_rep.insert_m_recruitment(test_rec);

        // insert participates
        let test_par_list: Participate[] = [TestEntity.get_test_participate(), TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = await par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(2);

        // create another recruitment
        let test_rec_another = TestEntity.get_test_recruitment();
        test_rec_another.id = 2;
        test_rec_another.token = "test_token_another";
        test_rec_another.message_id = "test_message_id_another";
        await rec_rep.insert_m_recruitment(test_rec_another);

        // insert participate
        let test_par_another = TestEntity.get_test_participate();
        test_par_another.id = 2;
        test_par_another.token = "test_token_another";
        cnt = await par_rep.insert_t_participate(test_par_another);
        expect(cnt).toEqual(1);

        // select multi result
        let result = await par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_par_list[0]);
        expect(result).toContainEqual(test_par_list[1]);

        // select single result
        result = await par_rep.get_t_participate(test_rec_another.token);
        expect(result.length).toEqual(1);
        expect(result).toContainEqual(test_par_another);
    });

    test("select participate test: expire select result", async () => {
        // create expire recruitment
        let test_rec = TestEntity.get_test_recruitment();
        test_rec.limit_time = new Date("2000-12-31T11:59:59.000Z");
        await rec_rep.insert_m_recruitment(test_rec);

        // insert participates for expire
        let test_par_list: Participate[] = [TestEntity.get_test_participate(), TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = await par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(0);

        // select empty (expire, result is 0)
        let result = await par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(0);
    });

    test("update and delete test: insert -> select -> update -> select -> delete -> select", async () => {
        // create recruitment
        let test_rec = TestEntity.get_test_recruitment();
        await rec_rep.insert_m_recruitment(test_rec);

        // insert participates
        let test_par_list: Participate[] = [TestEntity.get_test_participate(), TestEntity.get_test_participate()];
        if (test_par_list[1] != undefined) {
            test_par_list[1].user_id = "user_id_another";
        }
        let cnt = await par_rep.insert_t_participate_list(test_par_list);
        expect(cnt).toEqual(2);

        // create another recruitment
        let test_rec_expire = TestEntity.get_test_recruitment();
        test_rec_expire.id = 2;
        test_rec_expire.token = "test_token_expire";
        test_rec_expire.message_id = "test_message_id_another";
        test_rec_expire.limit_time = new Date("2000-12-31T11:59:59.000Z");
        await rec_rep.insert_m_recruitment(test_rec_expire);

        // insert participate
        let test_par_expire = TestEntity.get_test_participate();
        test_par_expire.id = 2;
        test_par_expire.token = "test_token_expire";
        cnt = await par_rep.insert_t_participate(test_par_expire);
        expect(cnt).toEqual(0);

        // update participate
        let test_par_update = TestEntity.get_test_participate();
        test_par_update.status = 3;
        test_par_update.description = "description_updated";
        test_par_update.user_id = "user_id_another"
        cnt = await par_rep.update_t_participate(test_par_update);
        expect(cnt).toEqual(1);

        // select updated info
        let result = await par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(2);
        expect(result).toContainEqual(test_par_list[0]);
        expect(result).toContainEqual(test_par_update);

        // update expire participate - ignore
        cnt = await par_rep.update_t_participate(test_par_expire);
        expect(cnt).toEqual(0);

        // select updated expire info
        result = await par_rep.get_t_participate(test_par_expire.token);
        expect(result.length).toEqual(0);

        // delete participate info
        cnt = await par_rep.delete_t_participate(test_rec.token);
        expect(cnt).toEqual(2);

        result = await par_rep.get_t_participate(test_rec.token);
        expect(result.length).toEqual(0);
    });

    test("update or delete non-found participate test", async () => {
        let cnt = await par_rep.insert_t_participate(TestEntity.get_test_participate());
        expect(cnt).toEqual(0);
        cnt = await par_rep.update_t_participate(TestEntity.get_test_participate());
        expect(cnt).toEqual(0);
        cnt = await par_rep.delete_t_participate(TestEntity.get_test_participate().token);
        expect(cnt).toEqual(0);
    });
});