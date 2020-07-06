'use strict';

/**
 * @author Raju KC
 * @description Post Company
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
        company_type: {
            optional: true
        },
        company_size: {
            optional: true
        },
        company_contact: {
            optional: true
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
        recruit: {
            notEmpty: {
                errorMessage: 'Missing Resource: Recruit'
            }
        },
        industry: {
            optional: true
        },
        company_bio: {
            optional: true,
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
function postCompany(req, res, next) {
    let user = req.$scope.user;
    let company = req.$params.company;
    let company_type = req.$params.company_type;
    let company_size = req.$params.company_size;
    let company_contact = req.$params.company_contact;
    let country = req.$params.country;
    let city = req.$params.city;
    let recruit = req.$params.recruit;
    let industry = req.$params.industry;
    let company_bio = req.$params.company_bio;
    let logo = req.$params.logo;

    return req.db.company.create({
        company: company,
        company_type: company_type,
        company_size: company_size,
        company_contact: company_contact,
        country: country,
        city: city,
        recruit: recruit,
        industry: industry,
        company_bio: company_bio,
        logo: logo,
        userId: user.id
    })
        .then(company => {
            req.$scope.company = company;
            next();
            return company;
        })
        .catch(error => {
            res.status(500)
                .send(new lib.rpc.InternalError(error));

            req.log.error({
                err: error.message
            }, 'post.create Error - post-post');
        });
}

function saveAttachments (req, res, next) {
    let company = req.$scope.company;
    let cloudinary = req.$params.companyAttachments
      ? req.$params.companyAttachments : [];
    let attachments = [];

    if (cloudinary.length === 0) {
      return next();
    }

    cloudinary.forEach(item => {
      attachments.push({
        companyId: company.id,
        cloudinaryPublicId: item.cloudinaryPublicId,
        usage: item.usage
      });
    });

    return req.db.companyAttachment.bulkCreate(attachments)
    .then(attachment => {
      next();
      return attachment;
    })
    .catch(error => {
      res.status(500)
      .send(new lib.rpc.InternalError(error));

      req.log.error({
        err: error.message
      }, 'attachment.bulkCreate Error - post-community-post');
    });
  }


/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response(req, res) {
    let company = req.$scope.company;

    let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 201,
        data: company
    };

    res.status(201).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = postCompany;
module.exports.saveAttachments = saveAttachments;
module.exports.response = response;
