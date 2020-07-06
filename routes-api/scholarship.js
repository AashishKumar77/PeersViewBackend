'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function scholarshipApi (apiRouter) {
  apiRouter.get('/scholarships',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.getScholarships.validateParams,
    handlers.scholarship.getScholarships.logic,
    handlers.scholarship.getScholarships.response);
  
  apiRouter.get('/scholarships/user-scholarships',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.getUserScholarships.validateParams,
    handlers.scholarship.getUserScholarships.logic,
    handlers.scholarship.getUserScholarships.response);

  apiRouter.get('/scholarship/search',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.getSearchScholarships.validateParams,
    handlers.scholarship.getSearchScholarships.logic,
    handlers.scholarship.getSearchScholarships.response);

  apiRouter.get('/scholarship/:scholarshipId',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.getScholarship.validateParams,
    handlers.scholarship.getScholarship.logic,
    handlers.scholarship.getScholarship.response);
  
  apiRouter.delete('/scholarship/:scholarshipId',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.deleteScholarship.validateParams,
    handlers.scholarship.deleteScholarship.logic,
    handlers.scholarship.deleteScholarship.response);

  apiRouter.post('/scholarship/:scholarshipId',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.updateScholarship.validateParams,
    handlers.scholarship.updateScholarship.logic,
    handlers.scholarship.updateScholarship.response);

  apiRouter.post('/scholarship',
    lib.params,
    lib.isTokenExist.user,
    handlers.scholarship.postScholarship.validateParams,
    handlers.scholarship.postScholarship.logic,
    handlers.scholarship.postScholarship.response);
}

module.exports = scholarshipApi;
