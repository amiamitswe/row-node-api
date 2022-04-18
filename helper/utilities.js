/*
 * Title: utilities
 * Description: important utilities functions
 * Author: Amit Samadder (Abir)
 * Date: 19/04/2022
 * Time: 01:27:57
 *
 */

// dependencies

// module scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
    let outputData;

    try {
        outputData = JSON.parse(jsonString);
    } catch {
        outputData = {};
    }

    return outputData;
};

// module exports
module.exports = utilities;
