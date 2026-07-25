'use strict';
module.exports = function anonymous(data) {
  var out = '';
  if (data.usage.usage === 'restricted') {
    out +=
      '\n<aside class="warning">\nThe extension may only be used in the following objects:\n</aside>\n\n|Object|Description|\n|---|---|\n';
    var arr1 = data.usage.objectTypes;
    if (arr1) {
      var ot,
        i1 = -1,
        l1 = arr1.length - 1;
      while (i1 < l1) {
        ot = arr1[(i1 += 1)];
        out +=
          '|<a href="' +
          data.linkBase +
          '#' +
          data.utils.linkCase(ot) +
          '">' +
          ot +
          '</a>|' +
          (data.descs[data.utils.linkCase(ot)] || 'Description not found') +
          '|\n';
      }
    }
    out += '\n';
  }
  out += '\n\n';
  if (data.usage.usage === 'unrestricted') {
    out +=
      '\n<aside class="success">\nThe extension may be used in any object which allows specification extensions.\n</aside>\n';
  }
  out += '\n\n';
  if (data.usage.usage === 'prohibited') {
    out +=
      '\n<aside class="error">\nThe extension may NOT be used in this version of the specification.\n</aside>\n';
  }
  out += '\n\n';
  return out;
};
