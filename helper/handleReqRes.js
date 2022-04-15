/* eslint-disable no-unused-vars */
/*
 * Title: Handle request and response
 * Description: Handle request and response
 * Author: Amit Samadder (Abir)
 * Date: 16/04/2022
 * Time: 00:20:41
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // gat the url and parse it
    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const headerObj = req.headers;
    const queryStringObj = parsedUrl.query;

    const decoder = new StringDecoder('utf-8');

    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        res.end('hello world !');
    });
    // // some console for result
    // console.log(parsedUrl);
    // console.log(path);
    // console.log(trimmedPath);
    // console.log(method);
    // console.log(headerObj);
    // console.log(queryStringObj);

    // response handle
};

module.exports = handler;
