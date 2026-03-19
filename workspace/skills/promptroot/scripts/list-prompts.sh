#!/usr/bin/env bash
# list-prompts.sh — list all prompt slugs in a PromptRoot-style GitHub repo
# Usage: list-prompts.sh <owner/repo> <branch>
# Example: list-prompts.sh promptroot/promptroot main
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: list-prompts.sh <owner/repo> <branch>" >&2
  exit 1
fi

REPO="$1"
BRANCH="$2"

MAX_ATTEMPTS=3
ATTEMPT=0
WAIT=2

while [[ $ATTEMPT -lt $MAX_ATTEMPTS ]]; do
  ATTEMPT=$(( ATTEMPT + 1 ))

  OUTPUT=$(gh api \
    "repos/${REPO}/git/trees/${BRANCH}?recursive=1" \
    --jq '.tree[] | select(.type == "blob") | select(.path | startswith("prompts/")) | select(.path | endswith(".md")) | .path' \
    2>/tmp/list-prompts-err) && STATUS=0 || STATUS=$?

  if [[ $STATUS -eq 0 ]]; then
    # Convert paths like "prompts/tutorial/foo.md" to slugs like "tutorial/foo"
    echo "$OUTPUT" | sed 's|^prompts/||; s|\.md$||'
    exit 0
  fi

  ERR=$(cat /tmp/list-prompts-err)

  if echo "$ERR" | grep -q "404"; then
    echo "Error: repo '${REPO}' or branch '${BRANCH}' not found" >&2
    exit 1
  fi

  if echo "$ERR" | grep -qE "429|rate limit|secondary rate"; then
    if [[ $ATTEMPT -lt $MAX_ATTEMPTS ]]; then
      echo "GitHub rate limit hit. Retrying in ${WAIT}s... (attempt ${ATTEMPT}/${MAX_ATTEMPTS})" >&2
      sleep "$WAIT"
      WAIT=$(( WAIT * 2 ))
      continue
    else
      echo "Error: GitHub rate limit exceeded after ${MAX_ATTEMPTS} attempts." >&2
      exit 2
    fi
  fi

  echo "Error listing prompts: $ERR" >&2
  exit 1
done
