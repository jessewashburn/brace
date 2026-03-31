FROM ghcr.io/open-webui/open-webui:main

# Brace × PromptRoot theme
# On startup, config.py WIPES /app/backend/open_webui/static/ then copies from
# /app/build/static/ — so we must bake our assets into the BUILD dir, not the static dir.

# Theme CSS + JS interceptor
COPY custom.css /app/build/static/custom.css
COPY loader.js /app/build/static/loader.js

# PromptRoot logo — replace all OWUI brand assets
COPY logos/favicon.ico             /app/build/static/favicon.ico
COPY logos/favicon-circle-512.png  /app/build/static/favicon.png
COPY logos/favicon.svg             /app/build/static/favicon.svg
COPY logos/favicon-circle-96.png   /app/build/static/favicon-96x96.png
COPY logos/favicon-circle-512.png  /app/build/static/favicon-dark.png
COPY logos/favicon-circle-16.png   /app/build/static/favicon-16x16.png
COPY logos/favicon-circle-32.png   /app/build/static/favicon-32x32.png
COPY logos/logo.png                /app/build/static/logo.png
COPY logos/logo.png                /app/build/static/splash.png
COPY logos/logo.png                /app/build/static/splash-dark.png
COPY logos/apple-touch-icon.png    /app/build/static/apple-touch-icon.png
COPY logos/web-app-manifest-192x192.png /app/build/static/web-app-manifest-192x192.png
COPY logos/web-app-manifest-512x512.png /app/build/static/web-app-manifest-512x512.png

# Mirror core brand files at root paths as well; some OWUI views reference
# /logo.png, /splash.png, or /favicon*.png instead of /static/*.
COPY logos/logo.png                /app/build/logo.png
COPY logos/logo.png                /app/build/splash.png
COPY logos/logo.png                /app/build/splash-dark.png
COPY logos/favicon-circle-512.png  /app/build/favicon.png
COPY logos/favicon-circle-512.png  /app/build/favicon-dark.png
COPY logos/favicon.svg             /app/build/favicon.svg
COPY logos/apple-touch-icon.png    /app/build/apple-touch-icon.png

ENTRYPOINT ["/app/backend/start.sh"]
