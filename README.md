# widdershins-reborn

> A maintained fork of [widdershins](https://github.com/Mermade/widdershins) — designed as a **library-first** API for converting OpenAPI/Swagger/AsyncAPI definitions to Markdown or HTML.

[![npm version](https://img.shields.io/npm/v/widdershins-reborn.svg)](https://www.npmjs.com/package/widdershins-reborn)
[![Socket Badge](https://socket.dev/api/badge/npm/package/widdershins-reborn/latest)](https://socket.dev/npm/package/widdershins-reborn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why widdershins-reborn?

The original `widdershins` package was CLI-focused and unmaintained since 2020. This fork is:

- **Library-first** — clean JS API, perfect for apps, build pipelines, and doc generators
- **Actively maintained** — bug fixes, dependency updates, new features
- **Modern Node.js** — requires Node >= 20
- **TypeScript-ready** — type definitions included

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

## Pure Markdown Output

Use `cleanMarkdown: true` to get clean, publish-ready markdown with no HTML tags, a generated TOC, and YAML frontmatter:

```javascript
const markdown = await widdershins.convert(api, {
  cleanMarkdown: true,
  sample: true,
  language_tabs: [],
});
```

This will:
- Convert all HTML headings/links to markdown
- Strip placeholder JSON sample blocks
- Generate a table of contents
- Add YAML frontmatter with API metadata (title, version, servers, stats)
- Normalize heading hierarchy (title=h1, sections=h2, operations=h3)

Use `omitHeader: true` to skip the YAML frontmatter while keeping other cleanups.

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
| `cleanMarkdown`     | `boolean`  | `false`     | Post-process to pure markdown (HTML→md, strip placeholder JSON, generate TOC & frontmatter) |
| `raw`               | `boolean`  | `false`     | Output raw schemas instead of examples          |
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
| OpenAPI       | 3.0.x, 3.1.x | Full support (3.1: type arrays, const, nullable) |
| Swagger       | 2.0      | Auto-converted to OAS3 internally |
| AsyncAPI      | 1.x, 2.x | Topics/messaging APIs             |
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

Validate an API definition without generating output:

```bash
widdershins-reborn --validate api.json
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

- [OpenAPI 3.0 / 3.1 / Swagger 2.0 templates](/templates/openapi3/README.md)
- [AsyncAPI 1.x templates](/templates/asyncapi1/README.md)
- [AsyncAPI 2.x templates](/templates/asyncapi2/README.md)
- [Semoasa templates](/templates/semoasa/README.md)

## Docker

Run without installing Node.js — Docker is the only dependency:

```bash
docker run --rm -v $(pwd):/app widdershins-reborn api.json -o /app/docs.md
```

With options:

```bash
docker run --rm \
  -v $(pwd):/app \
  widdershins-reborn \
  /app/api.json \
  --search false \
  --cleanMarkdown \
  --language_tabs 'python:Python' \
  -o /app/docs.md
```

Build locally:

```bash
docker build . -t widdershins-reborn
```

## Tests

```bash
npm test
```

## Publishing

**npmjs.org:**

```bash
npm publish
```

**GitHub Packages:**

1. Create a [personal access token](https://github.com/settings/tokens) with `write:packages` scope
2. Add to your global `~/.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN
   ```
3. Add to your project `.npmrc`:
   ```
   @sikandarsubhani:registry=https://npm.pkg.github.com
   ```
4. Publish (GitHub Packages requires a scoped name):
   ```bash
   npm pkg set name='@sikandarsubhani/widdershins-reborn'
   npm publish --registry=https://npm.pkg.github.com --access=public
   npm pkg set name='widdershins-reborn'
   ```

## Credits

- Original project by [Mike Ralphson](https://github.com/Mermade) (Mermade Software)
- Logo by [@latgeek](https://github.com/LatGeek)
- httpsnippet support by [@vfernandestoptal](https://github.com/vfernandestoptal)

## License

[MIT](LICENSE) — Original work Copyright (c) 2016 Mermade Software, fork maintained by Sikandar.
