'use strict';
const templates = ['ext', 'main', 'translations', 'usage'].reduce(
  (acc, name) => {
    acc[name] = require('./' + name + '.js');
    return acc;
  },
  {}
);
module.exports = templates;
