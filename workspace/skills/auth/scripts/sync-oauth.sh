#!/usr/bin/env bash
# Sync Anthropic OAuth tokens from Claude Code into OpenClaw auth-profiles.json

set -euo pipefail

CREDS="$HOME/.claude/.credentials.json"
PROFILES="$HOME/.openclaw/agents/main/agent/auth-profiles.json"

if [ ! -f "$CREDS" ]; then
  echo "ERROR: $CREDS not found — run 'claude auth login' first" >&2
  exit 1
fi

python3 << EOF
import json, sys

creds = json.load(open('$CREDS'))
oauth = creds.get('claudeAiOauth')
if not oauth:
    print("ERROR: no claudeAiOauth key in credentials file", file=sys.stderr)
    sys.exit(1)

store = json.load(open('$PROFILES'))
store.setdefault('profiles', {})['anthropic:openclaw'] = {
    "type": "oauth",
    "provider": "anthropic",
    "access": oauth['accessToken'],
    "refresh": oauth['refreshToken'],
    "expires": oauth['expiresAt']
}
store.setdefault('lastGood', {})['anthropic'] = 'anthropic:openclaw'

with open('$PROFILES', 'w') as f:
    json.dump(store, f, indent=2)

print("Credentials synced. Token expires:", oauth['expiresAt'])
EOF

systemctl --user restart openclaw-gateway.service
echo "Gateway restarted."
