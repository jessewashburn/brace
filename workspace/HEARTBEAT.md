# HEARTBEAT.md

Tasks checked on every heartbeat cycle (every 30 minutes).

---

## Web Clip Monitoring

Check for new files in `webclips/jessewashburn/` since the last heartbeat.

```bash
# Get files committed in the last 35 minutes (slightly wider than heartbeat window to avoid gaps)
SINCE=$(date -u -d '35 minutes ago' +%Y-%m-%dT%H:%M:%SZ)
gh api "repos/promptroot/promptroot/commits?path=webclips/jessewashburn&since=${SINCE}" \
  --jq '[.[].files[]? | select(.filename | startswith("webclips/jessewashburn/")) | .filename] | unique | .[]' \
  2>/dev/null
```

For each new file found:
1. Fetch the raw content via `gh api repos/promptroot/promptroot/contents/<path> -H "Accept: application/vnd.github.raw+json"`
2. Summarize it in one sentence using the `summarize` skill (write content to a temp file first)
3. Send a Telegram notification: `📎 New web clip: <filename> — <one-sentence summary>`
4. Append the summary to `memory/YYYY-MM-DD.md` under a `## Web Clips` section

If the GitHub API call fails, log the error to `memory/YYYY-MM-DD.md` and skip — do not crash.

---

## Prompt Extraction Review

Check session memory for patterns that qualify for PromptRoot contribution. A session qualifies if it meets **at least one**:

1. Jesse explicitly said "save this as a prompt" or "add this to PromptRoot" during the session
2. The same ad-hoc instruction pattern appeared ≥2 times in memory entries from the last 7 days
3. The session produced a standalone artifact (SDD, test plan, PR description) that didn't use an existing PromptRoot template

**Do not auto-PR.** If a session qualifies, surface it to Jesse: "I noticed [pattern]. Should I add this to PromptRoot?" and wait for confirmation before proceeding with the Phase 2 contribution workflow in the `promptroot` skill.

Check today's memory file and the previous 6 days for recurring patterns:
```bash
ls workspace/memory/ | sort | tail -7
```
