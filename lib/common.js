'use strict';

const fs = require('fs');

const jptr = require('reftools/lib/jptr.js').jptr;
const sampler = require('openapi-sampler');
const jsonTrunc = require('./jsonTrunc.js');
const recurse = require('reftools/lib/recurse.js').recurse;
const visit = require('reftools/lib/visit.js').visit;
const clone = require('reftools/lib/clone.js').clone;
const circularClone = require('reftools/lib/clone.js').circularClone;
const walkSchema = require('oas-schema-walker').walkSchema;
const wsGetState = require('oas-schema-walker').getDefaultState;
const pinyin = require('pinyin').pinyin;
const httpsnippetGenerator = require('./httpsnippetGenerator');

const hljs = require('highlight.js');
const emoji = require('markdown-it-emoji');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    lang = lang.split('--')[0];
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="nohighlight example"><code>' +
          hljs.highlight(str, { language: lang }).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="highlight example"><code>' +
      md.utils.escapeHtml(str) +
      '</code></pre>'
    );
  },
}).use(emoji);

/* originally from https://github.com/for-GET/know-your-http-well/blob/master/json/status-codes.json */
/* "Unlicensed", public domain */
const statusCodes = require('../statusCodes.json');

const contentTypes = {
  xml: [
    '^(application|text|image){1}\\/(.*\\+){0,1}xml(;){0,1}(\\s){0,}(charset=.*){0,}$',
  ],
  json: [
    '^(application|text){1}\\/(.*\\+){0,1}json(;){0,1}(\\s){0,}(charset=.*){0,}$',
  ],
  yaml: ['application/x-yaml', 'text/x-yaml'],
  form: [
    'multipart/form-data',
    'application/x-www-form-urlencoded',
    'application/octet-stream',
  ],
  text: ['text/plain', 'text/html'],
};

function nop(obj) {
  return obj;
}

/**
 * Convert an object to a safe JSON string.
 * @param {*} o - The object to stringify.
 * @param {Function} [replacer] - JSON replacer function.
 * @param {number} [indent] - Indentation spaces.
 * @param {number} [depth] - Maximum recursion depth.
 * @returns {string} The JSON string.
 */
function safejson(o, replacer, indent, depth) {
  return jsonTrunc(o, replacer, indent, {
    depth: depth || 10,
    visit_cycles: true,
  });
}

/**
 * Check if any content type matches a given class.
 * @param {string[]} ctTypes - Content types to check.
 * @param {string} ctClass - Target content type class (e.g. 'json', 'xml').
 * @returns {boolean} Whether a match was found.
 */
function doContentType(ctTypes, ctClass) {
  for (let type of ctTypes) {
    for (let target of contentTypes[ctClass] || []) {
      if (type.match(target)) return true;
    }
  }
  return false;
}

/**
 * Check if a language is in the language tabs and optionally add it.
 * @param {string} language - Language identifier to check.
 * @param {Array} language_tabs - Array of supported language tabs.
 * @param {boolean} [mutate] - If true, add the language to tabs when not found.
 * @returns {string|boolean} Lowercase language key or false.
 */
function languageCheck(language, language_tabs, mutate) {
  var lcLang = language.toLowerCase();
  if (lcLang === 'c#') lcLang = 'csharp';
  if (lcLang === 'c++') lcLang = 'cpp';
  for (var l in language_tabs) {
    var target = language_tabs[l];
    if (typeof target === 'object') {
      if (Object.keys(target)[0] === lcLang) {
        return lcLang;
      }
    } else {
      if (target === lcLang) return lcLang;
    }
  }
  if (mutate) {
    var newLang = {};
    newLang[lcLang] = language;
    language_tabs.push(newLang);
    return lcLang;
  }
  return false;
}

/**
 * Generate code samples for an API operation.
 * @param {Object} data - Request data including operation and options.
 * @param {string} [mediatype] - Media type for the request body.
 * @returns {string} Generated code samples as markdown snippets.
 */
function getCodeSamples(data, mediatype) {
  if (!mediatype && data.consumes && data.consumes.length)
    mediatype = data.consumes[0];
  let s = '';
  const op = data.operation || data.message;
  if (op && op['x-code-samples']) {
    for (var c in op['x-code-samples']) {
      var sample = op['x-code-samples'][c];
      var lang = languageCheck(sample.lang, data.header.language_tabs, true);
      s += generateCodeSnippet(lang, sample.source);
    }
  } else {
    const samplesGenerator =
      data.options.httpsnippet ||
      ((mediatype || '').startsWith('multipart/') &&
        !data.options.user_templates &&
        data.options.experimental)
        ? httpsnippetGenerator.generate
        : fileTemplateGenerator;

    const codeSamples = data.header.language_tabs.map(tab => {
      const lang = typeof tab === 'object' ? Object.keys(tab)[0] : tab;

      const lowerCaseLanguage = languageCheck(
        lang,
        data.header.language_tabs,
        false
      );
      const target = getLanguageTarget(lowerCaseLanguage);
      const client = getLanguageClient(lang, data.options.language_clients);

      const sample = (target && samplesGenerator(target, client, data)) || '';
      return (sample && generateCodeSnippet(lowerCaseLanguage, sample)) || '';
    });

    s += codeSamples.join('');
  }
  return s;
}

function getLanguageName(lang) {
  // _Check if language custom target is used, get markdown name
  // i.e., javascript--node -> javascript
  return (lang && lang.split('--')[0]) || lang;
}

function getLanguageTarget(lang) {
  // _Check if language custom target is used
  // i.e., javascript--node -> node
  return (lang && lang.split('--')[1]) || lang;
}

function getLanguageClient(lang, clients) {
  if (!(lang && clients && clients.length)) return '';
  const client = clients.find(function (e, i, a) {
    return Object.keys(e)[0] === lang;
  });
  if (client) return Object.values(client)[0];
  return '';
}

function fileTemplateGenerator(target, client, data) {
  const templateName = getCodeSampleTemplateName(target);
  const templateFunc = data.templates[templateName];
  return (templateFunc && templateFunc(data)) || '';
}

function getCodeSampleTemplateName(target) {
  return `code_${target}`;
}

function generateCodeSnippet(lang, code) {
  const snippetSeparator = '```';
  return `${snippetSeparator}${lang}\n${code}\n${snippetSeparator}\n\n`;
}

/**
 * Convert text into a GitHub-flavored Markdown compatible link anchor.
 * @param {string} text - The text to convert.
 * @returns {string} A slug suitable for use as a link anchor.
 */
function gfmLink(text) {
  text = text.trim().toLowerCase();
  text = text.split("'").join('');
  text = text.split('"').join('');
  text = text.split('.').join('');
  text = text.split('`').join('');
  text = text.split(':').join('');
  text = text.split('/').join('');
  text = text.split('&lt;').join('');
  text = text.split('&gt;').join('');
  text = text.split('<').join('');
  text = text.split('>').join('');
  text = text.split(' ').join('-');
  return text;
}

/**
 * Infer a JSON Schema type from the schema's keywords.
 * @param {Object} schema - JSON Schema object.
 * @returns {string} Inferred type (e.g. 'string', 'object', 'any').
 */
function inferType(schema) {
  function has(properties) {
    for (let property of properties) {
      if (typeof schema[property] !== 'undefined') return true;
    }
    return false;
  }

  if (schema.type) return schema.type;
  let possibleTypes = [];
  if (
    has([
      'properties',
      'additionalProperties',
      'patternProperties',
      'minProperties',
      'maxProperties',
      'required',
      'dependencies',
    ])
  ) {
    possibleTypes.push('object');
  }
  if (
    has(['items', 'additionalItems', 'maxItems', 'minItems', 'uniqueItems'])
  ) {
    possibleTypes.push('array');
  }
  if (
    has([
      'exclusiveMaximum',
      'exclusiveMinimum',
      'maximum',
      'minimum',
      'multipleOf',
    ])
  ) {
    possibleTypes.push('number');
  }
  if (has(['maxLength', 'minLength', 'pattern'])) {
    possibleTypes.push('number');
  }
  if (schema.enum) {
    for (let value of schema.enum) {
      possibleTypes.push(typeof value); // doesn't matter about dupes
    }
  }

  if (possibleTypes.length === 1) return possibleTypes[0];
  return 'any';
}

/**
 * Trim a nested object to a maximum depth, replacing deeper values with empty containers.
 * @param {*} obj - The object to trim.
 * @param {number} maxDepth - Maximum recursion depth.
 * @returns {*} The trimmed object.
 */
function strim(obj, maxDepth) {
  if (maxDepth <= 0) return obj;
  recurse(obj, { identityDetection: true }, function (obj, key, state) {
    if (state.depth >= maxDepth) {
      if (Array.isArray(state.parent[state.pkey])) {
        state.parent[state.pkey] = [];
      } else if (typeof state.parent[state.pkey] === 'object') {
        state.parent[state.pkey] = {};
      }
    }
  });
  return obj;
}

/**
 * Convert a JSON Schema into a flat array of entries for table rendering.
 * @param {Object} schema - JSON Schema to convert.
 * @param {number} offset - Initial nesting offset.
 * @param {Object} options - Rendering options (trim, join, truncate, shallowSchemas).
 * @param {Object} data - Context data including translations and API definition.
 * @returns {Array} Array of block objects with title and rows.
 */
function schemaToArray(schema, offset, options, data) {
  let iDepth = 0;
  let oDepth = 0;
  let blockDepth = 0;
  let skipDepth = -1;
  let container = [];
  let depthQueue = new Map();
  let block = { title: '', rows: [] };
  if (schema) {
    if (schema.title) block.title = schema.title;
    if (!block.title && schema.description) block.title = schema.description;
    block.description = schema.description;
    if (schema.externalDocs) block.externalDocs = schema.externalDocs;
  }
  container.push(block);
  let wsState = wsGetState();
  wsState.combine = true;
  wsState.allowRefSiblings = true;
  walkSchema(schema, {}, wsState, function (schema, parent, state) {
    let isBlock = false;
    if (
      state.property &&
      (state.property.startsWith('allOf') ||
        state.property.startsWith('anyOf') ||
        state.property.startsWith('oneOf') ||
        state.property === 'not')
    ) {
      isBlock = true;
      let components = (state.property + '/0').split('/');
      if (components[1] !== '0') {
        if (components[0] === 'allOf') components[0] = 'and';
        if (components[0] === 'anyOf') components[0] = 'or';
        if (components[0] === 'oneOf') components[0] = 'xor';
      }
      block = { title: components[0], rows: [] };
      let dschema = schema;
      let prefix = '';
      if (schema.$ref) {
        dschema = jptr(data.api, schema.$ref);
        prefix = schema.$ref.replace('#/components/schemas/', '') + '.';
      }
      if (dschema.discriminator) {
        block.title +=
          ' - discriminator: ' + prefix + dschema.discriminator.propertyName;
      }
      container.push(block);
      blockDepth = state.depth;
    } else {
      if (blockDepth && state.depth < blockDepth) {
        block = { title: data.translations.continued, rows: [] };
        container.push(block);
        blockDepth = 0;
      }
    }

    let entry = {};
    entry.schema = schema;
    entry.in = 'body';
    if (state.property && state.property.indexOf('/')) {
      if (isBlock) entry.name = '*' + data.translations.anonymous + '*';
      else entry.name = state.property.split('/')[1];
    } else if (!state.top) console.warn(state.property);
    if (!entry.name && schema.title) entry.name = schema.title;

    if (
      schema.type === 'array' &&
      schema.items &&
      schema.items['x-widdershins-oldRef'] &&
      !entry.name
    ) {
      state.top = false; // force it in
    } else if (
      schema.type === 'array' &&
      schema.items &&
      schema.items.$ref &&
      !entry.name
    ) {
      state.top = false; // force it in, for un-dereferenced schemas
    } else if (
      !entry.name &&
      state.top &&
      schema.type &&
      schema.type !== 'object' &&
      schema.type !== 'array'
    ) {
      state.top = false;
    }

    if (
      !state.top &&
      !entry.name &&
      state.property === 'additionalProperties'
    ) {
      entry.name = '**additionalProperties**';
    }
    if (!state.top && !entry.name && state.property === 'additionalItems') {
      entry.name = '**additionalItems**';
    }
    if (
      !state.top &&
      !entry.name &&
      state.property &&
      state.property.startsWith('patternProperties')
    ) {
      entry.name = '*' + entry.name + '*';
    }
    if (!state.top && !entry.name && !parent.items) {
      entry.name = '*' + data.translations.anonymous + '*';
    }

    // we should be done futzing with entry.name now

    if (entry.name) {
      if (state.depth > iDepth) {
        let difference = state.depth - iDepth;
        depthQueue.set(iDepth, difference);
        oDepth++;
      }
      if (state.depth < iDepth) {
        let keys = depthQueue.keys();
        let next = keys.next();
        let difference = 0;
        while (!next.done) {
          if (next.value >= state.depth) {
            let depth = depthQueue.get(next.value);
            depth = depth % 2 == 0 ? depth / 2 : depth;
            difference += depth;
            depthQueue.delete(next.value);
          }
          next = keys.next();
        }
        oDepth -= difference;
        if (oDepth < 0) oDepth = 0;
      }
      iDepth = state.depth;
      //console.warn('state %s, idepth %s, odepth now %s, offset %s',state.depth,iDepth,oDepth,offset);
    }

    entry.depth = Math.max(oDepth + offset, 0);
    entry.description = schema.description;
    entry.type = Array.isArray(schema.type)
      ? schema.type.filter(t => t !== 'null')[0] || schema.type[0]
      : schema.type;
    entry.format = schema.format;
    entry.safeType = normalizeType(schema);

    if (schema['x-widdershins-oldRef']) {
      entry.$ref = schema['x-widdershins-oldRef'].replace(
        '#/components/schemas/',
        ''
      );
      entry.safeType =
        '[' + entry.$ref + '](#' + entry.$ref.toLowerCase() + ')';
      if (data.options.shallowSchemas) skipDepth = entry.depth;
      if (!entry.description) {
        let target = jptr(data.api, schema['x-widdershins-oldRef']);
        if (target.description) entry.description = target.description;
      }
    }
    if (schema.$ref) {
      // repeat for un-dereferenced schemas
      entry.$ref = schema.$ref.replace('#/components/schemas/', '');
      entry.type = '$ref';
      entry.safeType =
        '[' + entry.$ref + '](#' + entry.$ref.toLowerCase() + ')';
      if (data.options.shallowSchemas) skipDepth = entry.depth;
      if (!entry.description) {
        let target = jptr(data.api, schema.$ref);
        if (target.description) entry.description = target.description;
      }
    }

    if (entry.format)
      entry.safeType = entry.safeType + '(' + entry.format + ')';
    if (entry.type === 'array' && schema.items) {
      let itemsType = schema.items.type || 'any';
      if (Array.isArray(schema.items.type)) {
        itemsType = schema.items.type.filter(t => t !== 'null').join(' | ') || 'any';
      }
      if (schema.items['x-widdershins-oldRef']) {
        let $ref = schema.items['x-widdershins-oldRef'].replace(
          '#/components/schemas/',
          ''
        );
        itemsType = '[' + $ref + '](#' + $ref.toLowerCase() + ')';
        if (!entry.description) {
          let target = jptr(data.api, schema.items['x-widdershins-oldRef']);
          if (target.description)
            entry.description = '[' + target.description + ']';
        }
      }
      if (schema.items.$ref) {
        // repeat for un-dereferenced schemas
        let $ref = schema.items.$ref.replace('#/components/schemas/', '');
        itemsType = '[' + $ref + '](#' + $ref.toLowerCase() + ')';
        if (!entry.description) {
          let target = jptr(data.api, schema.items.$ref);
          if (target.description)
            entry.description = '[' + target.description + ']';
        }
      }
      if (schema.items.anyOf) itemsType = 'anyOf';
      if (schema.items.allOf) itemsType = 'allOf';
      if (schema.items.oneOf) itemsType = 'oneOf';
      if (schema.items.not) itemsType = 'not';
      entry.safeType = '[' + itemsType + ']';
    }

    if (options.trim && typeof entry.description === 'string') {
      entry.description = entry.description.trim();
    }
    if (options.join && typeof entry.description === 'string') {
      entry.description = entry.description
        .split('\r')
        .join('')
        .split('\n')
        .join('<br />');
    }
    if (options.truncate && typeof entry.description === 'string') {
      entry.description = entry.description.split('\r').join('').split('\n')[0];
    }
    if (entry.description === 'undefined') {
      // yes, the string
      entry.description = '';
    }

    if (schema.nullable === true && !Array.isArray(schema.type)) {
      entry.safeType += '¦null';
    }

    if (schema.readOnly) entry.restrictions = data.translations.readOnly;
    if (schema.writeOnly) entry.restrictions = data.translations.writeOnly;

    entry.required =
      parent.required &&
      Array.isArray(parent.required) &&
      parent.required.indexOf(entry.name) >= 0;
    if (typeof entry.required === 'undefined') entry.required = false;

    if (typeof entry.type === 'undefined') {
      entry.type = inferType(schema);
      entry.safeType = entry.type;
    }

    if (schema.const !== undefined) {
      entry.type = 'const';
      entry.safeType = 'const';
    }

    if (
      typeof entry.name === 'string' &&
      entry.name.startsWith('x-widdershins-')
    ) {
      entry.name = ''; // reset
    }
    if (skipDepth >= 0 && entry.depth >= skipDepth) entry.name = ''; // reset
    if (entry.depth < skipDepth) skipDepth = -1;
    entry.displayName = (
      data.translations.indent.repeat(entry.depth) +
      ' ' +
      entry.name
    ).trim();

    if ((!state.top || entry.type !== 'object') && entry.name) {
      block.rows.push(entry);
    }
  });
  return container;
}

/**
 * Remove x-widdershins properties from an object.
 * @param {Object} obj - The object to clean.
 * @returns {Object} The cleaned object.
 */
function clean(obj) {
  if (typeof obj === 'undefined') return {};
  visit(
    obj,
    {},
    {
      filter: function (obj, key, state) {
        if (!key.startsWith('x-widdershins')) return obj[key];
      },
    }
  );
  return obj;
}

function getSampleInner(orig, options, samplerOptions, api) {
  // TODO we can now probably simplify some of this
  if (!options.samplerErrors) options.samplerErrors = new Map();
  let obj = circularClone(orig);
  let defs = api; //Object.assign({},api,orig);
  if (options.sample && obj) {
    try {
      obj = JSON.parse(safejson(orig, undefined, undefined, options.maxDepth)); // now we always limit
      let sample = sampler.sample(obj, samplerOptions, defs);
      if (typeof sample !== 'undefined') {
        if (sample !== null && Object.keys(sample).length) return sample;
        else {
          return sampler.sample(
            { type: 'object', properties: { anonymous: obj } },
            samplerOptions,
            defs
          ).anonymous;
        }
      }
    } catch (ex) {
      if (options.samplerErrors.has(ex.message)) {
        process.stderr.write('.');
      } else {
        console.error('# sampler ' + ex.message);
        options.samplerErrors.set(ex.message, true);
        if (options.verbose) {
          console.error(ex);
        }
      }
      obj = JSON.parse(safejson(orig));
      try {
        let sample = sampler.sample(obj, samplerOptions, defs);
        if (typeof sample !== 'undefined') return sample;
      } catch (ex) {
        if (options.samplerErrors.has(ex.message)) {
          process.stderr.write('.');
        } else {
          console.warn('# sampler 2nd error ' + ex.message);
          options.samplerErrors.set(ex.message, true);
        }
      }
    }
  }
  return obj;
}

/**
 * Generate a sample value from a schema, using existing examples when available.
 * @param {Object} orig - Original schema object.
 * @param {Object} options - Sampler options (sample, maxDepth, etc.).
 * @param {Object} samplerOptions - Options passed to openapi-sampler.
 * @param {Object} api - The full API definition for $ref resolution.
 * @returns {*} A sample value.
 */
function getSample(orig, options, samplerOptions, api) {
  if (orig && orig.example) return clean(orig.example);
  let result = getSampleInner(orig, options, samplerOptions, api);
  result = clean(result);
  result = strim(result, options.maxDepth);
  return result;
}

/**
 * Collapse consecutive blank lines into a single blank line.
 * @param {string} content - The content to process.
 * @returns {string} Content with duplicate blank lines removed.
 */
function removeDupeBlankLines(content) {
  return content.replace(/[\r\n]{3,}/g, '\n\n');
}

/**
 * Convert a value to a primitive type.
 * @param {*} v - The value to convert.
 * @returns {string|*} A primitive value (objects are JSON-stringified).
 */
function toPrimitive(v) {
  if (typeof v === 'object') {
    // including arrays
    return JSON.stringify(v);
  }
  return v;
}

/**
 * Convert text into a URL-friendly slug.
 * @param {string} text - The text to slugify.
 * @returns {string} A lowercase slug with non-word characters replaced by dashes.
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/\(/, '')
    .replace(/\)/, '') //remove parentheses
    .replace(/[:,']/, '') //remove colons, commas, apostrophes
    .replace(/<code>/, '')
    .replace(/<\/code>/, '') //remove code tags
    .replace(/[\u4e00-\u9fa5]+/g, s =>
      pinyin(s, { style: pinyin.STYLE_TONE2 }).join()
    ) // replace chinese with pinyin
    .replace(/[\s\W-]+/g, '-'); // Replace spaces, non-word characters and dashes with a single dash (-)
}

function include(filename) {
  return md.render(fs.readFileSync(filename, 'utf8'));
}

/**
 * Render markdown content as a standalone HTML page.
 * @param {string} markdown - Markdown content to render.
 * @param {Object} header - Header info containing title.
 * @param {Object} options - Options including respec config and abstract/sotd paths.
 * @returns {string} Complete HTML document string.
 */
function html(markdown, header, options) {
  let preface = `<html><head><meta charset="UTF-8"><title>${md.utils.escapeHtml(header.title)}</title>`;
  if (options.respec) {
    preface +=
      '<script src="https://mermade.github.io/static/respec-widdershins.js" class="remove"></script>';
    preface += `<script class="remove">var respecConfig = ${JSON.stringify(options.respec)};</script>`;
    preface += '</head><body><section id="abstract">';
    preface += include(options.abstract);
    preface += '</section>';
    preface += '<section id="sotd">';
    preface += include(options.sotd);
    preface += '</section>';
  } else {
    preface += '</head><body>';
  }
  return preface + md.render(markdown);
}

/**
 * Normalize a schema type for display. Handles OAS 3.1 type arrays (e.g. ["string","null"]),
 * the deprecated nullable keyword, const values, boolean schemas, and prefixItems.
 */
function normalizeType(schema) {
  if (typeof schema === 'boolean') return schema ? 'any' : 'none';
  if (schema === null || schema === undefined) return 'any';

  let type = schema.type;

  if (Array.isArray(type)) {
    let nonNull = type.filter(t => t !== 'null');
    type = nonNull.length === 1 ? nonNull[0] : nonNull.join(' | ');
    if (type.indexOf('null') < 0 && schema.nullable !== true) {
      // nothing to append
    } else if (type.indexOf('null') < 0) {
      type += ' | null';
    }
  }

  if (typeof type === 'undefined') {
    type = inferType(schema);
  }

  if (schema.const !== undefined) {
    type = 'const';
  }

  return type || 'any';
}

/**
 * Convert embedded HTML in widdershins markdown output to pure markdown.
 * - <h1>-<h6> → # headings (with level normalization)
 * - <a href="...">text</a> → [text](url)
 * - <a id="..."></a> → removed
 * - <aside> → blockquotes
 * - HTML comments → removed
 * - Boxy noise text removed
 * - Schema anchor links cleaned up
 * - Excessive blank lines collapsed
 */
function cleanMarkdown(raw) {
  let out = raw;

  // Convert HTML headings to markdown
  out = out.replace(
    /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi,
    (_, level, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      if (!cleanText) return '';
      return '#'.repeat(Number(level)) + ' ' + cleanText;
    }
  );

  // Convert links
  out = out.replace(/<a\s+href="([^"]*)">(.*?)<\/a>/gi, '[$2]($1)');
  out = out.replace(/<a\s+id="[^"]*"><\/a>/gi, '');

  // Convert asides to blockquotes
  out = out.replace(/<aside[^>]*>/gi, '\n> ');
  out = out.replace(/<\/aside>/gi, '\n');

  // Remove HTML comments
  out = out.replace(/<!--[^>]*-->/g, '');

  // Fix schema anchor links
  out = out.replace(/\(#schema([a-z0-9_]+)\)/g, '(#$1)');

  // Remove "Scroll down for..." boilerplate
  out = out.replace(/^>\s*Scroll down for[^\n]*\n*/m, '');

  // Remove contact boilerplate (Email: ... Web: ...)
  out = out.replace(/^Email:\s*<a[^>]*>[^<]*<\/a>\s*Web:\s*<a[^>]*>[^<]*<\/a>\s*$/gm, '');
  out = out.replace(/^Email:\s*\[[^\]]*\]\([^)]*\)\s*Web:\s*\[[^\]]*\]\([^)]*\)\s*$/gm, '');

  // Normalize heading hierarchy: first # stays, all others shift down by 1
  const lines = out.split('\n');
  let firstH1 = true;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const origLevel = match[1].length;
      const text = match[2];
      let newLevel;
      if (origLevel === 1) {
        if (firstH1) {
          firstH1 = false;
          newLevel = 1;
        } else {
          newLevel = 2;
        }
      } else {
        newLevel = Math.min(origLevel + 1, 6);
      }
      lines[i] = '#'.repeat(newLevel) + ' ' + text;
    }
  }
  out = lines.join('\n');

  // Clean up empty blockquotes and excessive blank lines
  out = out.replace(/^>\s*$/gm, '');
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim() + '\n';
}

/**
 * Strip auto-generated JSON placeholder examples from schema sections,
 * keeping only the properties table.
 */
function stripSchemaPlaceholderSamples(markdown, options) {
  if (options && options.showSchemaJson === false) {
    // Strip JSON code blocks under schema headings, keep descriptions
    const h = '(?:<h[23][^>]*>[^<]*</h[23]>|#{2,3} [^\\n]+)';
    const anchors = '(?:\\s*<a[^>]*>[^<]*</a>\\s*)*';
    const json = '```json\\n(?:(?!```)[\\s\\S])*```\\n\\n';
    return markdown.replace(
      new RegExp('(' + h + '\\n\\n' + anchors + '\\n\\n)' + json, 'g'),
      '$1'
    );
  }
  return markdown;
}

/**
 * Noise headings to exclude from the table of contents.
 */
const TOC_NOISE = new Set([
  'properties',
  'enumerated values',
  'response schema',
  'detailed descriptions',
  'response headers',
]);

/**
 * Generate a clean markdown table of contents from headings in the document.
 * - Only includes h1-h4 headings
 * - Filters out noise headings (Properties, Enumerated Values, etc.)
 * - Deduplicates repeated headings (e.g. multiple "Properties" sections)
 * - Proper nesting based on heading level
 * - Inserts after frontmatter or at top
 */
function generateToc(markdown) {

return markdown;

  const lines = markdown.split('\n');
  const tocEntries = [];
  let frontmatterEnd = -1;

  if (lines[0] && lines[0].trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        frontmatterEnd = i;
        break;
      }
    }
  }

  const startIdx = frontmatterEnd >= 0 ? frontmatterEnd + 1 : 0;
  const seen = new Set();

  for (let i = startIdx; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, '').trim();

      if (TOC_NOISE.has(text.toLowerCase())) continue;

      const dedupKey = text.toLowerCase();
      const count = seen.has(dedupKey);
      if (count) continue;
      seen.add(dedupKey);

      const anchor = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      tocEntries.push({ level, text, anchor });
    }
  }

  if (tocEntries.length === 0) return markdown;

  const minLevel = Math.min(...tocEntries.map(e => e.level));
  let toc = '\n## Table of Contents\n\n';
  for (const entry of tocEntries) {
    const indent = '  '.repeat(Math.max(0, entry.level - minLevel));
    toc += `${indent}- [${entry.text}](#${entry.anchor})\n`;
  }
  toc += '\n';

  if (frontmatterEnd >= 0) {
    const before = lines.slice(0, frontmatterEnd + 1).join('\n');
    const after = lines.slice(startIdx).join('\n');
    return before + '\n' + toc + '\n' + after;
  }
  return toc + markdown;
}

/**
 * Build enriched YAML frontmatter for agent/LLM consumption.
 * Includes structured metadata about the API.
 */
function buildFrontmatter(api, options) {
  const meta = {};

  if (api.info) {
    meta.title = api.info.title || 'API';
    meta.version = api.info.version || 'unknown';
    if (api.info.description) {
      meta.description = api.info.description;
    }
    if (api.info.license) {
      meta.license = {};
      if (api.info.license.name) meta.license.name = api.info.license.name;
      if (api.info.license.url) meta.license.url = api.info.license.url;
      if (api.info.license.identifier) meta.license.spdx = api.info.license.identifier;
    }
  }

  if (api.openapi) {
    meta.openapi = api.openapi;
  } else if (api.swagger) {
    meta.swagger = api.swagger;
  } else if (api.asyncapi) {
    meta.asyncapi = api.asyncapi;
  }

  if (api.servers && api.servers.length) {
    meta.servers = api.servers.map(s => s.url);
  }

  if (api.paths) {
    meta.paths = Object.keys(api.paths).length;
  }
  if (api.channels) {
    meta.channels = Object.keys(api.channels).length;
  }

  let opCount = 0;
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];
  if (api.paths) {
    for (const path of Object.values(api.paths)) {
      for (const m of methods) {
        if (path[m]) opCount++;
      }
    }
  }
  if (api.channels) {
    for (const ch of Object.values(api.channels)) {
      if (ch.publish) opCount++;
      if (ch.subscribe) opCount++;
    }
  }
  if (opCount > 0) meta.operations = opCount;

  if (api.components && api.components.schemas) {
    meta.schemas = Object.keys(api.components.schemas).length;
  }

  return meta;
}

/**
 * Stringify a simple object as YAML frontmatter (handles nested objects).
 */
function stringifyFrontmatter(obj, indent) {
  indent = indent || 0;
  const prefix = '  '.repeat(indent);
  let out = '';
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue;
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      const needsQuote = typeof val === 'string' && (val.includes(':') || val.includes('#') || val.includes('\n') || val.startsWith('"') || val.startsWith("'"));
      out += prefix + key + ': ' + (needsQuote ? '"' + String(val).replace(/"/g, '\\"') + '"' : val) + '\n';
    } else if (Array.isArray(val)) {
      if (val.length === 0) {
        out += prefix + key + ': []\n';
      } else {
        out += prefix + key + ':\n';
        for (const item of val) {
          out += prefix + '  - ' + item + '\n';
        }
      }
    } else if (typeof val === 'object') {
      out += prefix + key + ':\n';
      out += stringifyFrontmatter(val, indent + 1);
    }
  }
  return out;
}

module.exports = {
  statusCodes: statusCodes,
  doContentType: doContentType,
  languageCheck: languageCheck,
  getCodeSamples: getCodeSamples,
  inferType: inferType,
  clone: clone,
  clean: clean,
  safejson: safejson,
  strim: strim,
  slugify: slugify,
  getSample: getSample,
  gfmLink: gfmLink,
  schemaToArray: schemaToArray,
  removeDupeBlankLines: removeDupeBlankLines,
  toPrimitive: toPrimitive,
  html: html,
  normalizeType: normalizeType,
  cleanMarkdown: cleanMarkdown,
  stripSchemaPlaceholderSamples: stripSchemaPlaceholderSamples,
  generateToc: generateToc,
  buildFrontmatter: buildFrontmatter,
  stringifyFrontmatter: stringifyFrontmatter,
};
