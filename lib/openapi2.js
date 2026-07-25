'use strict';

const openapi3 = require('./openapi3.js');
const swagger2openapi = require('swagger2openapi');

/** Convert an OpenAPI 2.0 (Swagger) definition to Markdown or HTML. @param {object} api - Swagger 2.0 definition object. @param {object} options - Conversion options. @returns {Promise<string>} Generated Markdown or HTML. */
function convert(api, options) {
  return swagger2openapi
    .convertObj(api, {
      patch: true,
      anchors: true,
      warnOnly: true,
      resolve: options.resolve,
      verbose: options.verbose,
      source: options.source,
      rbname: options.useBodyName ? 'x-body-name' : '',
      refSiblings: 'preserve',
    })
    .then(sOptions => {
      options.resolve = false; // done now
      return openapi3.convert(sOptions.openapi, options);
    })
    .catch(err => {
      if (options.verbose) {
        console.error(err);
      } else {
        console.error(err.message);
      }
      throw err;
    });
}

module.exports = {
  convert: convert,
};
