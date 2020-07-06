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
        jobId: {
            notEmpty: {
                errorMessage: 'Missing Resource: Job Id'
            }
        },
        status: {
            optional: true
        }
    };

    req.checkBody(bodySchema);
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
function postSavedJob(req, res, next) {
    let user = req.$scope.user;
    let jobId = req.$params.jobId;
    let status = req.$params.status;

    return req.db.savedJob.create({
        userId: user.id,
        jobId: jobId,
        status: status ? status : 'interview'
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
            }, 'post.create Error - post-post');
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
module.exports.logic = postSavedJob;
module.exports.response = response;
