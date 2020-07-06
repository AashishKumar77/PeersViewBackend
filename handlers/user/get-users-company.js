'use strict';

/**
 * @author Jo-Ries Canino
 * @description Get Users
 */

const lib = require('../../lib');

function getUsersCompany (req, res, next) {
  let userId = req.$params.userId || req.$scope.user.id;
  
  return req.db.userCompany.sequelize.query
  ("SELECT * FROM user where userTypeId=3 and id not in (select companyUserId from user_company where userId="+userId+") and  id not in (select userId from user_company where userId="+userId+") ",{ type: req.db.userCompany.sequelize.QueryTypes.SELECT })
  .then(users => {
    req.$scope.users = users;

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
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: users
  };

  res.status(200).send(body);
}

module.exports.logic = getUsersCompany;
module.exports.response = response;
