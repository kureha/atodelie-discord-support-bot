const logger = require('../common/logger');
const Recruitment = require('../db/recruitement');

test("Test for constants for 4", () => {
    let token = Recruitment.create_digits_token(4);
    expect(token.length).toEqual(4);
    logger.trace(`generated token : ${token}`)
});

test("Test for constants for 10", () => {
    let token = Recruitment.create_digits_token(10);
    expect(token.length).toEqual(10);
    logger.trace(`generated token : ${token}`)
});