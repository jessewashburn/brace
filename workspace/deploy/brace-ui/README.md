# brace-ui

Open WebUI deployed on fly.io, backed by the local OpenClaw gateway via Cloudflare Tunnel.

## First deploy

```bash
# Install flyctl if needed
curl -L https://fly.io/install.sh | sh

cd deploy/brace-ui

# Create the app (one-time)
fly launch --no-deploy --copy-config --name brace-ui

# Create persistent volume for chat history (one-time)
fly volumes create brace_data --region iad --size 1

# Set secrets (never commit these)
#
# Note: Open WebUI uses the OpenAI API format internally, so it calls its
# bearer token variable OPENAI_API_KEY regardless of the underlying model.
# The VALUE here is your OPENCLAW_GATEWAY_TOKEN — not an actual OpenAI key.
# OpenClaw receives it, verifies it, then calls Anthropic/Claude as normal.
fly secrets set \
  OPENAI_API_KEY="<your OPENCLAW_GATEWAY_TOKEN>" \
  OPENAI_API_BASE_URL="https://<your-cloudflare-tunnel-url>/v1" \
  WEBUI_SECRET_KEY="$(openssl rand -hex 32)"

# Deploy
fly deploy
```

## Subsequent deploys

```bash
fly deploy
```

## Updating Open WebUI

Change the image tag in `fly.toml` and redeploy:

```bash
# Check latest: https://github.com/open-webui/open-webui/releases
# Edit fly.toml: image = "ghcr.io/open-webui/open-webui:<tag>"
fly deploy
```

## First-time setup in browser

1. Open `https://brace-ui.fly.dev`
2. Create your admin account (signup is disabled after first user)
3. Settings → Connections → verify OpenAI API is connected (green dot)
4. Set a custom system prompt if desired

## Connecting PromptRoot "Run in Brace"

Set `WEBUI_URL=https://brace-ui.fly.dev` in Firebase Functions config:

```bash
cd functions
firebase functions:config:set brace.webui_url="https://brace-ui.fly.dev"
firebase deploy --only functions
```

The "Run in Brace" button will then open:
`https://brace-ui.fly.dev/?q=<url-encoded-prompt>`
