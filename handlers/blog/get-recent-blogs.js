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
function validateParams(req, res, next) {
    let paramsSchema = {
        blogId: {
            isInt: {
              errorMessage: 'Invalid Resource: Blog Id'
            }
        },
        q: {
            optional: true
        },
        limit: {
            optional: true,
            isInt: {
                errorMessage: 'Invalid Resource: Limit'
            }
        },
        offset: {
            optional: true,
            isInt: {
                errorMessage: 'Invalid Resource: Offset'
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
function getRecentBlogs(req, res, next) {
    console.log(req.$params.blogId);
    let blogId = req.$params.blogId;
    return req.db.blog.findAll({
        where: {
            id: {
                [req.Op.not]: blogId,
            }
        },
        order: [['createdAt', 'DESC']],
        limit: 5
    })
        .then(async (blogs) => {
            req.$scope.blogs = blogs;
            next();
            return blogs;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'blog.getSearchBlogs Error - get-search-blogs');
        });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let blogs = req.$scope.blogs;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: blogs
    };

    res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getRecentBlogs;
module.exports.response = response;
