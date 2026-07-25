'use strict';
module.exports = function anonymous(data) {
  var out = '';
  if (data.allHeaders.length) {
    out += 'var headers = {\n';
    var arr1 = data.allHeaders;
    if (arr1) {
      var p,
        index = -1,
        l1 = arr1.length - 1;
      while (index < l1) {
        p = arr1[(index += 1)];
        out += "  '" + p.name + "':" + p.exampleValues.json;
        if (index < data.allHeaders.length - 1) {
          out += ',';
        }
        out += '\n';
      }
    }
    out += '\n};\n';
  }
  out +=
    "\n$.ajax({\n  url: '" +
    data.url +
    "',\n  method: '" +
    data.method.verb +
    "',\n";
  if (data.requiredQueryString) {
    out += "  data: '" + data.requiredQueryString + "',";
  }
  out += '\n';
  if (data.allHeaders.length) {
    out += '  headers: headers,';
  }
  out +=
    '\n  success: function(data) {\n    console.log(JSON.stringify(data));\n  }\n})\n';
  return out;
};
