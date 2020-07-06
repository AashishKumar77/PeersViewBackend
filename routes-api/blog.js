'use strict';

const handlers = require('../handlers');
const lib = require('../lib');

function blogApi (apiRouter) {
  apiRouter.get('/blogs',
    lib.params,
    handlers.blog.getBlogs.validateParams,
    handlers.blog.getBlogs.logic,
    handlers.blog.getBlogs.response);
  
  apiRouter.get('/blogs/user-blogs',
    lib.params,
    lib.isTokenExist.user,
    handlers.blog.getUserBlogs.validateParams,
    handlers.blog.getUserBlogs.logic,
    handlers.blog.getUserBlogs.response);

  apiRouter.get('/blog/search',
    lib.params,
    handlers.blog.getSearchBlogs.validateParams,
    handlers.blog.getSearchBlogs.logic,
    handlers.blog.getSearchBlogs.response);

  apiRouter.get('/blog/get/:blogId',
    lib.params,
    handlers.blog.getBlog.validateParams,
    handlers.blog.getBlog.logic,
    handlers.blog.getBlog.response);

  apiRouter.get('/blog/recent/:blogId',
    lib.params,
    handlers.blog.getRecentBlogs.validateParams,
    handlers.blog.getRecentBlogs.logic,
    handlers.blog.getRecentBlogs.response);

  apiRouter.delete('/blog/:blodId',
    lib.params,
    lib.isTokenExist.user,
    handlers.blog.deleteBlog.validateParams,
    handlers.blog.deleteBlog.logic,
    handlers.blog.deleteBlog.response);

  apiRouter.post('/blog/:blogId',
    lib.params,
    lib.isTokenExist.user,
    handlers.blog.updateBlog.validateParams,
    handlers.blog.updateBlog.logic,
    handlers.blog.updateBlog.response);

  apiRouter.post('/blog',
    lib.params,
    lib.isTokenExist.user,
    handlers.blog.postBlog.validateParams,
    handlers.blog.postBlog.logic,
    handlers.blog.postBlog.response);
}

module.exports = blogApi;
