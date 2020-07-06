'use strict';

/**
 * @author Alex Lu
 * @description Post Blog
 */

const lib = require('../../lib');
const moment = require('moment');

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
    let bodySchema = {};

    bodySchema = {
        title: {
            isLength: {
                options: [{
                    min: 1,
                    max: 255
                }],
                errorMessage: `Invalid Resource: Minimum 1 and maximum 280 characters are allowed`
            },
            notEmpty: {
                errorMessage: 'Missing Resource: Title'
            }
        },
        content: {
            notEmpty: {
                errorMessage: 'Missing Resource: Blog Function'
            }
        }
    };

    req.checkBody(bodySchema);

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
function updateBlog(req, res, next) {
    let blogId = req.$params.blogId
    let user = req.$scope.user;
    let title = req.$params.title;
    let content = req.$params.content;

    return req.db.blog.update({
        userId: user.id,
        title: title,
        content: content
    }, {
        where: {
            id: blogId
        }
    })
        .then(blog => {
            req.$scope.blog = blog;
            next();
            return blog;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'blog.create Error - update-blog');
        });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let blog = req.$scope.blog;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 201,
        data: blog
    };

    res.status(201).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = updateBlog;
module.exports.response = response;
