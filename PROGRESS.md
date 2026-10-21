# Progress Log — Lumen (English-only + bug fixes)

## Goal
Convert the Electron smart-home app from Romanian to English-only, fix bugs, and address packaging risks. Target app name: **Lumen**.

## Completed

### TASK 1 — Inventory (docs created)
- Created `docs/glossary.md`: full Romanian → English mapping table covering category keys, device states, room names, function/variable names, non-ASCII identifiers, page file names, stored keys, locale-specific code, and app name.
- Created `PROGRESS.md`: this file.
- Inventory findings:
  - All 10 HTML pages use `lang="ro"` and contain Romanian UI text.
  - JS files (app.js, ui.js, validation.js, main.js, components.js) contain Romanian identifiers, comments, and inline `window.*` globals.
  - CSS (style.css) contains Romanian comments.
  - Stored keys: localStorage (smartHomeCustomScenes, smartHomeData, smartHomeData_fallback, alarmaDezactivata, numeCasaSalvat, temp-*/umid-*, pericolInundatie, pericolIncendiu, etc.) + IndexedDB SmartHomeDB/stateStore/key smartHomeData.
  - Non-ASCII identifiers: apasăTastăNumpad, proceseazăAcțiuneAlarmă, actualizeazăEcranSecuritate, valideazaTemperaturaCameră, ajusteazaValoareCameră.
  - Packaging risks identified (components.js classic script, no rollupOptions.input, assetsDir collision, icon.ico missing, packager ignore patterns).

## In Progress
- (none yet)

## Remaining

### Step 2 — Rename identifiers, strings, values, keys (with migrations)
- Rename all Romanian function/variable names per glossary.
- Translate all user-visible UI strings in HTML and JS to English.
- Translate device states, category keys, room names.
- Rename page files (scene→scenes, etc.) and update nav links in components.js + all pages.
- Migrate stored keys (localStorage + IndexedDB) with backward-compatible migration logic.
- Translate comments in JS and CSS.

### Step 3 — Packaging fixes
- Add `type="module"` to components.js script tags (or bundle via rollup input).
- Add `build.rollupOptions.input` for all 10 HTML pages in vite.config.js.
- Resolve Vite assetsDir "assets" collision with images folder.
- Ensure `assets/icon.ico` exists for electron-main.js.
- Fix electron-packager `--ignore` patterns so bundled JS/CSS are included.

### Step 4 — Build & test
- Run `npm run build` and verify no errors.
- Manual test of each page (Home, Scenes, Accessories, Automations, Statistics, Rooms, Map, Security, Hazards, Settings).

## Open Questions
- Should IndexedDB be renamed from `SmartHomeDB` → `LumenDB` (requires version bump + migration)?
- Should `icon.ico` be created, or should electron-main.js reference an existing asset?
- Confirm the exact list of page file renames desired (glossary proposes scenes/accessories/automations/statistics/rooms/map/security/hazards/settings).
