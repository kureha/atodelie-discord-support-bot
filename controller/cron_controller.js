// create logger
const logger = require('./../common/logger');

// import constants
const Constants = require('./../common/constants');
const constants = new Constants();

// import modules
const Recruitment = require('./../db/recruitement');

// create message modules
const MessageManager = require('./../logic/discord_message_manager');

module.exports = class CronController {
    static follow_recruitment_member(client) {
        // follow to date
        const to_datetime = new Date();
        to_datetime.setMinutes(to_datetime.getMinutes() + constants.DISCORD_FOLLOW_MINUTE);
        logger.info(`follow recruitment cron start. : to_datetime = ${to_datetime.toISOString()}`);

        const recruitment = new Recruitment();
        const messageManager = new MessageManager();

        // loop for guild id
        client.guilds.cache.forEach((guild) => {
            let server_info = undefined;

            // get server info (send target channel, get latest follow_time)
            recruitment.get_m_server_info(guild.id)
                .then((temp_server_info) => {
                    server_info = temp_server_info;
                    logger.info(`cron message sended guild info : server_id = ${server_info.server_id}, channel_id = ${server_info.channel_id}, from_time = ${server_info.follow_time}, to_time = ${to_datetime.toLocaleString()}`)

                    // if follow time is null, apply default.
                    if (server_info.follow_time === null) {
                        server_info.follow_time = Constants.get_default_date().toISOString();
                        logger.warn(`server follow_time is null, apply default. : date = ${server_info.follow_time}`);
                    }

                    // get follow lists
                    return recruitment.get_m_recruitment_for_follow(server_info.server_id, server_info.follow_time, to_datetime.toISOString());
                })
                .then((recruitment_data_list) => {
                    logger.info(`select follow data list completed.`)
                    logger.trace(recruitment_data_list);

                    // get join data and send message
                    recruitment_data_list.forEach((recruitment_data) => {
                        recruitment.get_t_participate(recruitment_data.token)
                            .then((user_list) => {
                                // get user list
                                recruitment_data.user_list = user_list;
                                // if user more than 0 member, followup executed.
                                if (recruitment_data.user_list.length > 0) {
                                    client.channels.cache.get(server_info.channel_id).send(messageManager.get_join_recruitment_follow_message(recruitment_data));
                                }
                            })
                    })
                })
                .then(() => {
                    // update master
                    recruitment.update_m_server_info_follow_time(server_info.server_id, to_datetime);
                    logger.info(`follow recruitment cron completed.`);
                })
                .catch((err) => {
                    // send error message
                    logger.error(`cron command failed for error.`);
                    logger.error(err);
                });
        });
    }
};