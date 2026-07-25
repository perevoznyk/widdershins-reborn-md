'use strict';
module.exports = function anonymous(data) {
  var out =
    '<aside class="warning">\nTo perform this operation, you must be authenticated by means of one of the following methods:\n' +
    data.utils.getAuthenticationStr(data) +
    '\n</aside>\n\n';
  return out;
};
