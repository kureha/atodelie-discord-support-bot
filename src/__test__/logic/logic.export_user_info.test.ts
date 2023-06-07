import { UserInfo, RoleInfo } from '../../entity/user_info';
import { ExportUserInfo } from '../../logic/export_user_info';
import { TestEntity } from '../common/test_entity';

// import fs module
import * as fs from "fs";

describe("parse_user_info", () => {
    function get_test_user_info(user_idx: number, role_num: number): any {
        const user_info: any = {
            user: {
                id: `test_user_id_${user_idx}`,
                username: `test_user_name_${user_idx}`,
            },
            roles: {
                cache: new Map<string, {}>(),
            },
        };

        for (let i = 1; i <= role_num; i++) {
            user_info.roles.cache.set(`test_role_id_${i}`, {
                id: `test_role_id_${i}`,
                name: `test_role_name_${i}`,
            });
        }

        return user_info;
    }

    test("test for parse_user_info single.", () => {
        const discord_user_info_list: any = [get_test_user_info(2, 3)];
        const export_user_info = new ExportUserInfo();
        const user_info_list = export_user_info.parse_user_info(discord_user_info_list);

        // expects
        expect(user_info_list.length).toEqual(1);
        let u: UserInfo = user_info_list[0] || new UserInfo();
        expect(u.id).toEqual(`test_user_id_2`);
        expect(u.name).toEqual(`test_user_name_2`);
        expect(u.roles.length).toEqual(3);
        let r: RoleInfo = u.roles[0] || new RoleInfo();;
        expect(r.id).toEqual(`test_role_id_1`);
        expect(r.name).toEqual(`test_role_name_1`);
        r = u.roles[2] || new RoleInfo();;
        expect(r.id).toEqual(`test_role_id_3`);
        expect(r.name).toEqual(`test_role_name_3`);
    });

    test("test for parse_user_info multi.", () => {
        const discord_user_info_list: any = [
            get_test_user_info(1, 1),
            get_test_user_info(2, 3)];
        const v = new ExportUserInfo();
        const user_info_list = v.parse_user_info(discord_user_info_list);

        // expects
        expect(user_info_list.length).toEqual(2);
        expect(user_info_list[0]?.roles.length).toEqual(1);
        expect(user_info_list[1]?.roles.length).toEqual(3);
    });
});

describe("get_output_string test.", () => {
    test("test for get output string from user info lists.", () => {
        const export_user_info = new ExportUserInfo();

        // test user 1
        const test_user_1 = TestEntity.get_test_user_info(1, 2);

        // test role 2 is add role
        const test_user_2 = TestEntity.get_test_user_info(2, 0);
        const add_role = new RoleInfo();
        add_role.id = `test_role_id_3`;
        add_role.name = `test_role_name_3`;
        test_user_2.add(add_role);

        const test_user_list = [test_user_1, test_user_2];

        const result: string = export_user_info.get_output_string(test_user_list);

        // split
        const result_arr: string[] = result.split(`\r\n`);

        // line is 4, header = 1, user = 2, eof = 1
        expect(result_arr.length).toEqual(4);

        // check header
        const header: string = result_arr[0] || '';
        expect(header.length).toBeGreaterThan(0);
        expect(header.split(`\t`).length).toEqual(5);
        expect(header.split(`\t`)[2]).toEqual(`${test_user_1.roles[0]?.name}(${test_user_1.roles[0]?.id})`);
        expect(header.split(`\t`)[3]).toEqual(`${test_user_1.roles[1]?.name}(${test_user_1.roles[1]?.id})`);
        expect(header.split(`\t`)[4]).toEqual(`${add_role.name}(${add_role.id})`);

        // check data 1
        const user_1: string = result_arr[1] || '';
        expect(user_1.length).toBeGreaterThan(0);
        expect(user_1.split(`\t`)[0]).toEqual(test_user_1.name);
        expect(user_1.split(`\t`)[1]).toEqual(test_user_1.id);
        expect(user_1.split(`\t`)[2]?.length).toBeGreaterThan(0);
        expect(user_1.split(`\t`)[3]?.length).toBeGreaterThan(0);
        expect(user_1.split(`\t`)[4]?.length).toEqual(0);

        // check data 2
        const user_2: string = result_arr[2] || '';
        expect(user_2.length).toBeGreaterThan(0);
        expect(user_2.split(`\t`)[0]).toEqual(test_user_2.name);
        expect(user_2.split(`\t`)[1]).toEqual(test_user_2.id);
        expect(user_2.split(`\t`)[2]?.length).toEqual(0);
        expect(user_2.split(`\t`)[3]?.length).toEqual(0);
        expect(user_2.split(`\t`)[4]?.length).toBeGreaterThan(0);

        // check eof is blank
        expect(result_arr[3]?.length).toEqual(0);
    });
});

describe("export_to_file test.", () => {
    test("test for export to file test.", () => {
        const export_user_info = new ExportUserInfo();
        const output_filename = `./.data/test.csv`;
        const output_data = `test1, test2`;
        export_user_info.export_to_file(output_filename, output_data);

        expect(fs.existsSync(output_filename)).toEqual(true);
        expect(fs.readFileSync(output_filename, { encoding: 'utf-8' }).toString()).toEqual(output_data);
    });

    test("test for export to file error test.", () => {
        const export_user_info = new ExportUserInfo();
        const output_filename = ``;
        const output_data = `test1, test2`;

        // expected assertions is 1
        expect(() => {
            export_user_info.export_to_file(output_filename, output_data);
        }).toThrowError(/^ENOENT: no such file or directory, open/);
    });
});

describe("parse_escaped_characters test.", () => {
    test.each(
        [["test1\\ttest2", "test1\ttest2"], ["test1\\rtest2", "test1\rtest2"], ["test1\\ntest2", "test1\ntest2"], ["test1\\r\\ntest2", "test1\r\ntest2"], ["test1test2", "test1test2"], ["", ""]]
    )("test for get non-escaped characters, %s -> %s", (input: string, exp: string) => {
        let export_user_info: ExportUserInfo = new ExportUserInfo();
        expect(export_user_info.parse_escaped_characters(input)).toEqual(exp);
    });
});
