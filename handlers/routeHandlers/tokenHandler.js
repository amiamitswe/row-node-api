/*
 * Title: token handler
 * Description: Handle token related things
 * Author: Amit Samadder (Abir)
 * Date: 24/04/2022
 * Time: 23:40:29
 *
 */

// dependencies

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
    callback(200, { message: 'this is form post' });
};

// handle get request
handler._token.get = (requestProperty, callback) => {};

// handle put request
handler._token.put = (requestProperty, callback) => {};

// handle delete request
handler._token.delete = (requestProperty, callback) => {};

// module exports
module.exports = handler;
