'use strict';
module.exports = function anonymous(data) {
  var out = '\n';
  for (var ext in data.ns) {
    var x = data.ns[ext];
    var sample =
      x.example ||
      data.utils.getSample(x.schema, data.options, { quiet: true }, data.api);
    out +=
      '\n\n' +
      data.tags.section +
      '\n\n## ' +
      ext +
      '\n> ' +
      ext +
      ' example\n```json\n' +
      JSON.stringify(sample, null, 2) +
      '\n```\n```yaml\n' +
      data.utils.yaml.stringify(sample) +
      '\n```\n\n';
    if (x.provider && x.provider !== data.defaultProvider) {
      out +=
        '\nProvider: <a href="' +
        x.provider.url +
        '">' +
        x.provider.name +
        '</a>\n';
    }
    out += '\n\n';
    if (x.deprecated) {
      out +=
        '\n<aside class="warning">\nThis extension is deprecated and should be transitioned out of use.\n</aside>\n';
    }
    out += '\n\n';
    if (x.summary) {
      out += '*' + x.summary + '*';
    }
    out += '\n\n' + (x.description || '') + '\n\n';
    var blocks = data.utils.schemaToArray(x.schema, 0, { trim: true }, data);
    out += '\n\n';
    if (x.externalDocs) {
      out +=
        '\n<a href="' +
        x.externalDocs.url +
        '">' +
        x.externalDocs.description +
        '</a>\n';
    }
    out += '\n\n';
    if (x.location) {
      out += '\n<a href="' + x.location + '">Authoritative definition</a>\n';
    }
    out += '\n\n';
    var arr1 = blocks;
    if (arr1) {
      var block,
        i1 = -1,
        l1 = arr1.length - 1;
      while (i1 < l1) {
        block = arr1[(i1 += 1)];
        out += '\n|Property|Type|Required|Description\n|---|---|---|---|\n';
        var arr2 = block.rows;
        if (arr2) {
          var p,
            i2 = -1,
            l2 = arr2.length - 1;
          while (i2 < l2) {
            p = arr2[(i2 += 1)];
            out +=
              '|' +
              p.name +
              '|' +
              p.type +
              '|' +
              p.required +
              '|' +
              data.utils.join(p.description || '') +
              '|\n';
          }
        }
        out += '\n';
      }
    }
    out += '\n\n';
    if (x.oas2) {
      out +=
        '\n**In the OpenAPI specification v2.0, this extension can be used as follows:**\n';
      data.linkBase =
        'https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md';
      out += '\n';
      data.usage = x.oas2;
      data.descs = data.oas2_descs;
      out += '\nundefined\n';
    }
    out += '\n\n';
    if (x.oas2) {
      out +=
        '\n**In the OpenAPI specification v3.x, this extension can be used as follows:**\n';
      data.linkBase =
        'https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md';
      out += '\n';
      data.usage = x.oas3;
      data.descs = data.oas3_descs;
      out += '\nundefined\n';
    }
    out += '\n\n';
  }
  out += '\n\n' + data.tags.endSection + '\n';
  return out;
};
