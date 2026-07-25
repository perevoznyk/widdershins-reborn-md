'use strict';
const templates = [
  'authentication',
  'authentication_none',
  'callbacks',
  'code_csharp',
  'code_go',
  'code_http',
  'code_java',
  'code_javascript',
  'code_jquery',
  'code_nodejs',
  'code_php',
  'code_python',
  'code_ruby',
  'code_shell',
  'debug',
  'discovery',
  'footer',
  'links',
  'main',
  'operation',
  'parameters',
  'responses',
  'security',
  'translations',
].reduce((acc, name) => {
  acc[name] = require('./' + name + '.js');
  return acc;
}, {});
module.exports = templates;
