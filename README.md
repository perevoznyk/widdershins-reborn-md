# widdershins-reborn

> **The maintained OpenAPI-to-Markdown converter.** Convert [OpenAPI 3.0/3.1](https://spec.openapis.org/oas/v3.1.0), [Swagger 2.0](https://swagger.io/specification/v2/), [AsyncAPI 1.x/2.x](https://www.asyncapi.com/), and [Semoasa](https://github.com/mermade/semoasa) definitions into clean Markdown or HTML documentation — for [Slate](https://github.com/slatedocs/slate), [Redoc](https://redocly.com/docs/redoc), [ReSpec](https://github.com/w3c/respec), or any static site generator.

[![npm version](https://img.shields.io/npm/v/widdershins-reborn.svg)](https://www.npmjs.com/package/widdershins-reborn)
[![npm downloads](https://img.shields.io/npm/dm/widdershins-reborn.svg)](https://www.npmjs.com/package/widdershins-reborn)
[![Socket Badge](https://socket.dev/api/badge/npm/package/widdershins-reborn/latest)](https://socket.dev/npm/package/widdershins-reborn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/sikandarsubhani/widdershins-reborn/ci.yaml?branch=main)](https://github.com/sikandarsubhani/widdershins-reborn/actions)

## Why widdershins-reborn?

[widdershins](https://github.com/Mermade/widdershins) was the go-to OpenAPI-to-Markdown tool but has been **unmaintained since 2020**. It doesn't work with Node 20+, has known security vulnerabilities, and lacks ESM/TypeScript support.

**widdershins-reborn** picks up where widdershins left off:

| | widdershins | widdershins-reborn |
|---|---|---|
| Last updated | 2020 | 2026 |
| Node.js | 8–14 | 20+ |
| ESM support | No | Yes |
| TypeScript types | No | Yes |
| OAS 3.1 | No | Yes (type arrays, const, nullable) |
| AsyncAPI 2.x | No | Yes |
| Docker | No | Yes |
| cleanMarkdown | No | Yes (pure markdown output) |
| Security | 13+ known vulns | 0 vulnerabilities |
| Maintained | No | Yes |

## Install

```bash
npm install widdershins-reborn
```

Or use Docker:

```bash
docker run --rm -v $(pwd):/app widdershins-reborn /app/api.json -o /app/docs.md
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

## Migrating from widdershins

Drop-in replacement — just change the package name:

```bash
npm uninstall widdershins
npm install widdershins-reborn
```

```diff
- const widdershins = require('widdershins');
+ const widdershins = require('widdershins-reborn');
```

```diff
- "widdershins": "^3.0.0"
+ "widdershins-reborn": "^0.1.4"
```

The API is identical. New options available:

```javascript
widdershins.convert(api, {
  cleanMarkdown: true,  // new: pure markdown output
  // ...all existing options still work
});
```

## Who uses widdershins-reborn?

widdershins-reborn is used for generating API documentation from OpenAPI, Swagger, and AsyncAPI specs in:

- **Static doc sites** — Slate, Redoc, ReDocly, custom generators
- **CI/CD pipelines** — automated doc generation on spec changes
- **Node.js apps** — runtime markdown generation (Next.js, Express, Fastify)
- **Docker pipelines** — zero-dependency doc builds
- **Microservices** — event-driven API docs from AsyncAPI

## Comparison with alternatives

| Tool | Input Formats | Output | Library API | Docker | Maintained |
|---|---|---|---|---|---|
| [widdershins-reborn](https://www.npmjs.com/package/widdershins-reborn) | OAS 3.0/3.1, Swagger 2.0, AsyncAPI 1.x/2.x, Semoasa | Markdown, HTML | Yes | Yes | Yes |
| [redoc](https://www.npmjs.com/package/redoc) | OpenAPI 3.x | HTML only | Yes | Yes | Yes |
| [swagger-ui](https://www.npmjs.com/package/swagger-ui) | OpenAPI 3.x, Swagger 2.0 | HTML only | Yes | Yes | Yes |
| [openapi-to-md](https://www.npmjs.com/package/openapi-to-md) | OpenAPI 3.x | Markdown | Yes | No | No |
| [openapi-diff](https://www.npmjs.com/package/openapi-diff) | OpenAPI 3.x | Diff only | Yes | No | No |

## Credits

- Original project by [Mike Ralphson](https://github.com/Mermade) (Mermade Software)
- Logo by [@latgeek](https://github.com/LatGeek)
- httpsnippet support by [@vfernandestoptal](https://github.com/vfernandestoptal)

## License

[MIT](LICENSE) — Original work Copyright (c) 2016 Mermade Software, fork maintained by Sikandar.
