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
function getSearchBlogs(req, res, next) {
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let title = req.$params.q;

    let query = {};

    if (title && title != "") {
        query.title = {
            [req.Op.like]: `%${title}%`
        };
    }
    
    return req.db.blog.findAll({
        where: query,
        offset: !offset ? 0 : parseInt(offset),
        limit: !limit ? 10 : parseInt(limit),
        order: [['createdAt', 'DESC']]
    })
        .then(async (blogs) => {
            let totalCount = await req.db.blog.findAndCountAll({
                where: query
            });

            let meta = {
                total: totalCount.count,
                offset: offset ? parseInt(offset) : 0,
                limit: limit ? parseInt(limit) : 10
            }

            req.$scope.meta = meta;
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
    let meta = req.$scope.meta;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: blogs,
        meta: meta
    };

    res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getSearchBlogs;
module.exports.response = response;
