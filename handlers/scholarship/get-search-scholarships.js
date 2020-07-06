/*eslint-disable max-len*/
'use strict';

/**
 * @author Alex Lu
 * @description Get a specific Scholarship
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
        r: {
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
function getSearchScholarships(req, res, next) {
    let userId = req.$params.userId || req.$scope.user.id;
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let title = req.$params.q;
    let region = null;
    if (req.$params.r && req.$params.r != "") {
        region = req.$params.r;
    }

    let query = {};

    if (title && title != "") {
        query.title = {
            [req.Op.like]: `%${title}%`
        };
    }

    if (region && region != "") {
        query.country = {
            [req.Op.like]: `%${region}%`
        }
    }

    return req.db.scholarship.findAll({
        where: query,
        offset: !offset ? 0 : parseInt(offset),
        limit: !limit ? 10 : parseInt(limit),
        order: [['createdAt', 'DESC']]
    })
        .then(async (scholarships) => {
            let totalCount = await req.db.scholarship.findAndCountAll({
                where: query
            });

            let meta = {
                total: totalCount.count,
                offset: offset ? parseInt(offset) : 0,
                limit: limit ? parseInt(limit) : 10
            }

            req.$scope.meta = meta;
            req.$scope.scholarships = scholarships;
            next();
            return scholarships;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'scholarship.getSearchScholarships Error - get-search-scholarships');
        });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let scholarships = req.$scope.scholarships;
    let meta = req.$scope.meta;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: scholarships,
        meta: meta
    };

    res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getSearchScholarships;
module.exports.response = response;
