/*
 * Title: Workers lib
 * Description: Workers related files
 * Author: Amit Samadder (by sumit shaha)
 * Data: 11.04.2022
 * update: 26.07.2022
 *
 */

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helper/utilities');
const { sendTwilioSms } = require('../helper/notifications');

// worker object - module scaffolding
const worker = {};

// lookup all the checks
worker.gatherAllChecks = () => {
  // get all the checks
  data.list('checks', (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        // read the check data
        data.read('checks', check, (err1, originalCheckData) => {
          if (!err1 && originalCheckData) {
            // pass the data to the check validator
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log('Error: reading one of checks data');
          }
        });
      });
    } else {
      console.log('Error: could not get any checks');
    }
  });
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
  const originalData = originalCheckData;
  if (originalCheckData && originalCheckData._slug) {
    originalData.state =
      typeof originalCheckData.state === 'string' &&
      ['up', 'down'].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : 'down';

    originalData.lastCheck =
      typeof originalCheckData.lastCheck === 'number' && originalCheckData.lastCheck > 0
        ? originalCheckData.lastCheck
        : false;
    // pass to the next step
    worker.performCheck(originalData);
  } else {
    // console.log(originalData);
    console.log('Error: check is invalid or some error');
  }
};
// perform the check
worker.performCheck = (originalData) => {
  // prepare the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };

  // mark the outcome has not been sent yet
  let outComeSent = false;

  // parse data hostname and url form original data
  const parseUrl = url.parse(`${originalData.protocol}://${originalData.url}`, true);
  const hostName = parseUrl.hostname;
  const { path } = parseUrl;

  // construct the request
  const requestDetails = {
    protocol: `${originalData.protocol}:`,
    hostname: hostName,
    method: originalData.method.toUpperCase(),
    path,
    timeout: originalData.timeOutSeconds * 1000,
  };
  const protocolToUse = originalData.protocol === 'http' ? http : https;
  const req = protocolToUse.request(requestDetails, (res) => {
    // get status code
    const status = res.statusCode;

    // update the check outcome and pass to next
    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutCome(originalData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on('error', (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    // update the check outcome and pass to next
    if (!outComeSent) {
      worker.processCheckOutCome(originalData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on('timeout', () => {
    checkOutCome = {
      error: true,
      value: 'timeout',
    };
    // update the check outcome and pass to next
    if (!outComeSent) {
      worker.processCheckOutCome(originalData, checkOutCome);
      outComeSent = true;
    }
  });

  // req send
  req.end();
};

// process Check Out Come
worker.processCheckOutCome = (originalData, checkOutCome) => {
  // check if checkout come is up or down
  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? 'up'
      : 'down';

  // decide to send alert

  const alertWanted = !!(originalData.lastCheck && originalData.state !== state);

  // update the check data
  const newCheckData = originalData;

  newCheckData.state = state;
  newCheckData.lastCheck = Date.now();

  // update the check to disk
  data.update('checks', newCheckData._slug, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the check data to next process
        worker.alertUserToStateChange(newCheckData);
      } else {
        console.log('alert is not needed');
      }
    } else {
      console.log('error');
    }
  });
};

// send notification to user

worker.alertUserToStateChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`success ${msg}`);
    } else {
      console.log('failed');
    }
  });
};

// timer to run worker in every minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 15000);
};
// start the worker
worker.init = () => {
  worker.gatherAllChecks();

  // call the loop for continue
  worker.loop();
};
// export default
module.exports = worker;
