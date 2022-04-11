/*
 *
 * Title: Uptime monitoring application
 * Description: Uptime monitoring application using row node
 * Author: Amit Samadder (by sumit shaha)
 * Data: 11.04.2022
 *
 */

// dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    // listening server
    server.listen(app.config.port, () => {
        console.log(`listening on port ${app.config.port}`);
    });
};

// handle request and response
app.handleReqRes = (req, res) => {
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

    // response handle
};

// start the server
app.createServer();
