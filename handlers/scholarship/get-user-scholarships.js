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
function getUserScholarships(req, res, next) {
    let user = req.$scope.user;
    let userId = req.$params.userId || req.$scope.user.id;
    let offset = req.$params.offset;
    let limit = req.$params.limit;
    let sequelize = req.db.scholarship.sequelize;

    return req.db.scholarship.findAll({
        attributes: {
            include: [
                'id',
                'title',
                'details',
                'country',
                'city',
                'contact',
                'type',
                'eligibility_requirements',
                'benefits',
                'deadline',
                'source_link',
                'price',
                'currency',
                'userId',
                'createdAt',
                [sequelize.where(sequelize.col('scholarship.country'), user.country), 'isSelfCountry']
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
        .then((scholarships) => {
            req.$scope.scholarships = scholarships;
            next();
            return scholarships;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'scholarship.getScholarship Error - get-scholarship');
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
    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: scholarships
    };

    res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getUserScholarships;
module.exports.response = response;
