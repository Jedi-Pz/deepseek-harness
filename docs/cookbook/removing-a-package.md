# Cookbook: removing a package or feature

English | [中文](removing-a-package.zh.md)

Deleting a package or a capability has no reverse gear. The checklist removes the code, the generated surfaces that mention it, and the records that would otherwise keep describing it.

## 1. Record the decision first

Removal is a durable decision. Add a new ADR under `docs/adr/` for what is removed and why; when it replaces an earlier decision, supersede that ADR instead of rewriting it. Follow the archive or deletion rules in the [Agent Notes README](../../.agents/notes/README.md), and record an externally perceptible loss in the [upgrade guide](../../.agents/skills/dsh-create-upgrade-guide/SKILL.md) when it removes a published surface.

## 2. Delete the package

Delete `packages/<group>/<pkg>/` and run `pnpm run clean`, which removes build outputs and residue left by deleted packages ([clean.ts](../../scripts/clean.ts)).

Then remove the package from the root TypeScript aggregates:

- `tsconfig.host.json` or `tsconfig.client.json` `references`.
- The group README package table.
- The [group table](../../packages/README.md) when the group disappears, and the repository layout in the root `AGENTS.md`.

## 3. Regenerate the generated surfaces

Stale generated pages fail their freshness gates. Let `pnpm run doc-sync` name the stale ones, then regenerate the affected surfaces:

```sh
pnpm run gen-plugin-packages
pnpm run gen-config-catalog
pnpm run gen-tool-catalog
pnpm run gen-session-format-catalog
pnpm run gen-persistence-catalog
pnpm run gen-module-graph
pnpm run gen-cli-help
pnpm run gen-third-party-notices
```

## 4. Repair the references

- Fix or delete every inbound link; `pnpm run verify-md-links` names the broken ones.
- Update the context glossary and its row in [GLOSSARY-MAP.md](../../GLOSSARY-MAP.md) when the removed package owned domain terms.
- Delete the published page from `website/docs.ts` and the bilingual triplet (`*.md`, `*.zh.md`, `*.i18n.yaml`) together when a document disappears.
- Delete workflow state, settings keys, and compositions that only serviced the removed package.

## 5. Handle durable data

A removed feature that wrote Session events, persistence types, or wire formats keeps its reader obligations:

- Keep reading every committed generation, or add a version-named successor. Never move, overwrite, or delete a released generation.
- Record the transition in the persistence-change history and in the upgrade guide.
- Keep only the tests whose subject is the absence itself, and stop testing the removed behavior.

## 6. Verify

```sh
pnpm install
pnpm run clean
pnpm run doc-sync
pnpm run constraints && pnpm run typecheck && pnpm run lint
pnpm run build && pnpm run hygiene
```

The [repository testing policy](../testing.md) owns the behavior-specific checks for the removal.
