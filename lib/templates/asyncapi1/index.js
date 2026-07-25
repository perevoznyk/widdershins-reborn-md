'use strict';
const templates = ["code_go","code_java","code_javascript","code_nodejs","code_python","code_ruby","discovery","main","translations"].reduce((acc, name) => {
  acc[name] = require('./' + name + '.js');
  return acc;
}, {});
module.exports = templates;
