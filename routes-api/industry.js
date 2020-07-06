'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function industryApi (apiRouter) {
  apiRouter.get('/industries',
    lib.params,
    handlers.industry.getIndustries.logic,
    handlers.industry.getIndustries.response);
}

module.exports = industryApi;
