@AGENTS.md
# CLAUDE.md

See AGENTS.md for project overview, stack, structure, and conventions —
that file is the source of truth and applies here too.

## Working style for this repo
- This is Abster's last web dev project before switching domains — prioritize
  clean, working increments over exhaustive scaffolding. Small PR-sized
  changes, not giant rewrites.
- When adding a new distro/source fetcher, always show the normalized
  `TorrentEntry` output before wiring it into `build-catalog.ts`, so it can
  be sanity-checked against the schema.
- Don't invent magnet URIs, checksums, or release dates — if you can't verify
  a value from a real source, leave the field undefined and flag it rather
  than guessing.
- UI work should default to the frontend-design conventions already in use
  (warm, intentional, Material You Expressive–inspired) rather than generic
  Tailwind defaults — ask before introducing a new visual direction.
- Never add non-free/copyrighted content sources, even as a placeholder or
  "for testing" — this is a hard boundary for the project, not a style
  preference.

## Useful context
- Catalog schema lives in `lib/catalog/types.ts` — always check it before
  writing or editing a source fetcher.
- Static data only for now (`data/catalog.json`); no runtime DB until the UI
  is proven out.