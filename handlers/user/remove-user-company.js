'use strict';

/**
 * @author Jo-Ries Canino
 * @description Unfollow a User
 */

const lib = require('../../lib');

/**
 * Validation of req.body, req, param,
 * and req.query
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
function validateParams (req, res, next) {
  let paramsSchema = {
    id: {
      isInt: {
        errorMessage: 'Invalid Resource: Id'
      }
    }
  };

  req.checkParams(paramsSchema);
  return req.getValidationResult()
  .then(validationErrors => {
    if (validationErrors.array().length !== 0) {
      return res.status(400)
      .send(new lib.rpc.ValidationError(validationErrors.array()));
    }

    return next();
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));
  });
}

function removeUserCompany (req, res, next) {
  let id = req.$params.id

  return req.db.userCompany.findOne({
    where: {
      [req.Op.and]: {
        id: id,
      }
    }
  })
  .then(result => {
    
    return req.db.userCompany.destroy({
      where: {
        [req.Op.and]: {
          id: id,
        }
      }
    });
  })
  .then(result => {
    next();
    return result;
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'userCompany.findOne Error - remove-user-company');
  });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response (req, res) {
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200
  };

  res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = removeUserCompany;
module.exports.response = response;
