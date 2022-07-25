/*
 * Title: Handle environments
 * Description: Handle all environment related things
 * Author: Amit Samadder (Abir)
 * Date: 17/04/2022
 * Time: 01:07:51
 *
 */

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
  port: 4000,
  envName: 'staging',
  secreteKay: 'sfsfasfdfdsfdfgsdssfgdsfdgdsf',
  maxLimit: 5,
  twilio: {
    formPhone: '+8812345676543',
    accountSID: 'AC82cfb1288f5f2d1aa925cd7d4df295a6',
    authToken: 'cec5c9983f5620a5849cf8ee0385262f',
  },
};

environments.development = {
  port: 3000,
  envName: 'development',
  secreteKay: 'ddfgdfghytjyujhgdfhgjhgfrrtge',
  maxLimit: 5,
  twilio: {
    formPhone: '+8812345676543',
    accountSID: 'AC82cfb1288f5f2d1aa925cd7d4df295a6',
    authToken: 'cec5c9983f5620a5849cf8ee0385262f',
  },
};

environments.production = {
  port: 6000,
  envName: 'production',
  secreteKay: 'sfweregdfvbcbbfyhtythfgbfghfg',
  maxLimit: 5,
  twilio: {
    formPhone: '+8812345676543',
    accountSID: 'AC82cfb1288f5f2d1aa925cd7d4df295a6',
    authToken: 'cec5c9983f5620a5849cf8ee0385262f',
  },
};

// check which environment passed
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development';

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.development;

// module exports
module.exports = environmentToExport;
