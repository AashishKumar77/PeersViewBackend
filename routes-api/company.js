'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function companyApi (apiRouter) {
  apiRouter.get('/companys',
    lib.params,
    handlers.company.getCompanys.validateParams,
    handlers.company.getCompanys.logic,
    handlers.company.getCompanys.response);

  apiRouter.get('/company/:companyId',
    lib.params,
    handlers.company.getCompany.validateParams,
    handlers.company.getCompany.logic,
    handlers.company.getCompany.response);

  apiRouter.delete('/company/:companyId',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.deleteCompany.validateParams,
    handlers.company.deleteCompany.logic,
    handlers.company.deleteCompany.response);

  apiRouter.post('/company/:companyId',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.updateCompany.validateParams,
    handlers.company.updateCompany.logic,
    handlers.company.updateCompany.saveAttachments,
    handlers.company.updateCompany.response);

  apiRouter.post('/company',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.postCompany.validateParams,
    handlers.company.postCompany.logic,
    handlers.company.postCompany.saveAttachments,
    handlers.company.postCompany.response);

  apiRouter.get('/company/admin/all',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.getCompanyAdmin.logic,
    handlers.company.getCompanyAdmin.response);

  apiRouter.get('/company/user/all',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.getCompanyUser.logic,
    handlers.company.getCompanyUser.response);

  apiRouter.get('/company/right/list',
  lib.params,
  lib.isTokenExist.user,
  handlers.company.getCompanyRight.logic,
  handlers.company.getCompanyRight.response);

  apiRouter.get('/company/suggestion/list',
    lib.params,
    handlers.company.getSuggestedCompany.logic,
    handlers.company.getSuggestedCompany.response);

  apiRouter.delete('/company/attachment/:attachmentId',
    lib.params,
    lib.isTokenExist.user,
    handlers.company.deleteCompanyAttachment.validateParams,
    handlers.company.deleteCompanyAttachment.logic,
    handlers.company.deleteCompanyAttachment.response);

}
module.exports = companyApi;
