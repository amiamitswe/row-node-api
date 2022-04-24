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
        typeof body.password === 'string' && body.password.trim().length > 0
            ? body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err, res) => {
            if (!err && res) {
                const userData = { ...parseJSON(res) };

                const matchPassword = userData.password === hash(password);

                if (matchPassword) {
                    const tokenId = createRandomString(50);
                    const expireIn = new Date() + 60 * 60 * 1000;
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
handler._token.get = (requestProperty, callback) => {};

// handle put request
handler._token.put = (requestProperty, callback) => {};

// handle delete request
handler._token.delete = (requestProperty, callback) => {};

// module exports
module.exports = handler;
