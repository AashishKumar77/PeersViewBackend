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
function validateParams (req, res, next) {
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
function getJobs (req, res, next) {
  let user = req.$scope.user;
  let offset = req.$params.offset;
  let limit = req.$params.limit;
  let title = req.$params.title;
  let country = req.$params.country;
  let province = req.$params.province;
  let city = req.$params.city;
  let companyName = req.$params.companyName;
  let jobType = req.$params.jobType;
  let industries = req.$params.industries ? req.$params.industries.split(',') : null;
  let hiringCompanies = req.$params.hiringCompanies;
  let workAuthorization = req.$params.workAuthorization;
  let sequelize = req.db.job.sequelize;

  let query = {};

  if (title) {
    query.title = {
      [req.Op.like]: `%${title}%`
    };
  }

  if (country) {
    query.country = {
      [req.Op.like]: `%${country}%`
    }
  }

  if (province) {
    query.province = {
      [req.Op.like]: `%${province}%`
    }
  }

  if (city) {
    query.city = {
      [req.Op.like]: `%${city}%`
    }
  }

  if (companyName) {
    query.company = {
      [req.Op.like]: `%${companyName}%`
    }
  }

  if (industries && industries.length) {
    query.industryId = {
      [req.Op.in]: industries
    }
  }

  return req.db.job.findAll({
    attributes: {
      include: [
        'id',
        'title',
        'company',
        'company_bio',
        'country',
        'city',
        'contact',
        'type',
        'experience',
        'jobfunction',
        'deadline',
        'source_link',
        'price',
        'currency',
        'userId',
        'createdAt',
        [sequelize.where(sequelize.col('job.country'), user.country), 'isSelfCountry']
      ]
    },
    where: query,
    offset: !offset ? 0 : parseInt(offset),
    limit: !limit ? 30 : parseInt(limit),
    order: [['createdAt', 'DESC']]
  })
  .then(async (jobs) => {
    let count = await req.db.job.count({where: query});
    req.$scope.jobs = jobs;
    req.$scope.total = count;
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
 * This would be the fallback if the user existed
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
function getPJobs (req, res, next) {
  let offset = req.$params.offset;
  let limit = req.$params.limit;
  let title=req.$params.title;
  let country = req.$params.country;
  let city = req.$params.city;
  let companyName = req.$params.companyName;
  let jobType = req.$params.jobType;
  let industries = req.$params.industries ? req.$params.industries.split(',') : null;
  let hiringCompanies = req.$params.hiringCompanies;
  let workAuthorization = req.$params.workAuthorization;
  let sequelize = req.db.job.sequelize;

  let query = {};

  if (title) {
    query.title = {
      [req.Op.like]: `%${title}%`
    };
  }

  if (country) {
    query.country = {
      [req.Op.like]: `%${country}%`
    }
  }

  if (city) {
    query.city = {
      [req.Op.like]: `%${city}%`
    }
  }

  if (companyName) {
    query.company = {
      [req.Op.like]: `%${companyName}%`
    }
  }

  if (industries && industries.length) {
    query.industryId = {
      [req.Op.in]: industries
    }
  }

  return req.db.job.findAll({
    attributes: {
      include: [
        'id',
        'title',
        'company',
        'company_bio',
        'country',
        'city',
        'contact',
        'type',
        'experience',
        'jobfunction',
        'deadline',
        'source_link',
        'price',
        'currency',
        'userId',
        'createdAt'
      ]
    },
    where: query,
    offset: !offset ? 0 : parseInt(offset),
    limit: !limit ? 30 : parseInt(limit),
    order: [['createdAt', 'DESC']]
  })
  .then(async (jobs) => {
    let count = await req.db.job.count({where: query});
    req.$scope.jobs = jobs;
    req.$scope.total = count;
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
function response (req, res) {
  let jobs = req.$scope.jobs;
  let total = req.$scope.total;
  let body = {
    status: 'SUCCESS',
    status_code: 0,
    http_code: 200,
    data: {
      jobs: jobs,
      total: total
    }
  };

  res.status(200).send(body);
}

module.exports.validateParams = validateParams;
module.exports.logic = getJobs;
module.exports.getPJobs = getPJobs;
module.exports.response = response;
