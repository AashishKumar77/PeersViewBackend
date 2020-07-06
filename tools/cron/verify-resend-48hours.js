'use strict';

/**
 * This cron will fetch all data when
 * there is a change in a certain post
 */
const CronJob = require('cron').CronJob;
const db = require('../../lib/db');
const lib = require('../../lib');
const config = require('../../config');
const log = require('bunyan').createLogger(config.appLog);
const templates = require('../../templates');
const moment = require('moment');
const crypto = require('../../lib/crypto');
const randomstring = require('randomstring');

async function verifyEmailResendIn48hours() {// eslint-disable-line id-length
    let currentDate = moment();
    let startDate = currentDate.subtract(2, 'days').format('YYYY-MM-DD');

    // eslint-disable-next-line no-console

    // get the queue here
    let resendEmailUsers = await db.models// eslint-disable-line id-length
        .user.findAll({
            attributes: ['id', 'name', 'firstName', 'lastName', 'email', 'last_logging_time', 'email_send_date', 'country'],
            where: {
                [db.Sequelize.Op.and]: {
                    token: {
                        [db.Sequelize.Op.eq]: null,
                    },
                    email_send_date: {
                        [db.Sequelize.Op.eq]: null,
                    },
                    createdAt: {
                        [db.Sequelize.Op.lte]: startDate
                    }
                }
            },
        });
    
    for (let key in resendEmailUsers) {
        if(resendEmailUsers[key].id) {
            sendEmail(resendEmailUsers[key]);
        }
    }
}

function sendEmail (user) {
    let token = randomstring.generate();
    let currentDate = moment();
    let tokenActiveDate = moment(new Date()).utc().add(24, 'hours');

    let result = db.models.user.update({
        tokenActiveDate: tokenActiveDate,
        email_send_date: currentDate
    }, {
        where: {
            id: {
                [db.Sequelize.Op.eq]: user.id
            }
        }
    });

    if (result) {
        let name = user.firstName;
        let email = user.email;
        let template = templates.emailVerificationResend;
    
        let jotToken = lib.jwt.encode({
          userId: user.id
        }, token);
    
        let values = {
          name: name,
          verifyEmailUrl: `${config.frontEnd.baseUrl}/user/verify-email?jotToken=${jotToken}&token=${token}`
        };
      
        lib.pug.convert(template, values)
        .then(content => {
            console.log("email sent", email);
          return lib.email.send(`Please verify your email`, email, content);
        });
    }
}

module.exports = {
    initialize: function () {
        log.info('verify email resend cron in');
        return new CronJob({
            cronTime: '00 0 10 * * *',
            // cronTime: '*/2 * * * *',
            onTick: function () {
                log.info('Cron is starting...');
                verifyEmailResendIn48hours();
            },
            start: true
        });
    }
};
