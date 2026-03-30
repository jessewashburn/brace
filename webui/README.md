# Brace Open WebUI Theme

Dark navy theme for Brace's Open WebUI instance, styled to match [PromptRoot](https://promptroot.github.io/promptroot/) — navy backgrounds, cyan accent.

## How It Works

Open WebUI v0.8+ uses **Tailwind v4**, which bakes `oklch()` color literals directly into compiled CSS at build time. CSS variable overrides (e.g. `--color-gray-950`) have **no effect** — Tailwind v4 doesn't reference them at runtime.

`theme.css` v3.0 uses **direct class and element selectors** instead, and forces dark navy regardless of system light/dark preference.

## Delivery Mechanism

Two channels are used simultaneously:

### 1. `/app/build/static/custom.css` (Dockerfile)

```dockerfile
COPY custom.css /app/build/static/custom.css
```

OWUI's `config.py` runs on every boot and:
1. Deletes `/app/backend/open_webui/static/` entirely
2. Copies everything from `/app/build/static/` into it

So baking into `/app/build/static/` is the only Dockerfile approach that survives startup.

The HTML links this file early:
```html
<link rel="stylesheet" href="/static/custom.css">
```

### 2. DB `ui.custom_css` (SQLite)

OWUI stores custom CSS in `webui.db` (`config` table, `ui.custom_css` key). The Svelte frontend injects it as a `<style>` tag **after** all stylesheets load — giving it full cascade priority over Tailwind.

After deploy, inject via SSH:
```bash
flyctl ssh console -a brace-ui -C "python3 -c \"
import json, sqlite3
db = sqlite3.connect('/app/backend/data/webui.db')
css = open('/app/build/static/custom.css').read()
row = db.execute('SELECT id, data FROM config ORDER BY id DESC LIMIT 1').fetchone()
data = json.loads(row[1])
data.setdefault('ui', {})['custom_css'] = css
db.execute('UPDATE config SET data=? WHERE id=?', [json.dumps(data), row[0]])
db.commit()
print('Done:', len(css), 'bytes')
db.close()
\""
```

Or manually via **Admin Panel → Interface → Custom CSS**.

## What Does NOT Work

| Approach | Why |
|----------|-----|
| `COPY` to `/app/backend/open_webui/static/custom.css` | Wiped on every boot by config.py |
| Runtime injection (sleep + cp) | Same — wiped |
| CSS variable overrides (`--color-gray-*`) | Tailwind v4 bakes oklch() literals; vars unused at runtime |
| `WEBUI_CUSTOM_CSS_FILE` env var | Does not exist in current OWUI source |

## Design Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#0a0e1a` | Page background |
| Surface | `#141829` | Sidebar, cards, inputs |
| Surface elevated | `#1a1f35` | Hover states |
| Border | `#222438` | Dividers |
| Text | `#f0f3f8` | Primary text |
| Text muted | `#8b94a8` | Secondary text |
| Accent | `#4dd9ff` | Buttons, links, focus |

Source: `promptroot/promptroot` → `src/styles/base.css`

## Tested Against

- Open WebUI **0.8.12** (Tailwind v4, oklch color scale)
- Deployed on Fly.io (`iad` region)

## Upgrading OWUI

OWUI uses `:main` tag — pulling a new image may change class names or layout structure. If theme breaks after an upgrade:
1. Open DevTools on the live instance
2. Inspect the broken elements to find new class names
3. Update selectors in `theme.css`
4. Redeploy + re-inject into DB
