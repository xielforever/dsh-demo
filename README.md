# dsh-demo

`dsh-demo` is a deliberately small, incomplete target repository for end-to-end validation of `dsh-project-control` inside DeepSeek Harness (DSH).

It is **not** the plugin implementation. The current fixture is aligned with the plugin's present **single-task trusted closed loop**: enroll one clean Git repository, activate one delivery milestone, execute one persisted coding task in an isolated workspace, verify the exact candidate with a deterministic command, register evidence, promote the verified candidate to the managed milestone ref, and reconcile canonical state.

## Fixture version

- Fixture: `v1`
- Project lifecycle: `FINITE`
- Milestone kind: `DELIVERY`
- Target environment: local/dev only
- Risk: `LOW`
- Controlled tasks in this fixture: **1**
- External services: none
- Third-party dependencies: none

`v1` intentionally validates the capability implemented today. A future fixture version can validate Planner/Scheduler behavior across 3-5 dependent tasks after that capability lands in `dsh-project-control`.

## Source documents

- `AGENTS.md` — repository rules and frozen acceptance boundary
- `docs/PROJECT.md` — stable project contract
- `docs/MILESTONE.md` — current delivery contract
- `docs/DSH-VALIDATION.md` — exact validation workflow for the current plugin API
- `demo-fixture.json` — machine-readable fixture metadata

## Baseline and reset

The clean fixture reference is:

```text
fixture/baseline-v1
```

Use the exact commit behind that ref when preparing a fresh validation clone. Normal `dsh-project-control` execution should use its managed branches/worktrees and should not autonomously merge or push results into `main`.

## Local commands

Requires Node.js 20 or newer.

```bash
npm test
npm run acceptance
npm run verify
```

Expected at the clean baseline:

- `npm test`: **PASS**
- `npm run acceptance`: **FAIL**
- `npm run verify`: **FAIL**

Expected after M1 is correctly delivered:

- `npm test`: **PASS**
- `npm run acceptance`: **PASS**
- `npm run verify`: **PASS**

`npm run verify` is the validator command intended for the current `project_control_enroll` API because the current enrollment contract accepts one deterministic command criterion.

## Product to build

M1 turns the starter repository into a tiny SRE-oriented service health evaluator. Given a JSON file containing services and check results, the finished project must validate and normalize input, classify each service as `healthy`, `degraded`, or `unhealthy`, produce a fleet summary, expose the behavior through a deterministic CLI, and document the finished behavior.

The detailed contract is in `docs/MILESTONE.md`.
