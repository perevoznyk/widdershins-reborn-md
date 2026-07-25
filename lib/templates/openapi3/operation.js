'use strict';
module.exports = function anonymous(data) {
  var out =
    '' + data.tags.section + '\n\n## ' + data.operationUniqueName + '\n\n';
  if (data.operation.operationId) {
    out += '\n<a id="opId' + data.operation.operationId + '"></a>\n';
  }
  out += '\n\n';
  data.methodUpper = data.method.verb.toUpperCase();
  out += '\n';
  data.url = data.utils.slashes(data.baseUrl + data.method.path);
  out += '\n';
  data.parameters = data.operation.parameters;
  out += '\n';
  data.enums = [];
  out += '\n';
  data.utils.fakeProdCons(data);
  out += '\n';
  data.utils.fakeBodyParameter(data);
  out += '\n';
  data.utils.mergePathParameters(data);
  out += '\n';
  data.utils.getParameters(data);
  out += '\n\n';
  if (data.options.codeSamples || data.operation['x-code-samples']) {
    out += '\n> Code samples\n\n' + data.utils.getCodeSamples(data) + '\n';
  }
  out += '\n\n`' + data.methodUpper + ' ' + data.method.path + '`\n\n';
  if (data.operation.summary && !data.options.tocSummary) {
    out += '*' + data.operation.summary + '*';
  }
  out += '\n\n';
  if (data.operation.description) {
    out += '' + data.operation.description;
  }
  out += '\n\n';
  if (data.operation.requestBody) {
    out += '\n> Body parameter\n\n';
    if (data.bodyParameter.exampleValues.description) {
      out += '\n> ' + data.bodyParameter.exampleValues.description + '\n';
    }
    out += '\n\n' + data.utils.getBodyParameterExamples(data) + '\n';
  }
  out += '\n\n';
  if (data.parameters && data.parameters.length) {
    out += '\nundefined\n';
  }
  out += '\n\nundefined\n\nundefined\n\n';
  data.security = data.operation.security
    ? data.operation.security
    : data.api.security;
  out += '\n';
  if (data.security && data.security.length) {
    out += '\nundefined\n';
  } else {
    out += '\nundefined\n';
  }
  out += '\n' + data.tags.endSection + '\n';
  return out;
};
