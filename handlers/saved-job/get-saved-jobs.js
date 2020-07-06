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
        userId: {
            optional: true
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
function getSavedJobs(req, res, next) {
    let user = req.$scope.user;
    let userId = req.$params.userId || req.$scope.user.id;
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let sequelize = req.db.job.sequelize;

    return req.db.savedJob.findAll({
        attributes: {
            include: [
                'id',
                'jobId',
                'userId',
                'status',
                'createdAt'
            ]
        },
        include: [
            {
                model: req.db.job,
                as: 'job'
            }
        ],
        where: {
            userId: {
                [req.Op.eq]: userId
            }
        },
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
            }, 'job.getJob Error - get-job');
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
module.exports.logic = getSavedJobs;
module.exports.response = response;
