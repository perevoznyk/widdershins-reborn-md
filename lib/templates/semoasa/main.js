'use strict';
module.exports = function anonymous(data) {
  var out =
    '' + data.tags.section + '\n\n# OpenAPI Extensions Documentation\n\n';
  if (data.header.language_tabs.length) {
    out +=
      '> Scroll down for schema examples. Select a format for examples from the tabs above or the mobile navigation menu.';
  }
  out +=
    '\n\nThis documentation was automatically generated from a v' +
    data.api.openapiExtensionFormat +
    ' [Semoasa](https://github.com/RepreZen/SEMOASA) document.\n\n<abbr title="Specification Extension Metadata for OAS Annotations">Semoasa</abbr> is a machine-readable format for extensions to Swagger/OpenAPI 2.0 and 3.0 specifications.\n\n';
  for (var ns in data.api) {
    out += '\n  ';
    if (ns !== 'openapiExtensionFormat' && ns !== 'components') {
      out += '\n  ';
      data.ns = data.api[ns];
      out += '\n\n' + data.tags.section + '\n\n# ' + ns + '\n\n';
      var first = Object.keys(data.ns)[0];
      data.defaultProvider = data.ns[first].provider;
      out += '\n\n';
      if (data.defaultProvider) {
        out +=
          '\nProvider: <a href="' +
          data.defaultProvider.url +
          '">' +
          data.defaultProvider.name +
          '</a>\n';
      }
      out += '\n\nundefined\n\n' + data.tags.endSection + '\n\n  ';
    }
    /* of if */ out += '\n';
  }
  /* of for */ out += '\n\n' + data.tags.endSection + '\n';
  return out;
};
