'use strict';

/**
 * @author Jo-Ries Canino
 * @description Get Users
 */

const lib = require('../../lib');

function getSuggestedCompany (req, res, next) {
  let _companyId = req.$params.companyId;

  let sql = `SELECT '1', a.*   FROM company a
             where industry in ( select industry from company where id= :companyId )
             and id!=:companyId
             union all
             SELECT '2',b.*  FROM company b where id!=:companyId
             order by 1
             limit 0,2`;
  return req.db.company.sequelize.query
  (
    sql,
    {
      replacements: { companyId: _companyId },
      type: req.db.company.sequelize.QueryTypes.SELECT
    })
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

module.exports.logic = getSuggestedCompany;
module.exports.response = response;
