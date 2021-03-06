/*
 * Title: Check handler
 * Description: Handle user link check related issue
 * Author: Amit Samadder (Abir)
 * Date: 05/06/2022
 * Time: 00:05:42
 *
 */

// dependencies
const { parseJSON, createRandomString } = require('../../helper/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { maxLimit } = require('../../helper/environment');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperty, callback) => {
  const acceptedMethod = ['get', 'post', 'put', 'delete'];

  if (acceptedMethod.indexOf(requestProperty.method) > -1) {
    handler._check[requestProperty.method](requestProperty, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

// post check request
handler._check.post = (requestProperty, callback) => {
  const bodyData = requestProperty.body;
  // validate input
  const protocol =
    typeof bodyData.protocol === 'string' && ['http', 'https'].indexOf(bodyData.protocol) > -1
      ? bodyData.protocol
      : false;

  const url =
    typeof bodyData.url === 'string' && bodyData.url.trim().length > 0 ? bodyData.url : false;

  const method =
    typeof bodyData.method === 'string' &&
    ['get', 'post', 'put', 'delete'].indexOf(bodyData.method.toLowerCase()) > -1
      ? bodyData.method.toLowerCase()
      : false;

  const successCodes =
    typeof bodyData.successCodes === 'object' && bodyData.successCodes instanceof Array
      ? bodyData.successCodes
      : false;
  const timeOutSeconds =
    typeof bodyData.timeOutSeconds === 'number' &&
    bodyData.timeOutSeconds % 1 === 0 &&
    bodyData.timeOutSeconds >= 1 &&
    bodyData.timeOutSeconds <= 5
      ? bodyData.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    const tokenID =
      typeof requestProperty.headerObj.token === 'string' ? requestProperty.headerObj.token : false;

    // lookup the user phone number using token id
    data.read('tokens', tokenID, (err, tokenData) => {
      if (!err && tokenData) {
        const responseTokenData = { ...parseJSON(tokenData) };
        const userPhoneNumber = responseTokenData.phone;

        // look up user data using user phone number get from api data
        data.read('users', userPhoneNumber, (err1, userData) => {
          if (!err1 && userData) {
            // verify token
            tokenHandler._token.verify(tokenID, userPhoneNumber, (tokenRes) => {
              if (tokenRes) {
                const userObject = { ...parseJSON(userData) };
                const userChecks =
                  typeof userObject.checks === 'object' && userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxLimit) {
                  const checkId = createRandomString(20);
                  const checkObj = {
                    _slug: checkId,
                    userPhone: userPhoneNumber,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };

                  data.create('checks', checkId, checkObj, (checkErr) => {
                    if (!checkErr) {
                      userObject.checks = [...userChecks, checkId];
                      data.update('users', userPhoneNumber, userObject, (userUpdateErr) => {
                        if (!userUpdateErr) {
                          callback(200, checkObj);
                        } else {
                          callback(500, {
                            error: 'User update failed',
                          });
                        }
                      });
                    } else {
                      callback(500, { error: 'Check creation failed' });
                    }
                  });
                } else {
                  callback(401, {
                    error: 'you are already reached your max limit',
                  });
                }
              } else {
                callback(403, { error: 'you are not authenticate' });
              }
            });
          } else {
            callback(403, { error: 'User not found' });
          }
        });
      } else {
        callback(403, { error: 'Invalid token id or auth problem' });
      }
    });
  } else {
    callback(400, { error: 'you have problem on your request, make sure all data is available' });
  }
};

// get check request
handler._check.get = (requestProperty, callback) => {
  const checkID =
    typeof requestProperty.queryStringObj.id === 'string' &&
    requestProperty.queryStringObj.id.trim().length === 20
      ? requestProperty.queryStringObj.id
      : false;

  if (checkID) {
    // look for check data
    data.read('checks', checkID, (err, checkData) => {
      if (!err && checkData) {
        const tokenID =
          typeof requestProperty.headerObj.token === 'string'
            ? requestProperty.headerObj.token
            : false;

        tokenHandler._token.verify(tokenID, parseJSON(checkData).userPhone, (tokenRes) => {
          if (tokenRes) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, { error: 'you are not authenticate' });
          }
        });
      } else {
        callback(500, { error: 'Data not found' });
      }
    });
  } else {
    callback(400, { error: 'you have problem on your request' });
  }
};

// put check request
handler._check.put = (requestProperty, callback) => {
  const bodyData = requestProperty.body;

  // validate input
  const slug =
    typeof bodyData._slug === 'string' && bodyData._slug.trim().length === 20
      ? bodyData._slug
      : false;
  const protocol =
    typeof bodyData.protocol === 'string' && ['http', 'https'].indexOf(bodyData.protocol) > -1
      ? bodyData.protocol
      : false;

  const url =
    typeof bodyData.url === 'string' && bodyData.url.trim().length > 0 ? bodyData.url : false;

  const method =
    typeof bodyData.method === 'string' &&
    ['get', 'post', 'put', 'delete'].indexOf(bodyData.method.toLowerCase()) > -1
      ? bodyData.method.toLowerCase()
      : false;

  const successCodes =
    typeof bodyData.successCodes === 'object' && bodyData.successCodes instanceof Array
      ? bodyData.successCodes
      : false;
  const timeOutSeconds =
    typeof bodyData.timeOutSeconds === 'number' &&
    bodyData.timeOutSeconds % 1 === 0 &&
    bodyData.timeOutSeconds >= 1 &&
    bodyData.timeOutSeconds <= 5
      ? bodyData.timeOutSeconds
      : false;

  if (slug) {
    if (protocol || url || method || successCodes || timeOutSeconds) {
      // read check data
      data.read('checks', slug, (checkErr, checkData) => {
        if (!checkErr && checkData) {
          const checkObj = { ...parseJSON(checkData) };
          const tokenID =
            typeof requestProperty.headerObj.token === 'string'
              ? requestProperty.headerObj.token
              : false;
          tokenHandler._token.verify(tokenID, checkObj.userPhone, (tokenRes) => {
            if (tokenRes) {
              if (protocol) {
                checkObj.protocol = protocol;
              }
              if (url) {
                checkObj.url = url;
              }
              if (method) {
                checkObj.method = method;
              }
              if (successCodes) {
                checkObj.successCodes = successCodes;
              }
              if (timeOutSeconds) {
                checkObj.timeOutSeconds = timeOutSeconds;
              }
              // update check data
              data.update('checks', slug, checkObj, (updateErr) => {
                if (!updateErr) {
                  callback(200, checkObj);
                } else {
                  callback(500, { error: 'there is a problem on server' });
                }
              });
            } else {
              callback(403, { error: 'you are not authenticate' });
            }
          });
        } else {
          callback(500, { error: 'Server side error' });
        }
      });
    } else {
      callback(400, { error: 'you have to provide al least one data' });
    }
  } else {
    callback(400, { error: 'you have problem on your request' });
  }
};

// delete check request
handler._check.delete = (requestProperty, callback) => {
  const checkID =
    typeof requestProperty.queryStringObj.id === 'string' &&
    requestProperty.queryStringObj.id.trim().length === 20
      ? requestProperty.queryStringObj.id
      : false;

  if (checkID) {
    // read check data
    data.read('checks', checkID, (checkErr, checkData) => {
      if (!checkErr && checkData) {
        const checkObj = { ...parseJSON(checkData) };
        const tokenID =
          typeof requestProperty.headerObj.token === 'string'
            ? requestProperty.headerObj.token
            : false;
        tokenHandler._token.verify(tokenID, checkObj.userPhone, (tokenRes) => {
          if (tokenRes) {
            // delete check file
            data.delete('checks', checkID, (deleteErr) => {
              if (!deleteErr) {
                // read user data
                data.read('users', checkObj.userPhone, (userErr, userData) => {
                  if (!userErr && userData) {
                    const userObj = { ...parseJSON(userData) };
                    const userChecksArray =
                      typeof [...userObj.checks] === 'object' &&
                      [...userObj.checks] instanceof Array
                        ? [...userObj.checks]
                        : [];

                    const fiendIndexOfCheck = userChecksArray.findIndex(
                      (checkEle) => checkEle === checkID
                    );
                    if (fiendIndexOfCheck !== -1) {
                      userChecksArray.splice(fiendIndexOfCheck, 1);
                      // re save checks
                      userObj.checks = userChecksArray;
                      // update user
                      data.update('users', checkObj.userPhone, userObj, (updateErr) => {
                        if (!updateErr) {
                          callback(200, { message: 'check delete success' });
                        } else {
                          callback(500, {
                            error: 'The check id you are trying is not available in user',
                          });
                        }
                      });
                    } else {
                      callback(500, { error: 'Server side error for user checks' });
                    }
                  } else {
                    callback(500, { error: 'Server side error for user' });
                  }
                });
              } else {
                callback(500, { error: 'Server side error' });
              }
            });
          } else {
            callback(403, { error: 'you are not authenticate' });
          }
        });
      } else {
        callback(500, { error: 'Server side error, check may not found' });
      }
    });
  } else {
    callback(400, { error: 'you have problem on your request' });
  }
};

// module exports
module.exports = handler;
