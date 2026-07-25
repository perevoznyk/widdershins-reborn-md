'use strict';
const templates = [
  'authentication',
  'authentication_none',
  'code_go',
  'code_java',
  'code_javascript',
  'code_nodejs',
  'code_python',
  'code_ruby',
  'discovery',
  'footer',
  'main',
  'message',
  'security',
  'translations',
].reduce((acc, name) => {
  acc[name] = require('./' + name + '.js');
  return acc;
}, {});
module.exports = templates;
