'use strict';
module.exports = function anonymous(data) {
  var out =
    '' +
    data.tags.section +
    '\n\n# ' +
    data.api.info.title +
    ' ' +
    data.version +
    '\n\n> Scroll down for ';
  if (data.header.language_tabs.length) {
    out += 'code samples, ';
  }
  out += 'example headers and payloads.';
  if (data.header.language_tabs.length) {
    out +=
      ' Select a language for code samples from the tabs above or the mobile navigation menu.';
  }
  out += '\n\n';
  if (data.api.info.description) {
    out += '' + data.api.info.description;
  }
  out += '\n\nBase URLs:\n';
  var arr1 = data.api.servers;
  if (arr1) {
    var s,
      i1 = -1,
      l1 = arr1.length - 1;
    while (i1 < l1) {
      s = arr1[(i1 += 1)];
      out += '\n';
      if (s.url.indexOf(':\/\/') < 0) {
        out +=
          '\n* <a href="' +
          s.scheme +
          '://' +
          s.url +
          '">' +
          s.scheme +
          '://' +
          s.url +
          '</a>\n';
      } else {
        out += '\n* <a href="' + s.url + '">' + s.url + '</a>\n';
      }
      out += '\n';
      for (var v in s.variables) {
        out +=
          '\n    * **' + v + '** - ' + (s.variables[v].description || '') + ' ';
        if (s.variables[v].default) {
          out += 'Default: ' + s.variables[v].default;
        }
        out += '\n';
        if (s.variables[v].enum) {
          out += '\n';
          var arr2 = s.variables[v].enum;
          if (arr2) {
            var e,
              i2 = -1,
              l2 = arr2.length - 1;
            while (i2 < l2) {
              e = arr2[(i2 += 1)];
              out += '\n        * ' + e;
            }
          }
          out += '\n';
        }
        out += '\n';
      }
      out += '\n';
    }
  }
  out += '\n\n';
  if (data.api.baseTopic) {
    out += 'Base Topic: **' + data.api.baseTopic + '**';
  }
  out += '\n\n';
  if (data.api.info.termsOfService) {
    out +=
      '<a href="' + data.api.info.termsOfService + '">Terms of service</a>';
  }
  out += '\n';
  if (data.api.info.contact) {
    if (data.api.info.contact.email) {
      out +=
        'Email: <a href="mailto:' +
        data.api.info.contact.email +
        '">' +
        data.contactName +
        '</a> ';
    }
    if (data.api.info.contact.url) {
      out +=
        'Web: <a href="' +
        data.api.info.contact.url +
        '">' +
        data.contactName +
        '</a>';
    }
  }
  out += '\n';
  if (data.api.info.license) {
    if (data.api.info.license.url) {
      out +=
        'License: <a href="' +
        data.api.info.license.url +
        '">' +
        data.api.info.license.name +
        '</a>';
    } else {
      out += 'License: ' + data.api.info.license.name;
    }
  }
  out += '\n' + data.tags.endSection + '\n\n';
  if (data.api.components && data.api.components.securitySchemes) {
    out += '\nundefined\n';
  }
  out += '\n\n';
  for (var r in data.resources) {
    out += '\n';
    var resource = data.resources[r];
    out += '\n\n' + data.tags.section + '\n\n# ' + r + '\n\n';
    for (var t in resource.topics) {
      out += '\n';
      data.topicName = t;
      out += '\n';
      data.topic = resource.topics[t];
      out += '\n\n' + data.tags.section + '\n\n## ' + t + '\n\n';
      if (data.topic.parameters) {
        out +=
          '\n<h3 id="' +
          data.utils.slugify(data.topicName) +
          '-parameters">Parameters</h3>\n\n';
        data.parameters = data.utils.getParameters(data.topic.parameters);
        out +=
          '\n\n|Parameter|In|Type|Required|Description|\n|---|---|---|---|---|\n';
        var arr3 = data.parameters;
        if (arr3) {
          var p,
            i3 = -1,
            l3 = arr3.length - 1;
          while (i3 < l3) {
            p = arr3[(i3 += 1)];
            out +=
              '|' +
              p.name +
              '|' +
              p.in +
              '|' +
              p.safeType +
              '|' +
              p.required +
              '|' +
              (p.shortDesc || 'No description') +
              '|\n';
          }
        }
        out += '\n\n';
      }
      out += '\n\n';
      for (var m in data.topic.messages) {
        out += '\n';
        data.messageName = m;
        out += '\n';
        data.message = data.topic.messages[m];
        out += '\n\nundefined\n\n';
      }
      /* end of messages */ out += '\n\n' + data.tags.endSection + '\n\n';
    }
    /* end of topics */ out += '\n\n' + data.tags.endSection + '\n\n';
  }
  /* end of resources */ out += '\n\n';
  if (data.api.stream) {
    out += '\n';
    data.topicName = 'streaming';
    out +=
      '\n# Streaming API\n\n## Framing\n\nType: ' +
      data.api.stream.framing.type +
      '\nDelimiter: ' +
      (data.api.stream.framing.delimiter || '\r\n') +
      '\n\n';
    if (data.api.stream.read) {
      out += '\n## Read\n';
      var arr4 = data.api.stream.read;
      if (arr4) {
        var r,
          i4 = -1,
          l4 = arr4.length - 1;
        while (i4 < l4) {
          r = arr4[(i4 += 1)];
          out += '\n';
          data.messageName = '';
          out += '\n';
          data.message = r;
          out += '\nundefined\n';
        }
      }
      out += '\n';
    }
    out += '\n\n';
    if (data.api.stream.write) {
      out += '\n## Write\n';
      var arr5 = data.api.stream.write;
      if (arr5) {
        var w,
          i5 = -1,
          l5 = arr5.length - 1;
        while (i5 < l5) {
          w = arr5[(i5 += 1)];
          out += '\n';
          data.messageName = '';
          out += '\n';
          data.message = w;
          out += '\nundefined\n';
        }
      }
      out += '\n';
    }
    out += '\n\n';
  }
  out += '\n\n';
  if (data.api.events) {
    out += '\n# Evented API\n';
    data.topicName = 'evented';
    out += '\n\n';
    if (data.api.events.receive) {
      out += '\n## Received\n';
      var arr6 = data.api.events.receive;
      if (arr6) {
        var r,
          i6 = -1,
          l6 = arr6.length - 1;
        while (i6 < l6) {
          r = arr6[(i6 += 1)];
          out += '\n';
          data.messageName = '';
          out += '\n';
          data.message = r;
          out += '\nundefined\n';
        }
      }
      out += '\n';
    }
    out += '\n\n';
    if (data.api.events.send) {
      out += '\n## Sent\n';
      var arr7 = data.api.events.send;
      if (arr7) {
        var s,
          i7 = -1,
          l7 = arr7.length - 1;
        while (i7 < l7) {
          s = arr7[(i7 += 1)];
          out += '\n';
          data.messageName = '';
          out += '\n';
          data.message = s;
          out += '\nundefined\n';
        }
      }
      out += '\n';
    }
    out += '\n\n';
  }
  out += '\n\n';
  if (data.api.components && data.api.components.schemas) {
    out += '\n\n' + data.tags.section + '\n# Schemas\n\n';
    for (var s in data.api.components.schemas) {
      out += '\n';
      var schema = data.api.components.schemas[s];
      out +=
        '\n\n' +
        data.tags.section +
        '\n\n## ' +
        s +
        '\n\n<a name="schema' +
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
          JSON.stringify(
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
        schema,
        0,
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
      out +=
        '\n\n<h3 id="' +
        data.utils.slugify(s) +
        '-properties">Properties</h3>\n\n';
      var arr8 = blocks;
      if (arr8) {
        var block,
          i8 = -1,
          l8 = arr8.length - 1;
        while (i8 < l8) {
          block = arr8[(i8 += 1)];
          out += '\n';
          if (block.title) {
            out += '\n*' + block.title + '*\n';
          }
          out += '\n|Name|Type|Required|Description|\n|---|---|---|---|\n';
          var arr9 = block.rows;
          if (arr9) {
            var p,
              i9 = -1,
              l9 = arr9.length - 1;
            while (i9 < l9) {
              p = arr9[(i9 += 1)];
              out +=
                '|' +
                p.displayName +
                '|' +
                p.safeType +
                '|' +
                p.required +
                '|' +
                (p.description || 'No description') +
                '|\n';
            }
          }
          out += '\n';
        }
      }
      out += '\n\n';
      if (enums.length > 0) {
        out += '\n#### Enumerated Values\n\n|Property|Value|\n|---|---|\n';
        var arr10 = enums;
        if (arr10) {
          var e,
            i10 = -1,
            l10 = arr10.length - 1;
          while (i10 < l10) {
            e = arr10[(i10 += 1)];
            out += '|' + e.name + '|' + e.value + '|\n';
          }
        }
        out += '\n\n';
      }
      out += '\n\n' + data.tags.endSection + '\n\n';
    }
    /* of schemas */ out += '\n\n' + data.tags.endSection + '\n\n';
  }
  out += '\n\n';
  if (data.options.discovery) {
    out += '\nundefined\n';
  }
  out += '\n\nundefined\n';
  return out;
};
