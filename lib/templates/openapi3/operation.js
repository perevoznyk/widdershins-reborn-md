'use strict';
module.exports = function anonymous(data) {
    var out = '' + (data.tags.section) + '\n\n## ' + (data.method.name) + '\n\n';
    if (data.operation.operationId) {
        out += '\n<a id="opId' + (data.operation.operationId) + '"></a>\n';
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
    out += '\n\n`' + (data.methodUpper) + ' ' + (data.method.path) + '`\n\n';
    if (data.operation.summary && !data.options.tocSummary) {
        out += '__Summary:__\n\n' + (data.operation.summary);
    }
    out += '\n\n';
    if (data.operation.description) {
        out += '__Description:__\n\n' + (data.operation.description);
    }
    out += '\n\n';
    if (data.consumes.length) {
        out += '__Consumes:__\n\n' + (data.consumes[0]) + '\n\n';
    }
    if (data.produces.length) {
        out += '__Produces:__\n\n' + (data.produces[0]);
    }
    out += '\n\n';
    if (data.operation.requestBody) {
        out += '\n*Request body parameter*\n\n';
        if (data.bodyParameter.exampleValues.description) {
            out += '\n ' + (data.bodyParameter.exampleValues.description) + '\n';
        }
        out += '\n\n' + (data.utils.getBodyParameterExamples(data)) + '\n';
    }
    out += '\n\n';
    if (data.parameters && data.parameters.length) {
        out += '\n' + (data.tags.section) + '\n<h3 id="' + (data.operationUniqueSlug) + '-parameters">Parameters</h3>\n\n|Name|In|Type|Required|Description|\n|---|---|---|---|---|\n';
        var arr1 = data.parameters;
        if (arr1) {
            var p, i1 = -1,
                l1 = arr1.length - 1;
            while (i1 < l1) {
                p = arr1[i1 += 1];
                out += '|' + (p.name) + '|' + (p.in) + '|' + (p.safeType) + '|' + (p.required) + '|' + (p.shortDesc || 'none') + '|\n';
            }
        }
        out += '\n\n';
        if (data.longDescs) {
            out += '\n#### Detailed descriptions\n';
            var arr2 = data.parameters;
            if (arr2) {
                var p, i2 = -1,
                    l2 = arr2.length - 1;
                while (i2 < l2) {
                    p = arr2[i2 += 1];
                    if (p.shortDesc !== p.description) {
                        out += '\n**' + (p.name) + '**: ' + (p.description);
                    }
                    out += '\n';
                }
            }
            out += '\n';
        }
        out += '\n\n';
        var arr3 = data.parameters;
        if (arr3) {
            var p, i3 = -1,
                l3 = arr3.length - 1;
            while (i3 < l3) {
                p = arr3[i3 += 1];
                out += '\n\n';
                if (p.schema && p.schema.enum) {
                    out += '\n';
                    var arr4 = p.schema.enum;
                    if (arr4) {
                        var e, i4 = -1,
                            l4 = arr4.length - 1;
                        while (i4 < l4) {
                            e = arr4[i4 += 1];
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
                        var e, i5 = -1,
                            l5 = arr5.length - 1;
                        while (i5 < l5) {
                            e = arr5[i5 += 1];
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
                var e, i6 = -1,
                    l6 = arr6.length - 1;
                while (i6 < l6) {
                    e = arr6[i6 += 1];
                    out += '|' + (e.name) + '|' + (data.utils.toPrimitive(e.value)) + '|\n';
                }
            }
            out += '\n';
        }
        out += '\n' + (data.tags.endSection) + '\n\n';
    }
    out += '\n\n';
    data.responses = data.utils.getResponses(data);
    out += '\n';
    data.responseSchemas = false;
    out += '\n';
    var arr7 = data.responses;
    if (arr7) {
        var response, i7 = -1,
            l7 = arr7.length - 1;
        while (i7 < l7) {
            response = arr7[i7 += 1];
            out += '\n';
            if (response.content) data.responseSchemas = true;
            out += '\n';
        }
    }
    out += '\n\n';
    if (data.responseSchemas) {
        out += '\n### Example responses\n\n' + (data.utils.getResponseExamples(data)) + '\n';
    }
    out += '\n\n' + (data.tags.section) + '\n<h3 id="' + (data.operationUniqueSlug) + '-responses">Responses</h3>\n\n|Status|Meaning|Description|Schema|\n|---|---|---|---|\n';
    var arr8 = data.responses;
    if (arr8) {
        var r, i8 = -1,
            l8 = arr8.length - 1;
        while (i8 < l8) {
            r = arr8[i8 += 1];
            out += '|' + (r.status) + '|' + (r.meaning) + '|' + (r.description || 'none') + '|' + (r.schema) + '|\n';
        }
    }
    out += '\n\n';
    data.responseSchemas = false;
    out += '\n';
    var arr9 = data.responses;
    if (arr9) {
        var response, i9 = -1,
            l9 = arr9.length - 1;
        while (i9 < l9) {
            response = arr9[i9 += 1];
            out += '\n';
            if (response.content && !response.$ref && !data.utils.isPrimitive(response.type)) data.responseSchemas = true;
            out += '\n';
        }
    }
    out += '\n';
    if (data.responseSchemas) {
        out += '\n<h3 id="' + (data.operationUniqueSlug) + '-responseschema">Response Schema</h3>\n';
        var arr10 = data.responses;
        if (arr10) {
            var response, i10 = -1,
                l10 = arr10.length - 1;
            while (i10 < l10) {
                response = arr10[i10 += 1];
                out += '\n';
                if (response.content && !response.$ref && !data.utils.isPrimitive(response.type)) {
                    out += '\n';
                    if (Object.keys(response.content).length) {
                        out += '\n';
                        var responseKey = Object.keys(response.content)[0];
                        out += '\n';
                        var responseSchema = response.content[responseKey].schema;
                        out += '\n';
                        var enums = [];
                        out += '\n';
                        var blocks = data.utils.schemaToArray(responseSchema, 0, {
                            trim: true,
                            join: true
                        }, data);
                        out += '\n';
                        for (var block of blocks) {
                            for (var p of block.rows) {
                                if (p.schema && p.schema.enum) {
                                    for (var e of p.schema.enum) {
                                        enums.push({
                                            name: p.name,
                                            value: e
                                        });
                                    }
                                }
                            }
                        }
                        out += '\n\n';
                        if (blocks[0].rows.length || blocks[0].title) {
                            out += '\nStatus Code **' + (response.status) + '**\n\n';
                            var arr11 = blocks;
                            if (arr11) {
                                var block, i11 = -1,
                                    l11 = arr11.length - 1;
                                while (i11 < l11) {
                                    block = arr11[i11 += 1];
                                    out += '\n';
                                    if (block.title) {
                                        out += '*' + (block.title) + '*\n';
                                    }
                                    out += '\n|Name|Type|Required|Restrictions|Description|\n|---|---|---|---|---|\n';
                                    var arr12 = block.rows;
                                    if (arr12) {
                                        var p, i12 = -1,
                                            l12 = arr12.length - 1;
                                        while (i12 < l12) {
                                            p = arr12[i12 += 1];
                                            out += '|' + (p.displayName) + '|' + (p.safeType) + '|' + (p.required) + '|' + (p.restrictions || 'none') + '|' + (p.description || 'none') + '|\n';
                                        }
                                    }
                                    out += '\n';
                                }
                            }
                            out += '\n';
                        }
                        out += '\n\n';
                        if (enums.length > 0) {
                            out += '\n#### Enumerated Values\n\n|Property|Value|\n|---|---|\n';
                            var arr13 = enums;
                            if (arr13) {
                                var e, i13 = -1,
                                    l13 = arr13.length - 1;
                                while (i13 < l13) {
                                    e = arr13[i13 += 1];
                                    out += '|' + (e.name) + '|' + (data.utils.toPrimitive(e.value)) + '|\n';
                                }
                            }
                            out += '\n\n';
                        }
                        out += '\n';
                    }
                    out += '\n\n';
                    data.response = response;
                    out += '\n';
                    if (data.response.links) {
                        out += '\n\n#### Links\n\n';
                        for (var l in data.response.links) {
                            out += '\n';
                            var link = data.response.links[l];
                            out += '\n\n**' + (l) + '** => ';
                            if (link.operationId) {
                                out += '<a href="#opId' + (link.operationId) + '">' + (link.operationId) + '</a>';
                            } else {
                                out += '' + (link.operationRef);
                            }
                            out += '\n\n';
                            if (link.parameters) {
                                out += '\n|Parameter|Expression|\n|---|---|\n';
                                for (var p in link.parameters) {
                                    out += '|' + (p) + '|' + (link.parameters[p]) + '|';
                                }
                                out += '\n';
                            }
                            out += '\n\n';
                        } /* of links */
                        out += '\n\n';
                    }
                    out += '\n\n\n';
                }
                out += '\n';
            }
        }
        out += '\n';
    }
    out += '\n\n';
    data.responseHeaders = data.utils.getResponseHeaders(data);
    out += '\n';
    if (data.responseHeaders.length) {
        out += '\n\n### Response Headers\n\n|Status|Header|Type|Format|Description|\n|---|---|---|---|---|\n';
        var arr14 = data.responseHeaders;
        if (arr14) {
            var h, i14 = -1,
                l14 = arr14.length - 1;
            while (i14 < l14) {
                h = arr14[i14 += 1];
                out += '|' + (h.status) + '|' + (h.header) + '|' + (h.type) + '|' + (h.format || '') + '|' + (h.description || 'none') + '|\n';
            }
        }
        out += '\n\n';
    }
    out += '\n' + (data.tags.endSection) + '\n\n\n';
    if (typeof data.operation.callbacks === 'object') {
        out += '\n\n### Callbacks\n\n';
        data.operationStack.push(data.operation);
        out += '\n\n';
        for (var c of Object.keys(data.operation.callbacks)) {
            out += '\n\n#### ' + (c) + '\n\n';
            var callback = data.operation.callbacks && data.operation.callbacks[c];
            out += '\n\n';
            for (var e in callback) {
                out += '\n';
                if (!e.startsWith('x-widdershins-')) {
                    out += '\n\n**' + (e) + '**\n\n';
                    var exp = callback[e];
                    out += '\n\n';
                    for (var m in exp) {
                        out += '\n\n';
                        data.operation = exp[m];
                        out += '\n';
                        data.method.operation = data.operation;
                        out += '\n\n' + (data.templates.operation(data)) + '\n\n';
                    } /* of methods */
                    out += '\n\n';
                } /* of expressions */
                out += '\n\n';
            } /* of if */
            out += '\n\n';
        } /* of callbacks */
        out += '\n\n';
        data.operation = data.operationStack.pop();
        out += '\n';
        data.method.operation = data.operation;
        out += '\n\n';
    }
    out += '\n\n\n';
    data.security = data.operation.security ? data.operation.security : data.api.security;
    if (data.options.codeSamples || data.operation["x-code-samples"]) {
        out += '\n### Code samples\n\n' + (data.utils.getCodeSamples(data)) + '\n';
    }
    out += '\n' + (data.tags.endSection) + '\n';
    return out;
};
