'use strict';

const openapi2 = require('./openapi2.js');
const openapi3 = require('./openapi3.js');
const asyncapi1 = require('./asyncapi1.js');
const asyncapi2 = require('./asyncapi2.js');
const semoasa = require('./semoasa.js');
const apiblueprint = require('./apiblueprint.js');

/**
 * Convert an OpenAPI / Swagger / AsyncAPI / Semoasa / API Blueprint definition to Markdown or HTML.
 *
 * @param {object|string} api - An API definition object (OpenAPI, Swagger, AsyncAPI, Semoasa) or an API Blueprint string.
 * @param {object} [options] - Conversion options.
 * @returns {Promise<string>} The generated Markdown or HTML string.
 */
function convert(api, options) {
  options.samplerErrors = new Map();

  if (typeof api === 'string') {
    return apiblueprint.convert(api, options);
  } else if (api.swagger) {
    return openapi2.convert(api, options);
  } else if (api.openapi) {
    return openapi3.convert(api, options);
  } else if (api.asyncapi) {
    let major = parseInt(String(api.asyncapi).split('.')[0], 10);
    if (major >= 2) {
      return asyncapi2.convert(api, options);
    }
    return asyncapi1.convert(api, options);
  } else if (api.openapiExtensionFormat) {
    return semoasa.convert(api, options);
  } else {
    throw new Error('Unrecognised input format');
  }
}

module.exports = {
  convert: convert,
};
