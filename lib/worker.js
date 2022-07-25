/*
 * Title: Workers lib
 * Description: Workers related files
 * Author: Amit Samadder (by sumit shaha)
 * Data: 11.04.2022
 * update: 26.07.2022
 *
 */

// dependencies
const data = require('./data');

// worker object - module scaffolding
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
  // get all the checks
};

// timer to run worker in every minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};
// start the worker
worker.init = () => {
  worker.gatherAllChecks();

  // call the loop for continue
  worker.loop();
};
// export default
module.exports = worker;
