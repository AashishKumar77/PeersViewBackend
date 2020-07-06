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
        type: {
            optional: true
        },
        q: {
            optional: true
        },
        region: {
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
        },
        userId: {
            notEmpty: {
                errorMessage: 'Missing Resource: User Id'
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
function getUserBlogs(req, res, next) {
    let user = req.$scope.user;
    let userId = req.$params.userId || req.$scope.user.id;
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let sequelize = req.db.blog.sequelize;

    return req.db.blog.findAll({
        attributes: {
            include: [
                'id',
                'title',
                'content',
                'userId',
                'createdAt'
            ]
        },
        where: {
            userId: {
                [req.Op.eq]: userId
            }
        },
        offset: !offset ? 0 : parseInt(offset),
        limit: !limit ? 10 : parseInt(limit),
        order: [['createdAt', 'DESC']]
    })
        .then((blogs) => {
            req.$scope.blogs = blogs;
            next();
            return blogs;
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
module.exports.logic = getUserBlogs;
module.exports.response = response;
