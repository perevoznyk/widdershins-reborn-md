# widdershins-reborn

> A maintained fork of [widdershins](https://github.com/Mermade/widdershins) — designed as a **library-first** API for converting OpenAPI/Swagger/AsyncAPI definitions to Markdown or HTML.

[![npm version](https://img.shields.io/npm/v/widdershins-reborn.svg)](https://www.npmjs.com/package/widdershins-reborn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why widdershins-reborn?

The original `widdershins` package was CLI-focused and unmaintained since 2020. This fork is:

- **Library-first** — clean JS API, perfect for apps, build pipelines, and doc generators
- **Actively maintained** — bug fixes, dependency updates, new features
- **Modern Node.js** — supports Node 14.x through 22.x
- **TypeScript-ready** — type definitions included (coming soon)

## Install

```bash
npm install widdershins-reborn
```

## Quick Start (JavaScript)

```javascript
const widdershins = require('widdershins-reborn');
const fs = require('fs');

// Load your OpenAPI/Swagger/AsyncAPI definition
const api = JSON.parse(fs.readFileSync('petstore.json', 'utf8'));

// Convert to Markdown
widdershins
  .convert(api, {
    search: true,
    sample: true,
    language_tabs: [{ javascript: 'JavaScript' }, { python: 'Python' }],
  })
  .then(markdown => {
    fs.writeFileSync('api-docs.md', markdown, 'utf8');
    console.log('Documentation generated!');
  })
  .catch(err => {
    console.error('Conversion failed:', err);
  });
```

## Quick Start (ESM / Modern Node)

```javascript
import widdershins from 'widdershins-reborn';
import { readFileSync } from 'fs';

const api = JSON.parse(readFileSync('petstore.json', 'utf8'));

const markdown = await widdershins.convert(api, {
  search: true,
  sample: true,
});

console.log(markdown);
```

## API Reference

### `widdershins.convert(api, options)`

Converts an API definition to Markdown. Returns a `Promise<string>`.

**Parameters:**

| Name      | Type               | Description                                                             |
| --------- | ------------------ | ----------------------------------------------------------------------- |
| `api`     | `object \| string` | Parsed OpenAPI/Swagger/AsyncAPI object, or a string (for API Blueprint) |
| `options` | `object`           | Conversion options (see below)                                          |

**Options:**

| Option              | Type       | Default     | Description                                     |
| ------------------- | ---------- | ----------- | ----------------------------------------------- |
| `search`            | `boolean`  | `true`      | Include search in output                        |
| `sample`            | `boolean`  | `true`      | Generate example values (false = raw schemas)   |
| `codeSamples`       | `boolean`  | `false`     | Include generated code samples                  |
| `httpsnippet`       | `boolean`  | `false`     | Use httpsnippet for code generation             |
| `language_tabs`     | `array`    | `[]`        | Language tabs: `[{ javascript: 'JavaScript' }]` |
| `language_clients`  | `array`    | `[]`        | Client libraries: `[{ shell: 'curl' }]`         |
| `theme`             | `string`   | `'darkula'` | Syntax highlighting theme                       |
| `discovery`         | `boolean`  | `false`     | Include schema.org WebAPI discovery data        |
| `headings`          | `number`   | `2`         | Heading depth for TOC                           |
| `tocSummary`        | `boolean`  | `false`     | Use operation summary in TOC                    |
| `shallowSchemas`    | `boolean`  | `false`     | Don't expand $ref schemas                       |
| `expandBody`        | `boolean`  | `false`     | Expand request body schemas                     |
| `maxDepth`          | `number`   | `10`        | Max depth for schema examples                   |
| `yaml`              | `boolean`  | `false`     | Display schemas in YAML format                  |
| `resolve`           | `boolean`  | `false`     | Resolve external $refs                          |
| `source`            | `string`   | —           | Base URL for resolving refs                     |
| `includes`          | `string[]` | `[]`        | Files to include in output                      |
| `user_templates`    | `string`   | —           | Directory with custom doT.js templates          |
| `templateCallback`  | `function` | —           | Called before/after each template               |
| `html`              | `boolean`  | `false`     | Output HTML instead of Markdown                 |
| `respec`            | `object`   | —           | ReSpec config object (implies html)             |
| `clipboard`         | `boolean`  | `true`      | Include clipboard support                       |
| `customApiKeyValue` | `string`   | `'ApiKey'`  | Custom API key for code samples                 |
| `omitBody`          | `boolean`  | `false`     | Omit body param from table                      |
| `omitHeader`        | `boolean`  | `false`     | Omit YAML front-matter                          |
| `useBodyName`       | `boolean`  | `false`     | Use original param name for OAS2 body           |
| `verbose`           | `boolean`  | `false`     | Verbose output                                  |
| `experimental`      | `boolean`  | `false`     | Use experimental features                       |
| `toc_footers`       | `array`    | `[]`        | Footer links for TOC                            |

### Template Callback

The `templateCallback` option lets you hook into template rendering:

```javascript
widdershins.convert(api, {
  templateCallback: (templateName, stage, data) => {
    // stage is 'pre' or 'post'
    console.log(`${stage} rendering: ${templateName}`);
    return data; // must return data
  },
});
```

## Supported Input Formats

| Format        | Versions | Notes                             |
| ------------- | -------- | --------------------------------- |
| OpenAPI       | 3.0.x    | Full support                      |
| Swagger       | 2.0      | Auto-converted to OAS3 internally |
| AsyncAPI      | 1.x      | Topics-based messaging APIs       |
| Semoasa       | 0.1.0    | OpenAPI Extension Format          |
| API Blueprint | —        | Passthrough (already Markdown)    |

## Supported Output Formats

| Format   | Use With                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown | [Slate](https://github.com/slatedocs/slate), [ReSlate](https://github.com/mermade/reslate), [Shins](https://github.com/mermade/shins) |
| HTML     | [ReSpec](https://github.com/w3c/respec), custom doc sites                                                                             |

## CLI Usage

The CLI is available but the library API is recommended for app integration:

```bash
npx widdershins-reborn [options] {input-file|url} [[-o] output-markdown]
```

```bash
widdershins-reborn --search false --language_tabs 'python:Python' api.json -o docs.md
```

Run `widdershins-reborn --help` for all options.

## Custom Templates

Override the default doT.js templates by passing a directory:

```javascript
widdershins.convert(api, {
  user_templates: './my-templates',
});
```

Template docs:

- [OpenAPI 3.0 / Swagger 2.0 templates](/templates/openapi3/README.md)
- [AsyncAPI 1.x templates](/templates/asyncapi1/README.md)
- [Semoasa templates](/templates/semoasa/README.md)

## Tests

```bash
npm test
```

## Credits

- Original project by [Mike Ralphson](https://github.com/Mermade) (Mermade Software)
- Logo by [@latgeek](https://github.com/LatGeek)
- httpsnippet support by [@vfernandestoptal](https://github.com/vfernandestoptal)

## License

[MIT](LICENSE) — Original work Copyright (c) 2016 Mermade Software, fork maintained by Sikandar.
