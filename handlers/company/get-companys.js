/*eslint-disable max-len*/
'use strict';

/**
 * @author Raju KC
 * @description Get a specific company
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
function validateParams (req, res, next) {
  let paramsSchema = {
    q: {
        optional: true
    },
    region: {
        optional: true
    },
    limit: {
      optional: true
    },
    offset: {
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
function getCompanys (req, res, next) {

  let company = req.$params.company;
  let offset = req.$params.offset;
  let limit = req.$params.limit;
  let region = req.$params.region;

  let query = {};

  if (company) {
    query.company = {
      [req.Op.like]: `%${company}%`
    };
  }

  if (region) {
    query.country = {
      [req.Op.like]: `%${region}%`
    }
  }

  return req.db.company.findAll({
    attributes: {
      include: [
        'id',
        'company',
        'company_bio',
        'company_contact',
        'recruit',
        'country',
        'city',
        'createdAt',
        'logo'
      ]
    },
    include: [{
      model: req.db.companyAttachment,
      attributes: ['id', 'cloudinaryPublicId','usage']
    }],
    where: query,
    offset: !offset ? 0 : parseInt(offset),
    limit: !limit ? 30 : parseInt(limit),
    order: [['createdAt', 'DESC']]
  })
  .then(async (companys) => {
    let count = await req.db.company.count({});
    req.$scope.companys = companys;
    req.$scope.total = count;
    next();
    return companys;
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'company.getCompanys Error - get-company');
  });
}

/**
 * This would be the fallback if the user existed
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
function getPCompanys (req, res, next) {
  let offset = req.$params.offset;
  let limit = req.$params.limit;
  let company=req.$params.company;
  let region = req.$params.region;

  let query = {};

  if (company) {
    query.company = {
      [req.Op.like]: `%${company}%`
    };
  }

  if (region) {
    query.country = {
      [req.Op.like]: `%${region}%`
    }
  }

  return req.db.company.findAll({
    attributes: {
      include: [
        'id',
        'company',
        'company_bio',
        'country',
        'city',
        'company_contact',
        'recruit',
        'createdAt',
        'logo'
      ]
    },
    where: query,
    offset: !offset ? 0 : parseInt(offset),
    limit: !limit ? 30 : parseInt(limit),
    order: [['createdAt', 'DESC']]
  })
  .then(async (companys) => {
    let count = await req.db.company.count({});
    req.$scope.companys = companys;
    req.$scope.total = count;
    next();
    return companys;
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'company.getCompany Error - get-company');
  });
}

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
function response (req, res) {
  let companys = req.$scope.companys;
  let total = req.$scope.total;
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: {
      companys: companys,
      total: total
    }
  };

  res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getCompanys;
module.exports.getPCompanys = getPCompanys;
module.exports.response = response;
