/*
 * Title: Not found handler
 * Description: 404 not found handler
 * Author: Amit Samadder (Abir)
 * Date: 16/04/2022
 * Time: 00:47:58
 *
 */

const handler = {};

handler.notFoundHandler = (requestProperty, callBack) => {
    callBack(404, {
        message: 'this is 404 not found message',
    });
};

module.exports = handler;
