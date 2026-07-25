'use strict';
const templates = ["main","translations"].reduce((acc, name) => {
  acc[name] = require('./' + name + '.js');
  return acc;
}, {});
module.exports = templates;
