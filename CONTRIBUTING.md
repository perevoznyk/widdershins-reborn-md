# Contributing to widdershins-reborn

Thanks for your interest in contributing! This is a community-maintained fork of [widdershins](https://github.com/Mermade/widdershins).

## Development Setup

```bash
git clone https://github.com/sikandarsubhani/widdershins-reborn.git
cd widdershins-reborn
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests with coverage (mocha + nyc) |
| `npm run lint` | Run ESLint |
| `npm run build` | Rebuild pre-compiled templates (from `.dot` sources) |

## Project Structure

```
lib/
  index.js              Main entry — dispatches to format-specific converter
  common.js             Shared utilities (slugify, schemaToArray, etc.)
  openapi2.js           Swagger 2.0 converter
  openapi3.js           OpenAPI 3.x converter
  asyncapi1.js          AsyncAPI 1.x converter
  asyncapi2.js          AsyncAPI 2.x converter
  semoasa.js            Semoasa converter
  apiblueprint.js       API Blueprint converter
  harGenerator.js       HAR request generator
  httpsnippetGenerator.js  Code snippet generator via HTTPSnippet
  templates/            Pre-compiled doT templates
widdershins.js          CLI entry point
types/index.d.ts        TypeScript declarations
test/                   Unit tests
```

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm test` and `npm run lint` — both must pass
4. Open a PR against `main`

## Templates

Templates use [doT.js](https://github.com/olado/do). Source `.dot` files are compiled via `npm run build` into `lib/templates/`. The compiled templates are committed to git — you do not need to run the build step for most changes.

## Code Style

- CommonJS (`require` / `module.exports`)
- No trailing commas on single-line constructs
- ESLint enforces style — run `npm run lint` before committing

## Testing

Tests are in `test/` and use mocha + assert. Add tests for any new functionality:

```bash
npm test          # Run all tests
npx nyc report    # View coverage report
```

## Reporting Issues

Use [GitHub Issues](https://github.com/sikandarsubhani/widdershins-reborn/issues) for bug reports and feature requests.
