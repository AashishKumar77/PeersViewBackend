'use strict';

/**
 * @author Alex Lu
 * @description Post Scholarship
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
        details: {
            notEmpty: {
                errorMessage: 'Missing Resource: Scholarship Function'
            }
        },
        country: {
            optional: true,
            isLength: {
                options: [{
                    min: 1,
                    max: 255
                }],
                errorMessage: `Invalid Resource: Minimum 1 and maximum 280 characters are allowed`
            }
        },
        city: {
            optional: true,
            isLength: {
                options: [{
                    min: 1,
                    max: 255
                }],
                errorMessage: `Invalid Resource: Minimum 1 and maximum 280 characters are allowed`
            }
        },
        contact: {
            optional: true,
            isLength: {
                options: [{
                    min: 1,
                    max: 255
                }],
                errorMessage: `Invalid Resource: Minimum 1 and maximum 280 characters are allowed`
            }
        },
        type: {
            notEmpty: {
                errorMessage: 'Missing Resource: Type'
            },
            isInt: {
                errorMessage: 'Invalid Resource: type'
            }
        },
        benefits: {
            notEmpty: {
                errorMessage: 'Missing Resource: Experience'
            }
        },
        eligibility_requirements: {
            notEmpty: {
                errorMessage: 'Missing Resource: Scholarship Function'
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
        price: {
            notEmpty: {
                errorMessage: 'Missing Resource: Price'
            }
        },
        currency: {
            notEmpty: {
                errorMessage: 'Missing Resource: Currency'
            }
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
function postScholarship(req, res, next) {
    let user = req.$scope.user;
    let title = req.$params.title;
    let details = req.$params.details;
    let country = req.$params.country;
    let city = req.$params.city;
    let contact = req.$params.contact;
    let type = req.$params.type;
    let eligibility_requirements = req.$params.eligibility_requirements;
    let benefits = req.$params.benefits;
    let deadline = req.$params.deadline;
    let source_link = req.$params.source_link;
    let price = req.$params.price;
    let currency = req.$params.currency;

    return req.db.scholarship.create({
        userId: user.id,
        title: title,
        details: details,
        country: country ? country : user.country,
        city: city,
        contact: contact,
        type: type,
        eligibility_requirements: eligibility_requirements,
        benefits: benefits,
        deadline: deadline,
        source_link: source_link,
        price: price,
        currency: currency
    })
        .then(scholarship => {
            req.$scope.scholarship = scholarship;
            next();
            return scholarship;
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
    let scholarship = req.$scope.scholarship;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 201,
        data: scholarship
    };

    res.status(201).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = postScholarship;
module.exports.response = response;
