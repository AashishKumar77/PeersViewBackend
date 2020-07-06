'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function jobApi (apiRouter) {
  apiRouter.get('/jobs',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.getJobs.validateParams,
    handlers.job.getJobs.logic,
    handlers.job.getJobs.response);
  
  apiRouter.get('/jobs/user-jobs',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.getUserJobs.validateParams,
    handlers.job.getUserJobs.logic,
    handlers.job.getUserJobs.response);

  apiRouter.get('/job/search',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.getSearchJobs.validateParams,
    handlers.job.getSearchJobs.logic,
    handlers.job.getSearchJobs.response);

  apiRouter.get('/jobs/p-jobs',
    handlers.job.getJobs.validateParams,
    handlers.job.getJobs.getPJobs,
    handlers.job.getJobs.response
  );

  apiRouter.get('/job/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.getJob.validateParams,
    handlers.job.getJob.logic,
    handlers.job.getJob.response);
  
  apiRouter.delete('/job/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.deleteJob.validateParams,
    handlers.job.deleteJob.logic,
    handlers.job.deleteJob.response);

  apiRouter.post('/job/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.updateJob.validateParams,
    handlers.job.updateJob.logic,
    handlers.job.updateJob.response);

  apiRouter.post('/job',
    lib.params,
    lib.isTokenExist.user,
    handlers.job.postJob.validateParams,
    handlers.job.postJob.logic,
    handlers.job.postJob.response);

  // Manual Job Routes
  apiRouter.get('/manualJobs',
    lib.params,
    lib.isTokenExist.user,
    handlers.manualJob.getManualJobs.validateParams,
    handlers.manualJob.getManualJobs.logic,
    handlers.manualJob.getManualJobs.response);
  
  apiRouter.post('/manualJob',
    lib.params,
    lib.isTokenExist.user,
    handlers.manualJob.postManualJob.validateParams,
    handlers.manualJob.postManualJob.logic,
    handlers.manualJob.postManualJob.response);

  apiRouter.get('/manualJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.manualJob.getManualJob.validateParams,
    handlers.manualJob.getManualJob.logic,
    handlers.manualJob.getManualJob.response);
  
  apiRouter.delete('/manualJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.manualJob.deleteManualJob.validateParams,
    handlers.manualJob.deleteManualJob.logic,
    handlers.manualJob.deleteManualJob.response);

  apiRouter.post('/manualJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.manualJob.updateManualJob.validateParams,
    handlers.manualJob.updateManualJob.logic,
    handlers.manualJob.updateManualJob.response);

  // Saved Job Routes
  apiRouter.get('/savedJobs',
    lib.params,
    lib.isTokenExist.user,
    handlers.savedJob.getSavedJobs.validateParams,
    handlers.savedJob.getSavedJobs.logic,
    handlers.savedJob.getSavedJobs.response);
  
  apiRouter.post('/savedJob',
    lib.params,
    lib.isTokenExist.user,
    handlers.savedJob.postSavedJob.validateParams,
    handlers.savedJob.postSavedJob.logic,
    handlers.savedJob.postSavedJob.response);

  apiRouter.get('/savedJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.savedJob.getSavedJob.validateParams,
    handlers.savedJob.getSavedJob.logic,
    handlers.savedJob.getSavedJob.response);
  
  apiRouter.delete('/savedJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.savedJob.deleteSavedJob.validateParams,
    handlers.savedJob.deleteSavedJob.logic,
    handlers.savedJob.deleteSavedJob.response);

  apiRouter.post('/savedJob/:jobId',
    lib.params,
    lib.isTokenExist.user,
    handlers.savedJob.updateSavedJob.validateParams,
    handlers.savedJob.updateSavedJob.logic,
    handlers.savedJob.updateSavedJob.response);

}

module.exports = jobApi;
