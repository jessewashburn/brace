#!/bin/bash
# Brace startup wrapper
# Injects PromptRoot theme files after a short delay (overlay FS settles post-boot),
# then starts Open WebUI normally.

STATIC_DIR="/app/backend/open_webui/static"

# Background job: wait 5s for FS to settle, then inject theme files
(
  sleep 5
  cp /brace-theme.css "${STATIC_DIR}/custom.css" && \
    echo "[brace] Injected custom.css ($(wc -c < ${STATIC_DIR}/custom.css) bytes)"
  cp /brace-loader.js "${STATIC_DIR}/loader.js" && \
    echo "[brace] Injected loader.js ($(wc -c < ${STATIC_DIR}/loader.js) bytes)"
) &

# Start Open WebUI immediately (don't block on the copy)
exec /app/backend/start.sh "$@"
