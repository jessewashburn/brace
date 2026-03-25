---
name: auth
description: Sync OpenClaw's Anthropic OAuth credentials from Claude Code's credential store. Use when Brace returns a 401 authentication error, when Jesse says "fix auth", "re-auth", "sync credentials", or "Brace is getting 401s". Also use proactively if a request fails with an auth error mid-session.
---

# Auth Skill

OpenClaw authenticates to Anthropic using OAuth tokens from Claude Code's credential store (`~/.claude/.credentials.json`). These tokens expire and rotate. When they go stale, Brace gets 401 errors.

## Sync credentials

```bash
bash workspace/skills/auth/scripts/sync-oauth.sh
```

This copies the latest `accessToken`, `refreshToken`, and `expiresAt` from `~/.claude/.credentials.json` into `auth-profiles.json`, then restarts the gateway.

## When to use

- Brace responds with `HTTP 401: authentication_error: Invalid bearer token`
- Jesse reports Brace is not responding or getting auth errors
- Proactively after a long gap (tokens expire ~8 hours after issue)
