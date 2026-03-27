# Brace Open WebUI Theme

Dark theme for Brace's Open WebUI instance, styled to match [PromptRoot](https://promptroot.github.io/promptroot/) — navy backgrounds, cyan accent, Inter font.

## Applying the Theme

### Option A — Admin Panel (quick/manual)

1. Open your Brace UI (e.g. https://brace-ui.fly.dev)
2. Go to **Admin Panel → Interface → Custom CSS**
3. Paste the contents of `theme.css`
4. Save

This persists in Open WebUI's SQLite DB. Survives restarts but requires re-applying after a full DB wipe.

### Option B — Environment Variable (recommended for fly.io)

Set `WEBUI_CUSTOM_CSS_FILE` to point at a mounted copy of `theme.css`.

In `fly.toml`:
```toml
[env]
  WEBUI_CUSTOM_CSS_FILE = "/data/theme.css"
```

Then copy `theme.css` into your fly.io volume at `/data/theme.css`.

Or bake it into a custom Docker image:
```dockerfile
FROM ghcr.io/open-webui/open-webui:main
COPY webui/theme.css /app/backend/static/custom.css
```

The Open WebUI HTML already links `/static/custom.css` — so copying directly there is the cleanest zero-config approach.

## Design Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#0a0e1a` | Page background |
| Surface | `#141829` | Cards, inputs |
| Surface elevated | `#1a1f35` | Hover states |
| Border | `#222438` | Dividers |
| Text | `#f0f3f8` | Primary text |
| Text muted | `#8b94a8` | Secondary text |
| Accent | `#4dd9ff` | Buttons, links, focus |

Source: `promptroot/promptroot` → `src/styles/base.css`

## Open WebUI Version

Tested against Open WebUI 0.6.x (Tailwind v4, oklch color scale).
If colors look off after an OWU upgrade, the `--color-gray-*` values in `theme.css` may need re-tuning.
