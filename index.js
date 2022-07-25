/*
 * Title: Project Initial file
 * Description: start server and worker
 * Author: Amit Samadder (by sumit shaha)
 * Data: 11.04.2022
 * update: 26.07.2022
 *
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object - module scaffolding
const app = {};

// initiate the server and worker
app.init = () => {
  // start the server
  server.init();

  // start the workers
  workers.init();
};

// call the init
app.init();

// export default
module.exports = app;
