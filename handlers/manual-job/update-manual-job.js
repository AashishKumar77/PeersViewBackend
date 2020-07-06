'use strict';

/**
 * @author Alex Lu
 * @description Post Job
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
        company: {
            optional: true,
            isLength: {
                options: [{
                    min: 1,
                    max: 255
                }],
                errorMessage: `Invalid Resource: Minimum 1 and maximum 280 characters are allowed`
            }
        },
        jobfunction: {
            notEmpty: {
                errorMessage: 'Missing Resource: Job Function'
            }
        },
        deadline: {
            optional: true
        },
        source_link: {
            notEmpty: {
                errorMessage: 'Missing Resource: Source Link'
            }
        },
        status: {
            optional: true
        }
    };

    req.checkBody(bodySchema);

    let paramsSchema = {
        jobId: {
            isInt: {
                errorMessage: 'Invalid Resource: Job Id'
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
function updateManualJob(req, res, next) {
    let jobId = req.$params.jobId
    let user = req.$scope.user;
    let title = req.$params.title;
    let company = req.$params.company;
    let jobfunction = req.$params.jobfunction;
    let deadline = req.$params.deadline;
    let source_link = req.$params.source_link;
    let status = req.$params.status;

    return req.db.manualJob.update({
        userId: user.id,
        title: title,
        company: company,
        company_bio: company_bio,
        country: country,
        city: city,
        industry: industry,
        contact: contact,
        type: type,
        experience: experience,
        jobfunction: jobfunction,
        deadline: deadline,
        source_link: source_link,
        status: status
    }, {
        where: {
            id: jobId
        }
    })
        .then(job => {
            req.$scope.job = job;
            next();
            return job;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'job.create Error - update-job');
        });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let job = req.$scope.job;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 201,
        data: job
    };

    res.status(201).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = updateManualJob;
module.exports.response = response;
