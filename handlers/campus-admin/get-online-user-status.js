'use strict';

/**
 * @author Alex Lu
 * @description Get Campus Courses
 */
const moment = require('moment');
const lib = require('../../lib');

function getOnlineUserStatus (req, res, next) {// eslint-disable-line id-length
    return req.db.user.findAll({})
    .then(users => {
        req.$scope.users = users;
        let todayOnlineUsers = [];
        let monthOnlineUsers = [];
        let startTimeOfDay = moment().startOf('day');
        let startTimeOfMonth = moment().startOf('month');

        for (let i=0; i<users.length; i++) {
            if (moment(users[i].last_logging_time) > startTimeOfDay) {
                todayOnlineUsers.push(users[i]);
            }

            if (moment(users[i].last_logging_time) > startTimeOfMonth) {
                monthOnlineUsers.push(users[i]);
            }
        }

        req.$scope.todayOnlineUsers = todayOnlineUsers;
        req.$scope.monthOnlineUsers = monthOnlineUsers;
        next();
        return users;
    })
    .catch(error => {
        res.status(500)
        .send(new lib.rpc.InternalError(error));
    
        req.log.error({
            err: error.message
        }, 'user.findAll Error - get-users');
    });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response (req, res) {
  let users = req.$scope.users;
  let todayOnlineUsers = req.$scope.todayOnlineUsers;
  let monthOnlineUsers = req.$scope.monthOnlineUsers;

  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: {
        day: {
            totalCount: users.length,
            onlineCount: todayOnlineUsers.length
        },
        month: {
            totalCount: users.length,
            onlineCount: monthOnlineUsers.length
        }
    }
  };

  res.status(200).send(body);
}

module.exports.logic = getOnlineUserStatus;
module.exports.response = response;
