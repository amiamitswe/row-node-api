/*
 * Title: User handler
 * Description: Handle user related things
 * Author: Amit Samadder (Abir)
 * Date: 19/04/2022
 * Time: 00:40:19
 *
 */

// dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helper/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperty, callback) => {
  const acceptedMethod = ['get', 'post', 'put', 'delete'];
  if (acceptedMethod.indexOf(requestProperty.method) > -1) {
    handler._users[requestProperty.method](requestProperty, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

// handler post request
handler._users.post = (requestProperty, callback) => {
  const firstName =
    typeof requestProperty.body.fName === 'string' && requestProperty.body.fName.trim().length > 0
      ? requestProperty.body.fName
      : false;

  const lastName =
    typeof requestProperty.body.lName === 'string' && requestProperty.body.lName.trim().length > 0
      ? requestProperty.body.lName
      : false;

  const phone =
    typeof requestProperty.body.phone === 'string' &&
    requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : false;
  const password =
    typeof requestProperty.body.password === 'string' &&
    requestProperty.body.password.trim().length > 0
      ? requestProperty.body.password
      : false;
  const accept =
    typeof requestProperty.body.accept === 'boolean' ? requestProperty.body.accept : false;

  if (firstName && lastName && phone && password && accept) {
    data.read('users', phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          accept,
        };
        data.create('users', phone, userObject, (errCreate) => {
          if (!errCreate) {
            callback(200, { message: 'user create success' });
          } else {
            callback(500, { error: 'user creation failed' });
          }
        });
      } else {
        callback(404, { error: 'user already exist' });
      }
    });
  } else {
    callback(400, { error: 'you have problem on your request' });
  }
};

// handler get request
handler._users.get = (requestProperty, callback) => {
  const { phone } = requestProperty.queryStringObj;

  const tokenID =
    typeof requestProperty.headerObj.token === 'string' ? requestProperty.headerObj.token : false;
  // check phone is valid and length is equal 11
  if (typeof phone === 'string' && phone.trim().length === 11) {
    tokenHandler._token.verify(tokenID, phone, (tokenRes) => {
      if (tokenRes) {
        // find the user
        data.read('users', phone, (err, res) => {
          if (!err && res) {
            const userData = { ...parseJSON(res) };
            delete userData.password;

            callback(200, userData);
          } else {
            callback(404, { error: `no data found in this ${phone}` });
          }
        });
      } else {
        callback(403, { error: 'you are not authenticate' });
      }
    });
  } else {
    callback(404, { error: 'phone no is not correct' });
  }
};

// handler put request for update
handler._users.put = (requestProperty, callback) => {
  const { body } = requestProperty;

  const phone =
    typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

  const firstName =
    typeof body.fName === 'string' && body.fName.trim().length > 0 ? body.fName : false;

  const lastName =
    typeof body.lName === 'string' && body.lName.trim().length > 0 ? body.lName : false;

  const password =
    typeof body.password === 'string' && body.password.trim().length > 0 ? body.password : false;

  const tokenID =
    typeof requestProperty.headerObj.token === 'string' ? requestProperty.headerObj.token : false;

  // check phone is valid and length is equal 11
  if (phone) {
    tokenHandler._token.verify(tokenID, phone, (tokenRes) => {
      if (tokenRes) {
        if (firstName || lastName || password) {
          // read data from fs
          data.read('users', phone, (err, userData) => {
            // copy data and marse to json

            if (!err && userData) {
              const updateData = { ...parseJSON(userData) };
              if (firstName) {
                updateData.firstName = firstName;
              }
              if (lastName) {
                updateData.lastName = lastName;
              }
              if (password) {
                updateData.password = hash(password);
              }

              // update data
              data.update('users', phone, updateData, (updateErr) => {
                if (!updateErr) {
                  callback(200, { message: 'user update success' });
                } else {
                  callback(500, { error: 'there is a problem on server' });
                }
              });
            } else {
              callback(404, { error: 'no user exist' });
            }
          });
        } else {
          callback(400, { error: 'you have problem on your request' });
        }
      } else {
        callback(403, { error: 'you are not authenticate' });
      }
    });
  } else {
    callback(400, { error: 'phone no is not correct' });
  }
};

// handle delete request
handler._users.delete = (requestProperty, callback) => {
  const { phone } = requestProperty.queryStringObj;
  const tokenID =
    typeof requestProperty.headerObj.token === 'string' ? requestProperty.headerObj.token : false;

  // check phone is valid and length is equal 11
  if (typeof phone === 'string' && phone.trim().length === 11) {
    tokenHandler._token.verify(tokenID, phone, (tokenRes) => {
      if (tokenRes) {
        // read data from fs
        data.read('users', phone, (err, userData) => {
          if (!err && userData) {
            data.delete('users', phone, (deleteErr) => {
              if (!deleteErr) {
                callback(200, { message: 'user deleted successfully' });
              } else {
                callback(500, { error: 'some thing wrong' });
              }
            });
          } else {
            callback(404, { error: 'user not found' });
          }
        });
      } else {
        callback(403, { error: 'you are not authenticate' });
      }
    });
  } else {
    callback(400, { error: 'phone number is incorrect' });
  }
};

// module exports
module.exports = handler;
