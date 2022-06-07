/*
 * Title: token handler
 * Description: Handle token related things
 * Author: Amit Samadder (Abir)
 * Date: 24/04/2022
 * Time: 23:40:29
 *
 */

// dependencies
const { parseJSON, hash, createRandomString } = require('../../helper/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperty, callback) => {
  const acceptedMethod = ['get', 'put', 'post', 'delete'];

  if (acceptedMethod.indexOf(requestProperty.method) > -1) {
    handler._token[requestProperty.method](requestProperty, callback);
  } else {
    callback(405);
  }
};

// all handlers
handler._token = {};

// handle post request
handler._token.post = (requestProperty, callback) => {
  const { body } = requestProperty;

  const phone =
    typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

  const password =
    typeof body.password === 'string' && body.password.trim().length > 0 ? body.password : false;

  if (phone && password) {
    data.read('users', phone, (err, res) => {
      if (!err && res) {
        const userData = { ...parseJSON(res) };

        const matchPassword = userData.password === hash(password);

        if (matchPassword) {
          const tokenId = createRandomString(50);
          const expireIn = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            phone,
            tokenId,
            expireIn,
          };
          data.create('tokens', tokenId, tokenObject, (err1) => {
            if (!err1) {
              callback(200, tokenObject);
            } else {
              callback(500, { error: 'token generation failed or may exist !' });
            }
          });
        } else {
          callback(404, { error: "phone or password doesn't match" });
        }
      } else {
        callback(400, { error: 'no user found' });
      }
    });
  } else {
    callback(400, { error: 'please provide valid phone and password' });
  }
};

// handle get request
handler._token.get = (requestProperty, callback) => {
  const { tokenId } = requestProperty.queryStringObj;

  if (typeof tokenId === 'string' && tokenId.trim().length === 50) {
    data.read('tokens', tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        const finalTokenData = { ...parseJSON(tokenData) };
        callback(200, finalTokenData);
      } else {
        callback(404, { error: `no data found in this ${tokenId}` });
      }
    });
  } else {
    callback(404, { error: 'Invalid token id' });
  }
};

// handle put request
handler._token.put = (requestProperty, callback) => {
  const { body } = requestProperty;

  const tokenId =
    typeof body.tokenId === 'string' && body.tokenId.trim().length === 50 ? body.tokenId : false;

  const extend = !!(typeof body.extend === 'boolean' && body.extend === true);

  if (tokenId && extend) {
    data.read('tokens', tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        const finalTokenData = { ...parseJSON(tokenData) };

        if (finalTokenData.expireIn > Date.now()) {
          finalTokenData.expireIn = Date.now() + 60 * 60 * 1000;

          data.update('tokens', tokenId, finalTokenData, (err1) => {
            if (!err1) {
              callback(200, { message: 'token update successfully' });
            } else {
              callback(500, { error: 'there is a problem on server' });
            }
          });
        } else {
          callback(404, { error: 'token already expired' });
        }
      } else {
        callback(404, { error: 'no data found' });
      }
    });
  } else {
    callback(404, { error: 'token id invalid or not permit to extend' });
  }
};

// handle delete request
handler._token.delete = (requestProperty, callback) => {
  const { tokenId } = requestProperty.queryStringObj;

  if (typeof tokenId === 'string' && tokenId.trim().length === 50) {
    data.read('tokens', tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokens', tokenId, (deleteErr) => {
          if (!deleteErr) {
            callback(200, { message: 'token delete success' });
          } else {
            callback(500, { error: 'there is a problem on server' });
          }
        });
      } else {
        callback(404, { error: `no data found in this ${tokenId}` });
      }
    });
  } else {
    callback(404, { error: 'token id invalid' });
  }
};

/*
 * Date&Time: 02/06/2022 - 00:40:36
 * Update Description: add token verify handler
 */
// handle token verify
handler._token.verify = (tokenId, phone, callback) => {
  data.read('tokens', tokenId, (err, tokenData) => {
    if (!err && tokenData) {
      const formatTokenData = { ...parseJSON(tokenData) };
      if (formatTokenData.phone === phone && formatTokenData.expireIn > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// module exports
module.exports = handler;
