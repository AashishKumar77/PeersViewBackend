'use strict';

/**
 * @author Jo-Ries Canino
 * @description Update User Name
 */

const lib = require('../../lib');

function updateGeneralSetting (req, res, next) {

  let bodySchema = {
    firstName: {
      notEmpty: {
        errorMessage: 'Missing Resource: First Name'
      },
    },
    lastName: {
      notEmpty: {
        errorMessage: 'Missing Resource: Last Name'
      }
    },
    language: {
      notEmpty: {
        errorMessage: 'Missing Resource: Language'
      }
    },
    birthDate: {
      notEmpty: {
        errorMessage: 'Missing Resource: Birth Date'
      }
    },
    country: {
      notEmpty: {
        errorMessage: 'Missing Resource: Country'
      }
    },
    city: {
      notEmpty: {
        errorMessage: 'Missing Resource: City'
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
    let user = req.$scope.user;

    let data = {
      firstName: req.$params.firstName,
      lastName: req.$params.lastName,
      language: req.$params.language,
      birthDate: req.$params.birthDate,
      country: req.$params.country,
      city: req.$params.city
    };

    switch (user.userTypeId) {
      case 1:
        data.schoolName = req.$params.school;
        data.graduate_at = req.$params.graduate_at;
        break;
      case 2:
        data.company = req.$params.company;
        break;
      case 3:
        data.institutionName = req.$params.institution;
        data.website = req.$params.website;
        break;
    }

    req.db.user.update(data, {
      where: {
        id: {
          [req.Op.eq]: user.id
        }
      }
    })
    .then(data => {
      if (user.userTypeId !== 1) {return;}

      req.db.userCourse.destroy({
        where: {
            userId: {
              [req.Op.eq]: user.id
            }
        }
      })
      .then(() => {
        let course = {
          userId: user.id,
          courseId: req.$params.courseId
        };
        return req.db.userCourse.create(course);
      })
      .catch(error => {
        res.status(500)
        .send(new lib.rpc.InternalError(error));
  
        req.log.error({
          err: error.message
        }, 'course.destroy Error - course-destroy');
      });
    })
    .then(userCourse => {
      let body = {
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        data: req.$scope.user
      };

      res.status(200).send(body);
    })
    .catch(error => {
      res.status(500)
      .send(new lib.rpc.InternalError(error));
  
      req.log.error({
        err: error.message
      }, 'user.update Error - update-user-name');
    });
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));
  });
}

function updateSocialLinks (req, res, next) {

  let user = req.$scope.user;
  let facebook_profile = req.$params.facebook_profile;
  let twitter_profile = req.$params.twitter_profile;
  let instagram_profile = req.$params.instagram_profile;
  let snapchat_profile = req.$params.snapchat_profile;

  req.db.user.update({
    facebook_profile: facebook_profile,
    twitter_profile: twitter_profile,
    instagram_profile: instagram_profile,
    snapchat_profile: snapchat_profile
  }, {
    where: {
      id: {
        [req.Op.eq]: user.id
      }
    }
  })
  .then(user => {
    let body = {
      status: 'SUCCESS',
      status_code: 0,
      http_code: 200,
      data: user
    };
  
    res.status(200).send(body);
  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));

    req.log.error({
      err: error.message
    }, 'user.update Error - update-user-name');
  });
}

module.exports.updateGeneralSetting = updateGeneralSetting;
module.exports.updateSocialLinks = updateSocialLinks;
