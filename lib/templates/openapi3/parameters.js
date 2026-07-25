'use strict';
module.exports = function anonymous(data) {
  var out =
    '' +
    data.tags.section +
    '\n<h3 id="' +
    data.operationUniqueSlug +
    '-parameters">Parameters</h3>\n\n|Name|In|Type|Required|Description|\n|---|---|---|---|---|\n';
  var arr1 = data.parameters;
  if (arr1) {
    var p,
      i1 = -1,
      l1 = arr1.length - 1;
    while (i1 < l1) {
      p = arr1[(i1 += 1)];
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
        (p.shortDesc || 'none') +
        '|\n';
    }
  }
  out += '\n\n';
  if (data.longDescs) {
    out += '\n#### Detailed descriptions\n';
    var arr2 = data.parameters;
    if (arr2) {
      var p,
        i2 = -1,
        l2 = arr2.length - 1;
      while (i2 < l2) {
        p = arr2[(i2 += 1)];
        if (p.shortDesc !== p.description) {
          out += '\n**' + p.name + '**: ' + p.description;
        }
        out += '\n';
      }
    }
    out += '\n';
  }
  out += '\n\n';
  var arr3 = data.parameters;
  if (arr3) {
    var p,
      i3 = -1,
      l3 = arr3.length - 1;
    while (i3 < l3) {
      p = arr3[(i3 += 1)];
      out += '\n\n';
      if (p.schema && p.schema.enum) {
        out += '\n';
        var arr4 = p.schema.enum;
        if (arr4) {
          var e,
            i4 = -1,
            l4 = arr4.length - 1;
          while (i4 < l4) {
            e = arr4[(i4 += 1)];
            out += '\n';
            var entry = {};
            entry.name = p.name;
            entry.value = e;
            data.enums.push(entry);
            out += '\n';
          }
        }
        out += '\n';
      }
      out += '\n\n';
      if (p.schema && p.schema.items && p.schema.items.enum) {
        out += '\n';
        var arr5 = p.schema.items.enum;
        if (arr5) {
          var e,
            i5 = -1,
            l5 = arr5.length - 1;
          while (i5 < l5) {
            e = arr5[(i5 += 1)];
            out += '\n';
            var entry = {};
            entry.name = p.name;
            entry.value = e;
            data.enums.push(entry);
            out += '\n';
          }
        }
        out += '\n';
      }
      out += '\n\n';
    }
  }
  out += '\n\n';
  if (data.enums && data.enums.length) {
    out += '\n#### Enumerated Values\n\n|Parameter|Value|\n|---|---|\n';
    var arr6 = data.enums;
    if (arr6) {
      var e,
        i6 = -1,
        l6 = arr6.length - 1;
      while (i6 < l6) {
        e = arr6[(i6 += 1)];
        out += '|' + e.name + '|' + data.utils.toPrimitive(e.value) + '|\n';
      }
    }
    out += '\n';
  }
  out += '\n' + data.tags.endSection + '\n';
  return out;
};
