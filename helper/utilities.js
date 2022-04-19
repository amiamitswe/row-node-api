/*
 * Title: utilities
 * Description: important utilities functions
 * Author: Amit Samadder (Abir)
 * Date: 19/04/2022
 * Time: 01:27:57
 *
 */

// dependencies
const crypto = require('crypto');
const environment = require('./environment');

// module scaffolding
const utilities = {};

// parse json data from string data
utilities.parseJSON = (jsonString) => {
    let outputData;

    try {
        outputData = JSON.parse(jsonString);
    } catch {
        outputData = {};
    }

    return outputData;
};

// hash string data
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environment.secreteKay).update(str).digest('hex');
        return hash;
    }

    return false;
};

// module exports
module.exports = utilities;
