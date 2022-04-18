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
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

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

    const requestProperty = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        headerObj,
        queryStringObj,
    };

    const decoder = new StringDecoder('utf-8');

    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperty.body = parseJSON(realData);

        chosenHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            // stringify payload data
            const payloadString = JSON.stringify(payload);

            // sent json as response content type
            res.setHeader('Content-type', 'application/json');

            // write status code on head
            res.writeHead(statusCode);

            // end stringify payload by sending response
            res.end(payloadString);
        });
    });
};

module.exports = handler;
