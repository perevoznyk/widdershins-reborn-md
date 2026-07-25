'use strict';
module.exports = function anonymous(data) {
  var out =
    '<aside class="warning">\nTo perform this operation, you must be authenticated by means of one of the following methods:\n';
  var arr1 = data.effectiveSecurity;
  if (arr1) {
    var s,
      i1 = -1,
      l1 = arr1.length - 1;
    while (i1 < l1) {
      s = arr1[(i1 += 1)];
      out += '* ' + Object.keys(s)[0] + '\n';
    }
  }
  out += '\n</aside>\n\n';
  return out;
};
