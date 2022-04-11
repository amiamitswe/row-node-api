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
    // response handle
    res.end('hello world !');
};

// start the server
app.createServer();
