/*eslint-disable max-statements,max-lines*/
'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function campusAdminApi (apiRouter) {
  
  // apiRouter.put('/campus/job/:jobId',
  //   lib.params,
  //   handlers.campus.updateCampusJob.validateParams,
  //   handlers.campus.updateCampusJob.logic,
  //   handlers.campus.updateCampusJob.response);

  // apiRouter.get('/campus/:campusId/marketplace',
  //   lib.params,
  //   lib.isTokenExist.user,
  //   handlers.campus.getCampusMarketplaceList.validateParams,
  //   handlers.campus.getCampusMarketplaceList.logic,
  //   handlers.campus.getCampusMarketplaceList.response);

  // apiRouter.get('/campus/marketplace/:marketplaceId',
  //   lib.params,
  //   lib.isTokenExist.user,
  //   handlers.campus.getCampusMarketplace.validateParams,
  //   handlers.campus.getCampusMarketplace.logic,
  //   handlers.campus.getCampusMarketplace.response);

  // apiRouter.post('/campus/:campusId/marketplace',
  //   lib.params,
  //   lib.isTokenExist.user,
  //   handlers.campus.postCampusMarketplace.validateParams,
  //   handlers.campus.postCampusMarketplace.logic,
  //   handlers.campus.postCampusMarketplace.saveCampusAttachments,
  //   handlers.campus.postCampusMarketplace.response);

  // apiRouter.delete('/marketplace/:marketplaceId',
  //   lib.params,
  //   handlers.campus.removeCampusMarketplace.validateParams,
  //   lib.isTokenExist.user,
  //   handlers.campus.removeCampusMarketplace.logic,
  //   handlers.campus.removeCampusMarketplace.response);

  apiRouter.get('/campus-admin/online-user-status',
    lib.params,
    lib.isTokenExist.user,
    handlers.campusAdmin.getOnlineUserStatus.logic,
    handlers.campusAdmin.getOnlineUserStatus.response);
}

module.exports = campusAdminApi;
