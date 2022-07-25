/*
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
// const data = require('./lib/data');
const { sendTwilioSms } = require('./helper/notifications');

// app object - module scaffolding
const app = {};

// // TODO: will be removed
sendTwilioSms('01917784210', 'hello test sms', (err) => {
  console.log(err);
});

// // TODO: will be removed
// data.create(
//     'test',
//     'newFile',
//     { name: 'amit', age: 26, occupation: 'Software Engineer' },
//     (err) => {
//         console.log(err);
//     }
// );

// // TODO: will be removed
// data.read('test', 'newFile', (err, result) => {
//     console.log(err, result);
// });

// // TODO: will be removed
// data.update('test', 'newFile', { name: 'abir' }, (err) => {
//     console.log(err);
// });

// // TODO: will be removed
// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// });

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
