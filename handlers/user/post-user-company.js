'use strict';

/**
 * @author Jo-Ries Canino
 * @description User follow
 * Basically you are following another user
 */

const lib = require('../../lib');
const crypto = require('../../lib/crypto');
const templates = require('../../templates');
const config = require('../../config');

/**
 * Initialized the schema Object
 */
function validateParams (req, res, next) {
  const schema = {
  userId: { in: ['params'],
    isInt: {
      errorMessage: 'Invalid Resource: User Id'
    },
    toInt: true
  },
  userCompanyId: { in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Missing Resource: userCompanyId Id'
    },
    isInt: {
      errorMessage: 'Invalid Resource: userCompanyId Id'
    }
   }
  };
  req.checkBody(schema);
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


function postUserCompany (req, res, next) {
  
  let userId = req.$params.userId || req.$scope.user.id;
  let userCompanyId = req.$params.userCompanyId;

  console.log('user:'+userId);
  console.log('userCompanyId:'+userCompanyId);

  return req.db.userCompany.create({
    companyUserId: userCompanyId,
    userId: userId // I am the follower
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
    }, 'userCompany.create Error - post-user-company');
  });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
const response = (req, res) => {
  let body = lib.response.created();

  res.status(lib.httpCodes.CREATED).send(body);
};

module.exports.validateParams = validateParams;
module.exports.logic = postUserCompany;
module.exports.response = response;
