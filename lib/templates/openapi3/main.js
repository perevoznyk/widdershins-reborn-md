'use strict';
module.exports = function anonymous(data) {
  var out =
    '' +
    data.tags.section +
    '\n<h1 id="' +
    data.title_prefix +
    '">' +
    (data.api.info && data.api.info.title) +
    ' ' +
    data.version +
    '</h1>\n\n> Scroll down for ';
  if (data.header.language_tabs.length) {
    out += 'code samples, ';
  }
  out += 'example requests and responses.';
  if (data.header.language_tabs.length) {
    out +=
      ' Select a language for code samples from the tabs above or the mobile navigation menu.';
  }
  out += '\n\n';
  if (data.api.info && data.api.info.description) {
    out += '' + data.api.info.description;
  }
  out += '\n\n';
  if (data.api.servers) {
    out += '\nBase URLs:\n';
    var arr1 = data.api.servers;
    if (arr1) {
      var s,
        i1 = -1,
        l1 = arr1.length - 1;
      while (i1 < l1) {
        s = arr1[(i1 += 1)];
        out += '\n* <a href="' + s.url + '">' + s.url + '</a>\n';
        for (var v in s.variables) {
          out +=
            '\n    * **' +
            v +
            '** - ' +
            (s.variables[v].description || '') +
            ' Default: ' +
            s.variables[v].default +
            '\n';
          if (s.variables[v].enum) {
            out += '\n';
            var arr2 = s.variables[v].enum;
            if (arr2) {
              var e,
                i2 = -1,
                l2 = arr2.length - 1;
              while (i2 < l2) {
                e = arr2[(i2 += 1)];
                out += '\n        * ' + e + '\n';
              }
            }
            out += '\n';
          }
          out += '\n';
        }
        out += '\n';
      }
    }
    out += '\n';
  }
  out += '\n\n';
  if (data.api.info && data.api.info.termsOfService) {
    out +=
      '<a href="' + data.api.info.termsOfService + '">Terms of service</a>';
  }
  out += '\n';
  if (data.api.info && data.api.info.contact) {
    if (data.api.info.contact.email) {
      out +=
        'Email: <a href="mailto:' +
        data.api.info.contact.email +
        '">' +
        (data.api.info.contact.name || 'Support') +
        '</a> ';
    }
    if (data.api.info.contact.url) {
      out +=
        'Web: <a href="' +
        data.api.info.contact.url +
        '">' +
        (data.api.info.contact.name || 'Support') +
        '</a> ';
    }
  }
  out += '\n';
  if (data.api.info && data.api.info.license) {
    if (data.api.info.license.url) {
      out +=
        'License: <a href="' +
        data.api.info.license.url +
        '">' +
        data.api.info.license.name +
        '</a>';
    } else {
      out += ' License: ' + data.api.info.license.name;
    }
  }
  out += '\n' + data.tags.endSection + '\n\n';
  if (data.api.components && data.api.components.securitySchemes) {
    out += '\nundefined\n';
  }
  out += '\n\n';
  for (var r in data.resources) {
    out += '\n';
    data.resource = data.resources[r];
    out +=
      '\n\n' +
      data.tags.section +
      '\n<h1 id="' +
      (data.title_prefix + '-' + data.utils.slugify(r)) +
      '">' +
      r +
      '</h1>\n\n';
    if (data.resource.description) {
      out += '' + data.resource.description;
    }
    out += '\n\n';
    if (data.resource.externalDocs) {
      out +=
        '\n<a href="' +
        data.resource.externalDocs.url +
        '">' +
        (data.resource.externalDocs.description || 'External documentation') +
        '</a>\n';
    }
    out += '\n\n';
    for (var m in data.resource.methods) {
      out += '\n';
      data.operationUniqueName = m;
      out += '\n';
      data.method = data.resource.methods[m];
      out += '\n';
      data.operationUniqueSlug = data.method.slug;
      out += '\n';
      data.operation = data.method.operation;
      out += '\n' + data.templates.operation(data) + '\n';
    }
    /* of methods */ out += '\n\n' + data.tags.endSection + '\n';
  }
  /* of resources */ out += '\n\n';
  if (data.api.components && data.api.components.schemas) {
    out += '\n' + data.tags.section + '\n\n# Schemas\n\n';
    for (var s in data.components.schemas) {
      out += '\n';
      var origSchema = data.components.schemas[s];
      out += '\n';
      var schema = data.api.components.schemas[s];
      out +=
        '\n\n' +
        data.tags.section +
        '\n<h2 id="tocS_' +
        s +
        '">' +
        s +
        '</h2>\n';
      /* backwards compatibility */ out +=
        '\n<a id="schema' +
        s.toLowerCase() +
        '"></a>\n<a id="schema_' +
        s +
        '"></a>\n<a id="tocS' +
        s.toLowerCase() +
        '"></a>\n<a id="tocs' +
        s.toLowerCase() +
        '"></a>\n\n';
      if (data.options.yaml) {
        out +=
          '\n```yaml\n' +
          data.utils.yaml.stringify(
            data.utils.getSample(
              schema,
              data.options,
              { quiet: true },
              data.api
            )
          ) +
          '\n';
      } else {
        out +=
          '\n```json\n' +
          data.utils.safejson(
            data.utils.getSample(
              schema,
              data.options,
              { quiet: true },
              data.api
            ),
            null,
            2
          ) +
          '\n';
      }
      out += '\n```\n\n';
      var enums = [];
      out += '\n';
      var blocks = data.utils.schemaToArray(
        origSchema,
        -1,
        { trim: true, join: true },
        data
      );
      out += '\n';
      for (var block of blocks) {
        for (var p of block.rows) {
          if (p.schema && p.schema.enum) {
            for (var e of p.schema.enum) {
              enums.push({ name: p.name, value: e });
            }
          }
        }
      }
      out += '\n\n';
      var arr3 = blocks;
      if (arr3) {
        var block,
          i3 = -1,
          l3 = arr3.length - 1;
        while (i3 < l3) {
          block = arr3[(i3 += 1)];
          out += '\n';
          if (block.title) {
            out += '' + block.title + '\n\n';
          }
          out += '\n';
          if (block.externalDocs) {
            out +=
              '\n<a href="' +
              block.externalDocs.url +
              '">' +
              (block.externalDocs.description || 'External documentation') +
              '</a>\n';
          }
          out += '\n\n';
          if (block === blocks[0]) {
            out += '\n' + data.tags.section + '\n\n### Properties\n';
          }
          out += '\n\n';
          if (block.rows.length) {
            out +=
              '|Name|Type|Required|Restrictions|Description|\n|---|---|---|---|---|';
          }
          out += '\n';
          var arr4 = block.rows;
          if (arr4) {
            var p,
              i4 = -1,
              l4 = arr4.length - 1;
            while (i4 < l4) {
              p = arr4[(i4 += 1)];
              out +=
                '|' +
                p.displayName +
                '|' +
                p.safeType +
                '|' +
                p.required +
                '|' +
                (p.restrictions || 'none') +
                '|' +
                (p.description || 'none') +
                '|\n';
            }
          }
          out += '\n';
        }
      }
      out += '\n';
      if (blocks[0].rows.length === 0 && blocks.length === 1) {
        out += '\n*None*\n';
      }
      out += '\n\n';
      if (enums.length > 0) {
        out +=
          '\n' +
          data.tags.section +
          '\n\n#### Enumerated Values\n\n|Property|Value|\n|---|---|\n';
        var arr5 = enums;
        if (arr5) {
          var e,
            i5 = -1,
            l5 = arr5.length - 1;
          while (i5 < l5) {
            e = arr5[(i5 += 1)];
            out += '|' + e.name + '|' + data.utils.toPrimitive(e.value) + '|\n';
          }
        }
        out += '\n\n' + data.tags.endSection + '\n';
      }
      out +=
        '\n\n' + data.tags.endSection + '\n' + data.tags.endSection + '\n\n';
    }
    /* of schemas */ out += '\n\n';
  }
  out += '\n\nundefined\n\n';
  if (data.options.discovery) {
    out += '\nundefined\n';
  }
  out += '\n';
  return out;
};
