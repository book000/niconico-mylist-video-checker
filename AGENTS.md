# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` imports this file, and `.github/copilot-instructions.md` adds the review checklist.

## Language

- All deliverables are written in **English**: commit messages, PR/Issue titles and bodies, review comments, code comments and docstrings, and documentation (`README.md`, `AGENTS.md`, etc.).
- Exceptions (keep as is): the Japanese strings in the Discord embed and info logs in `src/main.ts` (user-visible output), `README-ja.md` (an intentional Japanese translation of `README.md`; update both together), quotations, technical identifiers, generated files, and external source text.
- Runtime messages (logs, errors) are English.
- Do not rewrite Git history to change the language of past commits.

## Overview

A TypeScript (Node.js, run with `tsx`) tool that fetches NicoNico video MyLists from `nvapi.nicovideo.jp` and posts a Discord embed for each video that has not been notified yet. It runs in Docker; `entrypoint.sh` loops `pnpm start` with a 10-minute sleep.

## Commands

```bash
pnpm install       # install dependencies (pnpm only; enforced by preinstall)
pnpm start         # run src/main.ts once with tsx
pnpm dev           # same, with tsx watch
pnpm lint          # prettier --check src + eslint + tsc
pnpm fix           # prettier --write src + eslint --fix
```

There is no test framework. Node.js is pinned in `.node-version` and pnpm in `package.json`. CI (`.github/workflows/nodejs-ci-pnpm.yml`) uses the reusable workflow from `book000/templates`.

## Structure

- `src/main.ts`: everything runs here: `getMylist()` fetches one MyList and follows `hasNext` recursively (page size 100), then `main()` diffs against the state file, sends Discord messages, and writes the state.
- `src/config.ts`: `NMVCConfiguration` validates `data/config.json` (`discord.token` + `discord.channelId`, or `discord.webhookUrl`).
- `src/models/`: `NicoNicoMyList`, `NicoNicoMyListItem`, and the API response types (`response.ts`).
- `Dockerfile`, `compose.yml`, `entrypoint.sh`: container runtime. The image sets `CONFIG_PATH`, `WATCH_MY_LISTS_PATH`, `MY_LIST_PATH` and `LOG_DIR` under `/data`.

## Runtime files and behavior

- `data/config.json` (or `$CONFIG_PATH`): Discord settings. Read through `ConfigFramework` from `@book000/node-utils`.
- `watch-my-lists.json` (or `$WATCH_MY_LISTS_PATH`): JSON array of MyList IDs. A missing file is an error (exit code 1).
- `mylist.json` (or `$MY_LIST_PATH`): `{ "<mylistId>": ["<watchId>", ...] }`, the notified videos. If it does not exist, the run is in init mode: videos are recorded but no Discord message is sent. It is written once at the end of a run.
- Only `data/` is git-ignored. When running locally, `watch-my-lists.json` and `mylist.json` default to the repository root and are not ignored, so never commit them or any Discord token or webhook URL (in Docker they live under `/data`).

## Conventions

- Use `Logger` and `Discord` from `@book000/node-utils`; do not use `console.log`.
- HTTP uses the native `fetch`. Requests to `nvapi.nicovideo.jp` need the `X-Frontend-Id` / `X-Frontend-Version` headers.
- Info logs start with an emoji (`🆕`, `🎥`) and the main error logs with `❌`; keep new messages consistent with these.
- Do not enable `skipLibCheck` in `tsconfig.json`.
- Write JSDoc for functions and interfaces.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and branches follow [Conventional Branch](https://conventional-branch.github.io) short form (`feat/...`, `fix/...`).
- Do not commit to Renovate PRs.
- Update `README.md` and `README-ja.md` when setup, configuration or behavior changes.
