# Blizbot — OpenClaw Workspace

This is the workspace for **Bliz** ⚡, a persistent AI assistant built on [OpenClaw](https://openclaw.ai), connected via Telegram (@Bl1zBot).

## What is this repo?

This repo contains the public-facing configuration, skills, and workspace templates for Bliz. Personal data (memory files, identity, user profile) is gitignored and stays local.

## Structure

```
├── openclaw.json          # Gateway config (secrets as env vars)
├── agents/                # Agent config and auth profiles
├── cron/                  # Scheduled tasks
├── telegram/              # Telegram channel state
└── workspace/
    ├── AGENTS.md          # Agent operating manual
    ├── SOUL.md            # Personality and values
    ├── TOOLS.md           # Local environment notes
    ├── HEARTBEAT.md       # Periodic check-in tasks
    ├── skills/            # Custom and installed skills
    │   ├── sdd/           # SDD planning document skill
    │   ├── github/        # GitHub integration
    │   ├── tmux/          # Terminal session management
    │   ├── himalaya/      # Email via CLI
    │   └── summarize/     # Content summarization
    └── SDD/               # Planning docs (gitignored, local only)
```

## Skills

Bliz uses [AgentSkills](https://agentskills.io)-compatible skills. Custom skills live in `workspace/skills/`. Install community skills via [ClawHub](https://clawhub.com):

```bash
npx clawhub@latest install <skill-name>
```

## Environment Variables

All secrets are stored as env vars — nothing in plaintext. Required vars:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API access |
| `TELEGRAM_BOT_TOKEN` | @Bl1zBot Telegram bot |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth token |
| `BW_PASSWORD` | Bitwarden vault unlock (for email) |

## Roadmap: PromptRoot × OpenClaw Integration

Bliz is being integrated with [PromptRoot](https://github.com/promptroot/promptroot) — an AI prompt library and workflow platform. See [SDD-0002](workspace/SDD/SDD-0002-promptroot-openclaw-integration.md) (local) for the full plan.

### Planned integrations:

- **PromptRoot skill** — Bliz fetches and executes prompts from the library by slug
- **🦞 Run in Bliz button** — Send any PromptRoot prompt directly to Bliz from the UI
- **SDD workflow** — Bliz pulls versioned SDD templates from PromptRoot, fills them interactively
- **Web Clip summarization** — Browser extension captures → auto-summarized by Bliz → Telegram notification
- **Agent-generated prompts** — Bliz auto-PRs reusable prompts discovered during sessions back to PromptRoot
- **Queue execution** — PromptRoot queue items tagged `[bliz]` executed as Bliz sub-agent tasks

## Setup

1. Install [OpenClaw](https://openclaw.ai)
2. Clone this repo to `~/.openclaw`
3. Set required env vars in `~/.bashrc`
4. Run `openclaw gateway`
5. Message @Bl1zBot on Telegram

## License

MIT
