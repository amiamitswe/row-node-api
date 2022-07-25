/*
 * Title: Server lib
 * Description: server related files
 * Author: Amit Samadder (by sumit shaha)
 * Data: 11.04.2022
 * update: 26.07.2022
 *
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('../helper/handleReqRes');
const environment = require('../helper/environment');
// const data = require('./lib/data');

// server object - module scaffolding
const server = {};
// create server
server.createServer = () => {
  const createServerV = http.createServer(server.handleReqRes);
  // listening server
  createServerV.listen(environment.port, () => {
    console.log(`listening on port ${environment.port}`);
  });
};

// handle request and response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};
// export default
module.exports = server;
