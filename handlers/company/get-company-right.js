'use strict';

/**
 * @author Jo-Ries Canino
 * @description Get Users
 */

const lib = require('../../lib');

function getCompanyRight (req, res, next) {
  let userId = req.$scope.user.id;
  let query = "select count(userid) as admin  from user_company where userid="+userId+" union all select count(userid) as admin from user_company where companyUserId="+userId+" ";
  return req.db.userCompany.sequelize.query
  (query,{ type: req.db.userCompany.sequelize.QueryTypes.SELECT })
  .then(result => {
    req.$scope.result = result;

    next();
    return result;
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
  let result = req.$scope.result;
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: result
  };
  res.status(200).send(body);
}

module.exports.logic = getCompanyRight;
module.exports.response = response;
