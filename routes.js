/*
 * Title: Router
 * Description: Application Router
 * Author: Amit Samadder (Abir)
 * Date: 16/04/2022
 * Time: 00:41:36
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    sample: sampleHandler,
};
module.exports = routes;
