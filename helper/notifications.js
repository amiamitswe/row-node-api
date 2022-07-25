/*
 * Title: notifications library
 * Description: Important function to notify users
 * Author: Amit Samadder (Abir)
 * Date: 26/07/2022
 * Time: 00:38:18
 *
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environment');

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
  // input validation
  const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
  const userMsg =
    typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    // configure the request payload
    const payload = { Form: twilio.formPhone, To: `+88${userPhone}`, Body: userMsg };

    // stringify the payload
    const stringifyPayload = querystring.stringify(payload);

    // configure the request details
    const requestDetails = {
      hostname: 'api.twilio.com',
      method: 'POST',
      path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
      auth: `${twilio.accountSID}:${twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    // instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // get status code
      const status = res.statusCode;

      // callback successfully if true
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`status code ${status}`);
      }
    });

    req.on('error', (e) => {
      callback(e);
    });
    req.write(stringifyPayload);
    req.end();
  } else {
    callback('Given parm were missing or invalid');
  }
};

// module exports
module.exports = notifications;
