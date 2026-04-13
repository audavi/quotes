## Cursor Cloud specific instructions

**Quotify** is a zero-dependency static web application (vanilla HTML/CSS/JS) that displays inspirational quotes. There is no build step, no package manager, no test framework, and no linter configured.

### Running the app

Serve the repository root with any static HTTP server:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in Chrome.

### Key caveats

- **No npm/pip/etc.** — there are no dependencies to install. The update script is intentionally a no-op (`echo ok`).
- **Clipboard API** requires an HTTP origin (`http://` or `https://`); opening `index.html` via `file://` will break the Copy button.
- **Google Fonts** are loaded from CDN. If the VM has no internet the app still works but falls back to system fonts.
- **No automated tests or linting** exist in the repo. Validation is manual (open in browser, interact with features).
- All application state (favorites, theme) is persisted in `localStorage`.
