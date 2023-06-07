import { InitializeRepository } from '../../db/initialize';

// import constants
import { Constants } from '../../common/constants';
const constants = new Constants();

// import file module
import * as fs from 'fs';

const sqlite_file: string = './.data/db.initialize.test.sqlite';

describe("db.initialize test.", () => {
    test("copy template file", () => {
        InitializeRepository.initialize_database_if_not_exists(sqlite_file, constants.SQLITE_TEMPLATE_FILE);
        expect(fs.existsSync(sqlite_file)).toBeTruthy;
    });

    test("exist file check", () => {
        fs.copyFileSync(constants.SQLITE_TEMPLATE_FILE, sqlite_file);
        expect(fs.existsSync(sqlite_file)).toBeTruthy;
        InitializeRepository.initialize_database_if_not_exists(sqlite_file, constants.SQLITE_TEMPLATE_FILE);
        expect(fs.existsSync(sqlite_file)).toBeTruthy;
        InitializeRepository.initialize_database_if_not_exists(`${sqlite_file}.notfound`, constants.SQLITE_TEMPLATE_FILE);
        expect(fs.existsSync(sqlite_file)).toBeTruthy;
        fs.rmSync(`${sqlite_file}.notfound`);
    });
});