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

async function user72HoursOfflineEmail() {// eslint-disable-line id-length
    let currentDate = moment();
    let endDate = currentDate.format('YYYY-MM-DD');
    let startDate = currentDate.subtract(4, 'days').format('YYYY-MM-DD');

    // eslint-disable-next-line no-console
    console.log(startDate, '===', endDate);

    // get the queue here
    let offlineUsersFor72Hours = await db.models// eslint-disable-line id-length
        .user.findAll({
            attributes: ['id', 'name', 'firstName', 'lastName', 'email', 'last_logging_time', 'email_send_date', 'country'],
            where: {
                [db.Sequelize.Op.and]: {
                    last_logging_time: {
                        [db.Sequelize.Op.lte]: startDate,
                    },
                    [db.Sequelize.Op.or]: [{
                        email_send_date: {
                            [db.Sequelize.Op.eq]: null
                        }
                    }, {
                        email_send_date: {
                            [db.Sequelize.Op.lte]: startDate
                        }
                    }]
                }
            },
            // limit: 5,
            // offset: !offset ? 0 : parseInt(offset),
            // limit: !limit ? 10 : parseInt(limit)
        });
    
    // console.log('offline-users: ', offlineUsersFor72Hours);
    for (let key in offlineUsersFor72Hours) {
        if(offlineUsersFor72Hours[key].id) {
            let posts = await getPosts(offlineUsersFor72Hours[key]);
            let timelinePosts = await getTimelinePosts(offlineUsersFor72Hours[key]);
            let jobs = await getJobs(offlineUsersFor72Hours[key]);
    
            if (posts && posts.length > 0 || timelinePosts && timelinePosts.length > 0 || jobs && jobs.length > 0) {
                offlineUsersFor72Hours[key].setDataValue('posts', posts);
                offlineUsersFor72Hours[key].setDataValue('timelinePosts', timelinePosts);
                offlineUsersFor72Hours[key].setDataValue('jobs', jobs);
        
                sendEmail(offlineUsersFor72Hours[key]);
                offlineUsersFor72Hours[key].email_send_date = endDate;
                //eslint-disable-next-line no-console
                console.log(':::here');
                await offlineUsersFor72Hours[key].save();
            }
        }
    }
}

async function getPosts(user) {
    // return userId;
    let currentDate = moment();
    let endDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
    let startDate = currentDate.subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss');
    // eslint-disable-next-line no-console
    console.log(startDate, '===', endDate);
    // eslint-disable-next-line no-console
    console.log('date is here ->=>', startDate, endDate);
    let timelineData = [];

    const sequelize = db.models.postv1.sequelize;
    const colRating = sequelize.col('rating');

    timelineData = await db.models.postv1.findAll({
        attributes: [
            'id',
            'message',
            'title',
            'description',
            'question',
            'duration',
            'expiration',
            'courseId',
            [sequelize.where(sequelize.col('postv1.userId'), user.id), 'isPostUser'],
            // [sequelize.where(sequelize.col('postv1.sharePostId'), userId), //check this if it is working or not
            //   'isUserPostShare'],
            // [sequelize.fn('ROUND', colAVG, 2), 'roundedRating'],
            // [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('share.id'))), 'shareCount'],
            // //[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('rating.id'))), 'likeCount'],
            // [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('countReplyVirtual.id'))), 'replyCount'],
        ],
        //limit: 1,
        include: [{
            model: db.models.user,
            as: 'user',
            attributes: ['name', 'id', 'firstName', 'lastName', 'schoolName', 'company', 'institutionName', 'profilePicture']
        }],
        where: {
            updatedAt: {
                [db.Sequelize.Op.between]: [startDate, endDate],
            }
        }
    });

    return timelineData;
}

async function getTimelinePosts(user) {
    // return userId;
    let currentDate = moment();
    let endDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
    let startDate = currentDate.subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss');

    let timelineData = [];

    timelineData = await db.models.post.findAll({
        attributes: {
            include: [
                'id',
                'message',
                'title',
                'createdAt',
            ]
        },
        where: {
            postTo: {
                [db.Sequelize.Op.eq]: null
            },
            [db.Sequelize.Op.or]: [{
                pollExpiration: {
                    [db.Sequelize.Op.eq]: null
                }
            }, {
                pollExpiration: {
                    [db.Sequelize.Op.gt]: moment()
                }
            }],
            [db.Sequelize.Op.and]: {
                updatedAt: {
                    [db.Sequelize.Op.between]: [startDate, endDate],
                }
            }
        },
        group: ['post.id', 'post.userId'],
        order: [['createdAt', 'DESC']],
        //limit: 1,
        include: [{
            model: db.models.user,
            as: 'user',
            attributes: ['name', 'id', 'firstName', 'lastName', 'schoolName', 'company', 'institutionName', 'profilePicture'],
        },
        {
            model: db.models.postPollOption,
            as: 'postPollOption',
            attributes: ['name', 'id'],
        },
        {
            model: db.models.attachment,
            attributes: []
        }
        ],
        subQuery: false,
    });

    return timelineData;
}

async function getJobs(user) {
    // return userId;
    let currentDate = moment();
    let endDate = currentDate.format('YYYY-MM-DD HH:mm:ss');
    let startDate = currentDate.subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss');

    let jobs = [];

    jobs = await db.models.job.findAll({
        attributes: {
            include: [
                'id',
                'title',
                'jobfunction',
                'price',
                'currency',
                'deadline',
                'createdAt',
                'country'
            ]
        },
        where: {
            [db.Sequelize.Op.and]: {
                updatedAt: {
                    [db.Sequelize.Op.between]: [startDate, endDate],
                },
                country: {
                    [db.Sequelize.Op.eq]: user.country,
                }
            }
        },
        group: ['job.id'],
        order: [['createdAt', 'DESC']],
        //limit: 1,
        // include: [{
        //     model: db.models.user,
        //     as: 'user',
        //     attributes: ['name', 'id', 'firstName', 'lastName', 'schoolName', 'company', 'institutionName'],
        // }
        // ],
        subQuery: false,
    });

    return jobs;
}

function sendEmail(user) {
    // let user_id = res.user.id;
    // let email = res.user.email;
    // let file = templates.userOfflinePosts;
    // eslint-disable-next-line no-console
    console.log('final user ->', user);
    let file = templates.emailPosts;
    let postStr = ``;
    let posts = user.getDataValue('posts');
    let timelineData = user.getDataValue('timelinePosts');
    let jobs = user.getDataValue('jobs');
    if (!posts && !timelineData) {
        return user;
    }
    
    let values = {
        email: `${user.email}`,
        username: `${user.firstName}`,
        loginurl: `${config.frontEnd.baseUrl}/community`,
        posts: posts,
        timelinePosts: timelineData,
        jobs: jobs,
        moment: require('moment'),
        crypto: crypto,
        postBaseUrl: `${config.frontEnd.baseUrl}/home?isShowPostReply=1&postId=`,
        jobBaseUrl: `${config.frontEnd.baseUrl}/job-detail/`,
        communityBaseUrl: `${config.frontEnd.baseUrl}/community/student-community/`
    };
    lib.pug.convert(file, values).then((content) => {
        return lib.email.send(`Highlights on Peersview`, user.email, content);
    });
    // eslint-disable-next-line no-console
}

module.exports = {
    initialize: function () {
        log.info('offline cron in');
        return new CronJob({
            cronTime: '00 0 10 * * *',
            // cronTime: '*/2 * * * *',
            onTick: function () {
                log.info('Cron is starting...');
                user72HoursOfflineEmail();
            },
            start: true
        });
    }
};
