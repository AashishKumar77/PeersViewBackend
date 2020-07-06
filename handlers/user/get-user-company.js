'use strict';

/**
 * @author Jo-Ries Canino
 * @description Get User Followee/Following
 * Basically you are the follower of a given user
 */

const lib = require('../../lib');

function getUserCompany (req, res, next) {
  let userId = req.$params.userId || req.$scope.user.id;

  return req.db.userCompany.findAll({
    include: [{
      model: req.db.user,
      as: 'companyuser'
    }],
    where: {
      userId: {
        [req.Op.eq]: userId
      }
    }
  })
  .then(userCompany => {
    req.$scope.userCompany = userCompany;
    next();
    return userCompany;
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'userCompany.findAll Error - get-user-userCompany');
  });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response (req, res) {
  let userCompany = req.$scope.userCompany;
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: userCompany
  };

  res.status(200).send(body);
}

module.exports.logic = getUserCompany;
module.exports.response = response;
