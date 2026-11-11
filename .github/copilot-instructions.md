# Copilot code review instructions

Read `AGENTS.md` at the repository root first; it is the source of truth for structure, commands and conventions.

## Language

Write review comments, and expect all deliverables (code comments, docs, commit messages, PR text), in English.
Runtime log and error messages are English too; the Japanese Discord embed text and info logs in `src/main.ts` are intentional.

## Review checklist

- No Discord token, `webhookUrl` or other secret in code or logs; settings come from `data/config.json` or environment variables.
- Responses from `nvapi.nicovideo.jp` must be checked with `response.ok`, and file I/O failures must not be swallowed.
- State handling (`mylist.json`): no duplicate notifications or missed videos, and the first run (no state file) must not notify.
- Pagination follows `hasNext` for MyLists over 100 items.
- Public functions and interfaces have JSDoc in English.
- Commit and PR titles follow Conventional Commits.

## Do not flag

- Style already enforced by Prettier, ESLint and `tsc` in CI.
- The leading emoji in log messages, and `process.exit(1)` in `src/main.ts` (marked with `eslint-disable-next-line`).
- Native `fetch` instead of an HTTP library.
- `data/config.json`, `watch-my-lists.json` and `mylist.json` missing from the repository (runtime files, git-ignored).
