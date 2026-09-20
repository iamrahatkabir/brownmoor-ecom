# Changelog

Every change made to this repository, newest first.

The rules for writing an entry — when one is needed and what it should say —
are in [CLAUDE.md](CLAUDE.md).

## 2026-09-20 — Start recording changes in a changelog

**What changed:** Added `CLAUDE.md` at the repo root, carrying a standing rule
that any change to the repository must be recorded here, along with the format
an entry takes. Added this changelog as the place those entries go.

**Why:** The repo's history was only legible through `git log`, whose messages
run to "bug fix" and "Slider". Neither says what actually changed or why it was
needed, which makes it slow to work out what state the shop is in. The rule
lives in `CLAUDE.md` specifically because that file is loaded automatically at
the start of every Claude Code session — an instruction file under any other
name would sit unread.

**Files:** `CLAUDE.md`, `CHANGELOG.md`

*No application code was changed.*
