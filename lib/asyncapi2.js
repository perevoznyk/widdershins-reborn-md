'use strict';

const path = require('path');
const util = require('util');

const yaml = require('yaml');

const common = require('./common.js');
const resolver = require('oas-resolver');
const dereference = require('reftools/lib/dereference.js').dereference;

let templates;

function preProcessor(api) {
  if (api.servers && !Array.isArray(api.servers)) {
    api.servers = Object.entries(api.servers).map(([name, server]) => {
      server.name = name;
      return server;
    });
  }
  return api;
}

function normalizeChannels(api) {
  if (!api.channels) return;

  for (let channelName in api.channels) {
    let channel = api.channels[channelName];
    let messages = {};

    for (let op of ['publish', 'subscribe']) {
      if (channel[op]) {
        let operation = channel[op];
        let msg = operation.message || operation.messages;
        if (msg) {
          if (msg.$ref) {
            let refName = msg.$ref.split('/').pop();
            messages[refName] = msg;
          } else if (msg.oneOf) {
            for (let m of msg.oneOf) {
              let refName = m.$ref
                ? m.$ref.split('/').pop()
                : m.messageId || 'anonymousMessage';
              messages[refName] = m;
            }
          } else if (msg.payload || msg.headers) {
            let refName = msg.messageId || op + 'Message';
            messages[refName] = msg;
          }
        }
      }
    }

    if (!api.topics) api.topics = {};
    api.topics[channelName] = Object.assign(
      {},
      channel.parameters || {},
      messages
    );
  }
}

function convertToToc(source) {
  let resources = {};
  for (let t in source.topics) {
    let topic = source.topics[t];
    for (var m in topic) {
      if (m === 'parameters') continue;
      var message = topic[m];
      if (!message || typeof message !== 'object') continue;
      if (!message.payload && !message.headers && !message.$ref) continue;
      var tagName = 'Default';
      if (message.tags && message.tags.length > 0) {
        tagName = message.tags[0].name;
      }
      if (!resources[tagName]) {
        resources[tagName] = {};
        if (source.tags) {
          for (let tag of source.tags) {
            if (tag.name === tagName) {
              resources[tagName].description = tag.description;
              resources[tagName].externalDocs = tag.externalDocs;
            }
          }
        }
      }
      if (!resources[tagName].topics) resources[tagName].topics = {};
      resources[tagName].topics[t] = {
        messages: {},
        parameters: topic.parameters,
      };
      resources[tagName].topics[t].messages[m] = message;
    }
  }
  return resources;
}

function getParameters(params) {
  if (!params) return [];
  if (Array.isArray(params)) {
    for (let p of params) {
      if (p === false) p = { schema: {} };
      if (!p.in) p.in = 'topic';
      if (typeof p.required === 'undefined') p.required = true;
      p.safeType = p.schema.type;
      p.shortDesc = p.description;
    }
    return params;
  }
  let result = [];
  for (let name in params) {
    let p = params[name];
    if (typeof p === 'string') {
      p = { description: p, schema: { type: 'string' } };
    }
    if (!p.in) p.in = 'path';
    if (typeof p.required === 'undefined') p.required = true;
    p.safeType = p.schema && p.schema.type;
    p.shortDesc = p.description;
    p.name = name;
    result.push(p);
  }
  return result;
}

function convertInner(api, options) {
  return new Promise(function (resolve, reject) {
    let data = {};
    if (options.verbose) console.warn('starting deref', api.info.title);
    data.api = dereference(api, api, {
      verbose: options.verbose,
      $ref: 'x-widdershins-oldRef',
    });
    if (options.verbose) console.warn('finished deref');
    data.version =
      data.api.info &&
      data.api.info.version &&
      data.api.info.version.toLowerCase().startsWith('v')
        ? data.api.info.version
        : 'v' +
          (data.api.info && data.api.info.version
            ? data.api.info.version
            : '1.0.0');
    data.widdershins = require('../package.json');

    let header = {};
    header.title = api.info && api.info.title ? ' ' + data.version : ' 1.0.0';

    header.language_tabs = options.language_tabs;
    header.headingLevel = Math.max(options.headings || 0, 3);

    header.toc_footers = [];
    if (api.externalDocs) {
      if (api.externalDocs.url) {
        header.toc_footers.push(
          '<a href="' +
            api.externalDocs.url +
            '">' +
            (api.externalDocs.description
              ? api.externalDocs.description
              : 'External Docs') +
            '</a>'
        );
      }
    }
    if (options.toc_footers) {
      for (var key in options.toc_footers) {
        header.toc_footers.push(
          '<a href="' +
            options.toc_footers[key].url +
            '">' +
            options.toc_footers[key].description +
            '</a>'
        );
      }
    }
    header.includes = options.includes;
    header.search = options.search;
    header.code_clipboard = options.clipboard;
    header.highlight_theme = options.theme;
    header.generator = data.widdershins.name + ' v' + data.widdershins.version;

    if (typeof templates === 'undefined') {
      templates = require('./templates/asyncapi1');
    }
    if (options.user_templates) {
      // eslint-disable-next-line no-new-func
      const dot = new Function('return require("dot")')();
      dot.templateSettings.strip = false;
      dot.templateSettings.varname = 'data';
      templates = Object.assign(
        templates,
        dot.process({ path: options.user_templates })
      );
    }

    data.options = options;
    data.header = header;
    data.templates = templates;
    data.translations = {};
    templates.translations(data);
    data.resources = convertToToc(data.api);

    data.utils = {};
    data.utils.inspect = util.inspect;
    data.utils.yaml = yaml;
    data.utils.getSample = common.getSample;
    data.utils.getParameters = getParameters;
    data.utils.schemaToArray = common.schemaToArray;
    data.utils.getCodeSamples = common.getCodeSamples;
    data.utils.slugify = common.slugify;

    let content = '';
    try {
      if (!options.omitHeader)
        content += '---\n' + yaml.stringify(header) + '\n---\n\n';
      content += templates.main(data);
      content = common.removeDupeBlankLines(content);
    } catch (ex) {
      return reject(ex);
    }
    content = common.removeDupeBlankLines(content);

    if (options.html) content = common.html(content, header, options);

    if (options.cleanMarkdown) {
      content = common.stripSchemaPlaceholderSamples(content, options);
      content = common.cleanMarkdown(content);
      content = common.generateToc(content);
    }

    resolve(content);
  });
}

/**
 * Convert an AsyncAPI 2.x definition to Markdown or HTML.
 * @param {object} api - AsyncAPI 2.x definition object.
 * @param {object} options - Conversion options.
 * @returns {Promise<string>} Generated Markdown or HTML.
 */
function convert(api, options) {
  api = preProcessor(api);
  normalizeChannels(api);

  let defaults = {};
  defaults.includes = [];
  defaults.search = true;
  defaults.clipboard = true;
  defaults.theme = 'darkula';
  defaults.language_tabs = [
    { 'javascript--nodejs': 'Node.JS' },
    { javascript: 'JavaScript' },
    { ruby: 'Ruby' },
    { python: 'Python' },
    { java: 'Java' },
    { go: 'Go' },
  ];
  defaults.sample = true;

  options = Object.assign({}, defaults, options);
  options.openapi = api;

  return resolver
    .optionalResolve(options)
    .then(function (options) {
      return convertInner(options.openapi, options);
    })
    .catch(function (ex) {
      throw ex;
    });
}

module.exports = {
  convert: convert,
};
