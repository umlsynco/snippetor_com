# snippetor_com

Software Architecture Snippets for the Chrome Browser — Chromium Architecture Notes.

A React + TypeScript + Vite site with short code walkthroughs and diagrams exploring the Chromium codebase.

## Snippet data layout

Snippet data is served as static files under `public/theme/`, not bundled into the app:

- `public/theme/{themeId}/list.json` — an array of snippet entries for that theme (`title`,
  `description`, `modified`, `projects`, `uml_path`, `snippet_path`, `notes`, `repo`). Fetched at
  runtime to render both a theme's card grid and the snippet player.
- `public/theme/{themeId}/{snippet_title}/{snippetname}.snippet.json` — the hand-authored source
  for one snippet (schema 2: a top-level `content` object with `title`, `description`, `modified`
  as epoch ms, a `repos` array, `notes` referencing a repo by `rid`, and optional `diagrams`).
  `add_snippet.py` reads this file to populate the entry above; it isn't fetched by the app itself.

`themeId` matches the `slug` values in `src/data/topics.ts` (`weblayers`, `chromeextensions`,
`profile`, `copypaste`, `networkssl`, `sandboxzygote`, `webui`).

The source files a snippet's steps point at are pulled from Chromium and served the same way, at
`public/chromium/{commit_sha}/{path}` (see `src/utils/sourceFiles.ts`). Fetch them with:

```bash
python3 scripts/pull_chromium_file.py <commit_sha> <path> [<path> ...]
```

e.g. `python3 scripts/pull_chromium_file.py main weblayer/browser/browser_impl.cc`. Files already
present are skipped; pass `--force` to re-fetch.

To register a new snippet once you've hand-authored its `.snippet.json` (and any diagram files) under
`public/theme/{themeId}/{snippet_folder}/`, run:

```bash
python3 scripts/add_snippet.py public/theme/{themeId}/{snippet_folder}/{snippet_name}.snippet.json
```

This pulls every note's source file (via `pull_chromium_file.py`, grouped by the repo each note's
`rid` points at, skipping non-code extensions and files already present), validates that any
declared `diagrams` exist on disk (a snippet with none is fine), and then adds/updates its entry
in that theme's `list.json`. Stops with a non-zero exit code, without touching `list.json`, if
pulling or diagram validation fails.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Cloudflare Pages)

```bash
npm run deploy
```

This builds the project and publishes the `dist` folder to Cloudflare Pages via Wrangler.
