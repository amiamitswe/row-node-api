/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Amit Samadder (Abir)
 * Date: 16/04/2022
 * Time: 00:39:59
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperty, callBack) => {
  console.log(requestProperty);

  callBack(200, {
    message: 'This is sample handler api response',
    data: requestProperty.queryStringObj,
  });
};

module.exports = handler;
