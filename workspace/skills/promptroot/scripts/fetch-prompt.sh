#!/usr/bin/env bash
# fetch-prompt.sh — fetch a prompt by slug from a PromptRoot-style GitHub repo
# Usage: fetch-prompt.sh <owner/repo> <branch> <slug>
# Example: fetch-prompt.sh promptroot/promptroot main tutorial/templates/versioned-modular-sdd-plan
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: fetch-prompt.sh <owner/repo> <branch> <slug>" >&2
  exit 1
fi

REPO="$1"
BRANCH="$2"
SLUG="$3"
PATH_IN_REPO="prompts/${SLUG}.md"

fetch() {
  local repo="$1" branch="$2" path="$3"
  gh api "repos/${repo}/contents/${path}?ref=${branch}" \
    -H "Accept: application/vnd.github.raw+json" \
    2>/tmp/fetch-prompt-err
}

MAX_ATTEMPTS=3
ATTEMPT=0
WAIT=2
FELL_BACK=false

while [[ $ATTEMPT -lt $MAX_ATTEMPTS ]]; do
  ATTEMPT=$(( ATTEMPT + 1 ))

  if fetch "$REPO" "$BRANCH" "$PATH_IN_REPO"; then
    exit 0
  fi

  ERR=$(cat /tmp/fetch-prompt-err)

  if echo "$ERR" | grep -q "404"; then
    if [[ "$FELL_BACK" == false && "$BRANCH" != "main" ]]; then
      echo "Warning: slug '${SLUG}' not found on branch '${BRANCH}', falling back to 'main'" >&2
      BRANCH="main"
      FELL_BACK=true
      ATTEMPT=$(( ATTEMPT - 1 ))
      continue
    else
      echo "Error: prompt slug '${SLUG}' not found in ${REPO}" >&2
      exit 1
    fi
  fi

  if echo "$ERR" | grep -qE "429|rate limit|secondary rate"; then
    if [[ $ATTEMPT -lt $MAX_ATTEMPTS ]]; then
      echo "GitHub rate limit hit. Retrying in ${WAIT}s... (attempt ${ATTEMPT}/${MAX_ATTEMPTS})" >&2
      sleep "$WAIT"
      WAIT=$(( WAIT * 2 ))
      continue
    else
      echo "Error: GitHub rate limit exceeded after ${MAX_ATTEMPTS} attempts. Try again later." >&2
      exit 2
    fi
  fi

  echo "Error fetching prompt: $ERR" >&2
  exit 1
done
