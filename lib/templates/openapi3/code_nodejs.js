'use strict';
module.exports = function anonymous(data) {
  var out = "const fetch = require('node-fetch');\n";
  if (data.bodyParameter.present) {
    out += 'const inputBody = ' + data.bodyParameter.exampleValues.json + ';';
  }
  out += '\n';
  if (data.allHeaders.length) {
    out += 'const headers = {\n';
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
    out += '};\n';
  }
  out +=
    "\nfetch('" +
    data.url +
    data.requiredQueryString +
    "',\n{\n  method: '" +
    data.methodUpper +
    "'";
  if (data.bodyParameter.present || data.allHeaders.length) {
    out += ',';
  }
  out += '\n';
  if (data.bodyParameter.present) {
    out += '  body: JSON.stringify(inputBody)';
  }
  if (data.bodyParameter.present && data.allHeaders.length) {
    out += ',';
  }
  out += '\n';
  if (data.allHeaders.length) {
    out += '  headers: headers';
  }
  out +=
    '\n})\n.then(function(res) {\n    return res.json();\n}).then(function(body) {\n    console.log(body);\n});\n';
  return out;
};
