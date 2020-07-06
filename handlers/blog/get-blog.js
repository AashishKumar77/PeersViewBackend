/*eslint-disable max-len*/
'use strict';

/**
 * @author Alex Lu
 * @description Get a specific Blog
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
    blogId: {
      isInt: {
        errorMessage: 'Invalid Resource: Blog Id'
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

/**
 * This would be the fallback if the user existed
 * @see {@link lib/isUserTokenExist}
 * @see isUserTokenExist
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
function getBlog (req, res, next) {
  let user = req.$scope.user;
  let blogId = req.$params.blogId;

  return req.db.blog.findOne({
    where: {
      id: {
        [req.Op.eq]: blogId
      }
    },
    include: [{
      model: req.db.user,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'email', 'schoolName', 'profilePicture', 'socialImage'],
    }]
  })
  .then((blog) => {
    req.$scope.blog = blog;
    next();
    return blog;
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'blog.getBlog Error - get-blog');
  });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response (req, res) {
  let blog = req.$scope.blog;
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: blog
  };

  res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getBlog;
module.exports.response = response;
