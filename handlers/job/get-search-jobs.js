/*eslint-disable max-len*/
'use strict';

/**
 * @author Alex Lu
 * @description Get a specific Job
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
function getSearchJobs(req, res, next) {
    let userId = req.$params.userId || req.$scope.user.id;
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let title = req.$params.q;
    let region = req.$params.r;
    console.log(title);
    console.log(offset);
    console.log(limit);
    console.log(region);
    return req.db.job.findAll({
        where: {
            title: {
                [req.Op.like]: `%${title}%`
            },
            country: {
                [req.Op.like]: `%${region}%`
            }
        },
        offset: !offset ? 0 : parseInt(offset),
        limit: !limit ? 10 : parseInt(limit),
        order: [['createdAt', 'DESC']]
    })
        .then((jobs) => {
            req.$scope.jobs = jobs;
            next();
            return jobs;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'job.getSearchJobs Error - get-search-jobs');
        });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let jobs = req.$scope.jobs;
    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: jobs
    };

    res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getSearchJobs;
module.exports.response = response;
