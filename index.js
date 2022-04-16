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
const { handleReqRes } = require('./helper/handleReqRes');
const environment = require('./helper/environment');

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    // listening server
    server.listen(environment.port, () => {
        console.log(`listening on port ${environment.port}`);
    });
};

// handle request and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
