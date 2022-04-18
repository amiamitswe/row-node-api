/*
 * Title: User handler
 * Description: Handle user related things
 * Author: Amit Samadder (Abir)
 * Date: 19/04/2022
 * Time: 00:40:19
 *
 */

// dependencies

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
        typeof requestProperty.body.fName === 'string' &&
        requestProperty.body.fName.trim().length > 0
            ? requestProperty.body.fName
            : false;

    const lastName =
        typeof requestProperty.body.lName === 'string' &&
        requestProperty.body.lName.trim().length > 0
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
        callback(200, { res: 'ok' });
    } else {
        callback(400, { error: 'you have problem on your request' });
    }
};

// handler get request
handler._users.get = (requestProperty, callback) => {
    callback(200, { test: 'get' });
};

// module exports
module.exports = handler;
