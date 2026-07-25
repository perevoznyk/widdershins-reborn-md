# Widdershins Reborn — Fork & Maintain Plan

> **Focus:** Library-first — optimized for app/JS consumption, CLI is secondary.

## 1. Current Status

| Item | Detail |
|---|---|
| **Original Project** | [widdershins](https://github.com/Mermade/widdershins) |
| **Author** | Mike Ralphson (Mermade Software) |
| **Last Release** | v4.0.1 — ~6 years ago (2020) |
| **License** | MIT (Copyright 2016 Mermade Software) |
| **npm Package** | `widdershins` |
| **Current Maintainer** | Abandoned / unmaintained |
| **Dependabot** | Still active on original repo, PRs piling up |
| **Node Support** | Tested on Node 14.x / 16.x (both EOL) |
| **Dependencies** | 16 runtime deps, many outdated (node-fetch v2, yaml v1, yargs v12, etc.) |

---

## 2. Legal / Licensing — Can You Fork & Publish?

**Yes, you can.** Here's why:

### MIT License Terms
The project is MIT-licensed. MIT allows:
- **Forking** the code
- **Modifying** the code
- **Distributing** (publishing) under a **new name**
- **Commercial use**
- **Sublicensing**

### What You MUST Do (MIT Requirements)
1. **Keep the original copyright notice** in the LICENSE file (or a copy of it)
2. **Include the MIT license text** in all copies/substantial portions
3. **Do not use the original author's name** to imply endorsement

### What You Should Do (Best Practice)
- **Rename the package** to avoid confusion with the original
- Add your own copyright alongside the original in LICENSE
- Clearly state in your README that this is a fork of `widdershins`
- Link back to the original project for attribution

### Example LICENSE
```
MIT License

Original work Copyright (c) 2016 Mermade Software
Fork maintained by [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, ...
```

---

## 3. Renaming the Package

### New Name Options
| Option | npm Package | GitHub Repo | Notes |
|---|---|---|---|
| `widdershins-reborn` | `widdershins-reborn` | `widdershins-reborn` | Clear signal it's a maintained fork |
| `widdershins-next` | `widdershins-next` | `widdershins-next` | Signals modernization |
| `api-docs-gen` | `api-docs-gen` | `api-docs-gen` | Generic, descriptive |
| `openapi-to-md` | `openapi-to-md` | `openapi-to-md` | Describes what it does |
| `widdershins-ng` | `widdershins-ng` | `widdershins-ng` | Common "next gen" convention |

### Files to Update for Renaming
1. `package.json` — `name`, `repository`, `bugs`, `homepage`, `bin`, `keywords`
2. `README.md` — Title, badges, links, installation instructions
3. `LICENSE` — Add your copyright
4. `widdershins.js` (CLI) — Any internal references to the old name
5. `templates/` — Any hardcoded references to "widdershins"
6. `.github/workflows/ci.yaml` — Repo-specific paths
7. `docs/` — All documentation files

---

## 4. What Needs Modernization

### 4.1 Node.js Version Support
| Current | Target | Action |
|---|---|---|
| Node 14.x (EOL) | Node 18.x LTS | Update CI matrix |
| Node 16.x (EOL) | Node 20.x LTS | Update CI matrix |
| Node.js not specified | Node 22.x LTS | Add to CI matrix |

**Update `.github/workflows/ci.yaml`:**
```yaml
matrix:
  node-version: [18.x, 20.x, 22.x]
```

### 4.2 Outdated Dependencies — Full Audit

#### Runtime Dependencies (16)
| Package | Current | Latest | Priority | Notes |
|---|---|---|---|---|
| `dot` | ^1.1.3 | 1.1.3 | LOW | Template engine, stable |
| `highlightjs` | ^9.16.2 | → use `highlight.js` | HIGH | Package name changed, current pkg is deprecated |
| `httpsnippet` | ^1.22.0 | 3.x+ | HIGH | Major version bump, API changes |
| `jgexml` | ^0.4.4 | ? | LOW | JSON-XML, small pkg |
| `markdown-it` | ^12.1.0 | 14.x+ | HIGH | Major bumps |
| `markdown-it-emoji` | ^2.0.0 | 3.x | MEDIUM | |
| `node-fetch` | ^2.6.1 | 3.x (ESM) or use native `fetch` | HIGH | Node 18+ has native fetch |
| `oas-resolver` | ^2.5.6 | ? | MEDIUM | May have updates |
| `oas-schema-walker` | ^1.1.5 | ? | LOW | |
| `openapi-sampler` | ^1.1.0 | 1.x latest | MEDIUM | |
| `pinyin` | ^2.9.1 | 2.x latest | LOW | |
| `reftools` | ^1.1.9 | 1.x latest | LOW | |
| `swagger2openapi` | ^7.0.8 | 9.x+ | HIGH | Major version bumps |
| `urijs` | ^1.19.2 | 1.19.x | LOW | Deprecated, consider alternatives |
| `yaml` | ^1.10.0 | 2.x | HIGH | Major version bump |
| `yargs` | ^12.0.5 | 17.x | MEDIUM | Major version bump |

#### Dev Dependencies (4)
| Package | Current | Latest | Notes |
|---|---|---|---|
| `mdv` | ^1.3.0 | ? | Markdown validator |
| `mocha` | ^9.0.2 | 10.x+ | Major version bump |
| `node-readfiles` | ^0.2.0 | ? | |
| `nyc` | ^15.0.0 | 17.x | Major version bump |

### 4.3 Code Quality
| Issue | Location | Fix |
|---|---|---|
| `'use strict'` everywhere | All files | Converted to ESM in Phase 4 |
| No TypeScript | Entire codebase | Add `.d.ts` type declarations in Phase 4 |
| No `.npmignore` or `files` field | `package.json` | Add `files` field in Phase 4 |
| Old ESLint config | `.eslintrc.json` | Update to flat config in Phase 5 |
| No lockfile strategy | `package-lock.json` | Review if deps are properly locked |

### 4.4 Module System Support (CJS + ESM + TypeScript)

This is a **CRITICAL** modernization task. The current codebase is CJS-only (`require()`/`module.exports`), which excludes a huge portion of the modern JS ecosystem.

#### Current State
- All files use `'use strict'` + `require()` / `module.exports`
- `package.json` has no `"type"` field (defaults to CJS)
- No `"exports"` map
- No TypeScript declarations
- No ESM entry point

#### Target State — Dual Package (CJS + ESM)
The fork should support **all three module systems** so it works everywhere:

| Consumer | How They Import | Must Work |
|---|---|---|
| **CJS** (Node scripts, legacy) | `const w = require('widdershins-reborn')` | YES |
| **ESM** (modern Node, Vite, etc.) | `import w from 'widdershins-reborn'` | YES |
| **TypeScript** | `import w from 'widdershins-reborn'` | YES (with `.d.ts`) |
| **Deno / Bun** | `import w from 'npm:widdershins-reborn'` | YES (via ESM) |
| **Browser (bundled)** | via esbuild/Rollup/Webpack | YES (via ESM) |
| **CLI** | `npx widdershins-reborn` | YES |

#### Dual Package Strategy

The recommended approach is the **"Dual Package" pattern** using a shared source with two entry points:

```
project/
├── src/                    # Source files (write here)
│   ├── index.js
│   ├── common.js
│   ├── openapi3.js
│   └── ...
├── dist/                   # Build output (generated)
│   ├── cjs/                # CommonJS build
│   │   ├── index.js
│   │   └── package.json    # { "type": "commonjs" }
│   └── esm/                # ES Modules build
│       ├── index.js
│       └── package.json    # { "type": "module" }
├── types/                  # TypeScript declarations
│   ├── index.d.ts
│   └── ...
├── package.json            # Dual exports map
└── ...
```

#### package.json Exports Map
```json
{
  "name": "widdershins-reborn",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./types/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./types/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./types/index.d.cts",
        "default": "./dist/cjs/index.js"
      }
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "types",
    "templates",
    "statusCodes.json"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Build Tool Options

| Tool | Pros | Cons | Recommendation |
|---|---|---|---|
| **tsup** | Zero-config, generates CJS+ESM+.d.ts, based on esbuild | Adds dev dep | **RECOMMENDED** |
| **rollup** | Flexible, well-tested | Config-heavy | Good alternative |
| **esbuild** | Fast, simple | No `.d.ts` generation | Pair with `tsc` for types |
| **unbuild** | Auto CJS/ESM, good DX | Newer, less battle-tested | Experimental |
| **manual** | No build step | Maintain two codebases | Do NOT do this |

#### Recommended Build Setup with tsup

```bash
npm install -D tsup @types/node
```

`tsup.config.ts`:
```typescript
import { defineConfig } from 'tsup';

export default defineConfig([
  // CJS build
  {
    entry: ['lib/**/*.js'],
    outDir: 'dist/cjs',
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    dts: false,
    clean: true,
  },
  // ESM build
  {
    entry: ['lib/**/*.js'],
    outDir: 'dist/esm',
    format: 'esm',
    platform: 'node',
    target: 'node18',
    dts: false,
    clean: false,
  },
]);
```

#### TypeScript Declarations (.d.ts)

Generate type declarations so TypeScript users get full autocomplete:

```bash
npm install -D typescript
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types",
    "emitDeclarationOnly": true,
    "allowJs": true,
    "checkJs": false,
    "outDir": "./types",
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["lib/**/*.js"]
}
```

At minimum, create a manual `types/index.d.ts`:
```typescript
export interface ConvertOptions {
  codeSamples?: boolean;
  httpsnippet?: boolean;
  language_tabs?: Array<Record<string, string>>;
  language_clients?: Array<Record<string, string>>;
  theme?: string;
  search?: boolean;
  sample?: boolean;
  discovery?: boolean;
  headings?: number;
  tocSummary?: boolean;
  shallowSchemas?: boolean;
  expandBody?: boolean;
  maxDepth?: number;
  yaml?: boolean;
  resolve?: boolean;
  source?: string;
  includes?: string[];
  user_templates?: string;
  templateCallback?: (templateName: string, stage: string, data: any) => any;
  toc_footers?: Array<{ url: string; description: string }>;
  clipboard?: boolean;
  customApiKeyValue?: string;
  omitBody?: boolean;
  omitHeader?: boolean;
  useBodyName?: boolean;
  verbose?: boolean;
  raw?: boolean;
}

export function convert(api: object, options?: ConvertOptions): Promise<string>;
```

#### CLI Entry Point Update

The CLI (`widdershins.js`) must work with both CJS and ESM. Keep it as CJS since it's a binary script:

```javascript
#!/usr/bin/env node
'use strict';
// CJS CLI entry — always works
const { convert } = require('./dist/cjs/index.js');
// ... rest of CLI logic
```

Or make it ESM if `"type": "module"`:
```javascript
#!/usr/bin/env node
// ESM CLI entry
import { convert } from './dist/esm/index.js';
```

#### Files That Need Conversion for Dual Support

| File | Current Module | Action |
|---|---|---|
| `lib/index.js` | CJS | Move to `src/`, keep as ESM source |
| `lib/common.js` | CJS | Move to `src/` |
| `lib/openapi3.js` | CJS | Move to `src/` |
| `lib/openapi2.js` | CJS | Move to `src/` |
| `lib/asyncapi1.js` | CJS | Move to `src/` |
| `lib/semoasa.js` | CJS | Move to `src/` |
| `lib/apiblueprint.js` | CJS | Move to `src/` |
| `lib/harGenerator.js` | CJS | Move to `src/` |
| `lib/httpsnippetGenerator.js` | CJS | Move to `src/` |
| `lib/jsonTrunc.js` | CJS | Move to `src/` |
| `widdershins.js` | CJS | Keep as CJS or convert to ESM |
| `testRunner.js` | CJS | Keep as CJS or convert to ESM |

#### Dependency ESM Compatibility Issues

Some current deps are CJS-only and need alternatives for full ESM support:

| Package | Current | ESM Compatible? | Alternative |
|---|---|---|---|
| `dot` | ^1.1.3 | CJS only | Keep CJS (works via bundler) |
| `highlightjs` | ^9.16.2 | CJS only | Use `highlight.js` (has ESM) |
| `httpsnippet` | ^1.22.0 | CJS only | v3+ has ESM support |
| `jgexml` | ^0.4.4 | CJS only | Keep CJS |
| `markdown-it` | ^12.1.0 | Has ESM | Use ESM import |
| `node-fetch` | ^2.6.1 | v3 is ESM-only | Use native `fetch` |
| `oas-resolver` | ^2.5.6 | CJS only | Keep CJS |
| `oas-schema-walker` | ^1.1.5 | CJS only | Keep CJS |
| `openapi-sampler` | ^1.1.0 | CJS only | Keep CJS |
| `pinyin` | ^2.9.1 | CJS only | Keep CJS |
| `reftools` | ^1.1.9 | CJS only | Keep CJS |
| `swagger2openapi` | ^7.0.8 | CJS only | Keep CJS |
| `urijs` | ^1.19.2 | CJS only | Deprecated, replace with `url` API or `uritemplate` |
| `yaml` | ^1.10.0 | v2 has ESM | Use ESM import |
| `yargs` | ^12.0.5 | v17 has ESM | Use ESM import |

**Key insight:** CJS-only deps will still work in ESM builds via the bundler (tsup/rollup). They get `require()`d and wrapped. Full ESM purity of all deps is NOT required for the dual package to work.

### 4.5 Feature Gaps
| Gap | Details | Priority |
|---|---|---|
| OpenAPI 3.1 support | OAS 3.1 has significant changes (webhooks, JSON Schema 2020-12) | HIGH |
| AsyncAPI 2.x/3.x support | Current only supports 1.x | HIGH |
| Better error handling | Many bare `catch` blocks | MEDIUM |
| Input validation | Limited validation of input specs | MEDIUM |
| Watch mode | No `--watch` for dev workflows | LOW |

---

## 5. Complete Action Plan

### Phase 1: Fork & Rename (Day 1)
- [ ] Create GitHub repo under your org/account
- [ ] Push forked code to new repo
- [ ] Update `package.json`:
  - `name` → new package name
  - `version` → `1.0.0` (fresh start)
  - `repository` → new repo URL
  - `bugs` → new repo issues URL
  - `homepage` → new repo URL
  - `author` → your name/org
  - `license` → MIT (with dual copyright)
- [ ] Update `LICENSE` file with dual copyright
- [ ] Update `README.md`:
  - New name, badges, installation instructions
  - Add "Forked from widdershins" attribution
  - Remove old author's personal links
- [ ] Rename CLI binary if desired (in `package.json` `bin` field)
- [ ] Update all internal references to the old package name

### Phase 2: Dependency Updates (Week 1)
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update `node-fetch` → native `fetch` (Node 18+) or `node-fetch` v3
- [ ] Update `yaml` v1 → v2 (breaking changes)
- [ ] Update `yargs` v12 → v17
- [ ] Update `markdown-it` v12 → v14
- [ ] Update `httpsnippet` v1 → v3
- [ ] Replace deprecated `highlightjs` with `highlight.js`
- [ ] Update `swagger2openapi` to latest
- [ ] Update dev deps: `mocha` v10+, `nyc` v17
- [ ] Test everything after each update

### Phase 3: CI/CD Modernization (Week 1)
- [ ] Update `.github/workflows/ci.yaml`:
  - Node 18.x, 20.x, 22.x
  - Remove Node 14.x/16.x
  - Update `actions/checkout`, `actions/setup-node` to latest
- [ ] Add `dependabot.yml` updates for new repo
- [ ] Add GitHub release workflow
- [ ] Add npm publish workflow (on tag push)
- [ ] Add CodeQL or similar security scanning

### Phase 4: CJS/ESM/TypeScript Dual Support (Week 2)
- [ ] Install `tsup`, `typescript` as dev dependencies
- [ ] Create `tsup.config.ts` for dual CJS+ESM builds
- [ ] Move source files from `lib/` to `src/`
- [ ] Convert CJS `require()`/`module.exports` to ESM `import`/`export` in source
- [ ] Build both `dist/cjs/` and `dist/esm/` outputs
- [ ] Add `"exports"` map to `package.json`
- [ ] Add `"type": "module"` to `package.json`
- [ ] Generate TypeScript declarations (`.d.ts`) via `tsc`
- [ ] Create `types/index.d.ts` with full type definitions for `convert()` and `ConvertOptions`
- [ ] Add `"types"` field to `package.json`
- [ ] Add `"files"` field to `package.json` (only publish `dist/`, `types/`, `templates/`)
- [ ] Add `"engines": { "node": ">=18.0.0" }` to `package.json`
- [ ] Update CLI entry point to work with both CJS and ESM consumers
- [ ] Verify `require('widdershins-reborn')` works
- [ ] Verify `import w from 'widdershins-reborn'` works
- [ ] Verify TypeScript `import { convert } from 'widdershins-reborn'` provides types
- [ ] Update `.gitignore` to ignore `dist/` and `types/` (generated files)
- [ ] Add `prepublishOnly` script: `tsup && tsc`

### Phase 5: Code Quality & Polish (Week 3)
- [ ] Update ESLint config (flat config or modernize rules)
- [ ] Add proper error handling throughout
- [ ] Add JSDoc annotations to all exported functions
- [ ] Run `npm audit` and fix all vulnerabilities
- [ ] Ensure all tests pass with new build pipeline
- [ ] Test with Node 18, 20, 22 in CI

### Phase 6: Feature Additions (Week 3-4)
- [ ] Add OpenAPI 3.1 support
- [ ] Add AsyncAPI 2.x support (or note as future work)
- [ ] Add `--watch` mode
- [ ] Improve CLI help and error messages
- [ ] Add `--validate` option to validate input before converting

### Phase 7: Publish & Launch (Week 4-5)
- [ ] `npm login` with your npm account
- [ ] `npm publish` the 1.0.0 release
- [ ] Create GitHub release with changelog
- [ ] Announce on relevant communities
- [ ] Set up issue templates for new repo
- [ ] Add CONTRIBUTING.md

---

## 6. Files That Reference the Old Name

These files need text replacement during renaming:

| File | What to Change |
|---|---|
| `package.json` | name, repository, bugs, homepage, bin keys |
| `README.md` | Title, badges, all references |
| `LICENSE` | Add your copyright |
| `widdershins.js` | Internal name references |
| `lib/index.js` | Any comments |
| `lib/openapi3.js` | References to widdershins extensions |
| `lib/common.js` | Extension cleaning (`x-widdershins-*`) |
| `templates/openapi3/README.md` | Template docs |
| `templates/asyncapi1/README.md` | Template docs |
| `templates/semoasa/README.md` | Template docs |
| `docs/README.md` | Documentation site |
| `docs/ConvertingFilesBasicCLI.md` | CLI docs |
| `docs/ConvertingFilesBasicJS.md` | JS API docs |
| `.github/workflows/ci.yaml` | Repo paths |
| `.github/dependabot.yml` | Repo config |
| `testRunner.js` | Any references |
| `example_env.json` | Comments if any |
| `whiteboard_env.json` | Comments if any |

**Note on `x-widdershins-*` extensions:** The codebase uses `x-widdershins-sample`, `x-widdershins-name` etc. as OpenAPI vendor extensions. These are functional (used in templates/logic), not branding. You can keep them for backward compatibility or rename them. Renaming them would be a breaking change for anyone using custom templates.

---

## 7. Recommended New Package Name

**`widdershins-reborn`** is the strongest choice because:
- Preserves the original identity (users searching for "widdershins" will find it)
- "Reborn" clearly signals it's a maintained fork
- The repo directory is already named this
- Short, memorable, no conflicts on npm (check availability before publishing)

### Check npm availability:
```bash
npm view widdershins-reborn
# If 404 → available
```

---

## 8. Estimated Effort

| Phase | Effort | Timeline |
|---|---|---|
| Fork & Rename | 2-4 hours | Day 1 |
| Dependency Updates | 1-2 days | Week 1 |
| CI/CD Modernization | 4-8 hours | Week 1 |
| CJS/ESM/TypeScript Dual Support | 2-3 days | Week 2 |
| Code Quality & Polish | 1-2 days | Week 3 |
| Feature Additions | 3-5 days | Weeks 3-4 |
| Testing & QA | 2-3 days | Week 4 |
| Publish & Launch | 4-8 hours | Week 5 |
| **Total** | **~3-4 weeks** | **5 weeks** |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Breaking changes in dep updates | Update one at a time, run tests after each |
| Template compatibility with existing users | Keep `x-widdershins-*` extensions, version as 1.0.0 |
| npm name taken | Check availability, fallback to alternatives |
| Community confusion with original | Clear README, good docs, active issue management |
| Original author returns | MIT license means you can always maintain your fork |
| CJS-only deps block ESM purity | Bundler (tsup) wraps CJS deps automatically — no issue |
| TypeScript `.d.ts` out of sync | Generate from source, add CI check |
| Dual package "instance" bug | Use `dist/cjs/` and `dist/esm/` with `package.json` per directory to avoid identity issues |

---

## 10. Success Criteria

- [ ] Package published on npm under new name
- [ ] `require('widdershins-reborn')` works (CJS)
- [ ] `import w from 'widdershins-reborn'` works (ESM)
- [ ] TypeScript `import` provides full type definitions (`.d.ts`)
- [ ] CLI works: `npx widdershins-reborn <input> -o <output>`
- [ ] All tests passing on Node 18/20/22
- [ ] Zero `npm audit` vulnerabilities
- [ ] All dependencies up to date
- [ ] CI/CD fully automated (lint + test + build)
- [ ] Documentation complete
- [ ] At least 1 public user/testimonial
