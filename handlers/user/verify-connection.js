'use strict';

/**
 * @author Jo-Ries Canino
 * @description PUT User
 */

const lib = require('../../lib');
const templates = require('../../templates');

/**
 * Validation of req.body, req, param,
 * and req.query
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
function verifyConnection (req, res, next) {
  let bodySchema = {
    token: {
      notEmpty: {
        errorMessage: 'Missing Resource: Token'
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

    let token = req.$params.token;

    req.db.userFollower.findAll({
        where: {
            token: {
                [req.Op.eq]: token
            }
        }
    }).then(follows => {
      console.log('follows:'+JSON.stringify(follows));
        if(follows.length === 0) {
            res.status(500)
            .send('Not Found');

            req.log.error({
              err: error.message
            }, 'user - verify connection');
        } else {
          console.log('isVerified:'+JSON.stringify(follows));

            req.db.userFollower.update({isVerified: true}, {
                where: {
                  token: {
                    [req.Op.eq]: token
                }
               }
              })
              .then(follows => {
                let body = {
                    status: 'SUCCESS',
                    status_code: 1,
                    http_code: 200
                };
                console.log('body:'+JSON.stringify(body));

                res.status(200).send(body);

              })
              .catch(error => {
                res.status(500)
                .send(new lib.rpc.InternalError(error));

                req.log.error({
                  err: error.message
                }, 'user - verified connection error');
              });
        }
    }).catch(error => {
        res.status(500)
        .send(new lib.rpc.InternalError(error));

        req.log.error({
          err: error.message
        }, 'user - verified connection error');
    })


  })
  .catch(error => {
    res.status(500)
    .send(new lib.rpc.InternalError(error));
  });
}

module.exports.logic = verifyConnection;
