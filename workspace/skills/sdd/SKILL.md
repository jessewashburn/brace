---
name: sdd
description: Create and manage Software Design Documents (SDDs) — versioned, phased planning documents that record every project or feature Bliz works on with Jesse. Use when starting a new project, feature, or significant task; when Jesse asks to "write up a plan", "document this", "create an SDD", or "make a design doc"; or when reviewing/updating an existing plan. SDDs live in workspace/SDD/ and are gitignored (private planning docs).
---

# SDD — Software Design Documents

SDDs are versioned planning documents for every significant project or task.

## Location

All SDDs live in: `workspace/SDD/`

## File Naming

```
SDD-<NNNN>-<slug>.md
```

- `NNNN` — zero-padded incrementing number (0001, 0002, …)
- `slug` — short kebab-case title

Examples: `SDD-0001-blizbot-setup.md`, `SDD-0002-dev-workflow-skills.md`

Find the next number by listing existing SDDs:
```bash
ls workspace/SDD/ | sort | tail -1
```

## Document Template

```markdown
# SDD-NNNN: Title

**Version:** 1.0  
**Date:** YYYY-MM-DD  
**Author:** Bliz  
**Status:** Draft | In Progress | Complete

## Overview

Brief description of what this plan covers and why.

## Goals

- Goal 1
- Goal 2

## Non-Goals

- What this explicitly does NOT cover

## Phases

### Phase 1 — Name

**Goal:** What this phase achieves  
**Tasks:**
- [ ] Task 1
- [ ] Task 2

### Phase 2 — Name

...

## Notes

Any decisions, tradeoffs, open questions.

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | YYYY-MM-DD | Initial draft |
```

## Workflow

1. **New project/task** → create a new SDD before starting work
2. **During work** → check off tasks, add notes
3. **Scope changes** → bump version, update changelog
4. **Complete** → mark Status as Complete

## Versioning

- Increment version (1.0 → 1.1) for minor updates, new tasks, notes
- Increment major version (1.0 → 2.0) for significant scope changes or replanning
- Always add a changelog entry when bumping version
