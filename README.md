# dsh-demo

`dsh-demo` is a deliberately small, incomplete coding project used as the target repository for end-to-end validation of `dsh-project-control` inside DeepSeek Harness (DSH).

It is **not** the plugin implementation. The plugin is expected to enroll this repository as an existing project, plan the current milestone, execute changes in isolated workspaces, verify the exact candidate SHA, register evidence, promote only verified candidates, and stop at gates or failures.

## Fixture contract

- Project lifecycle: `FINITE`
- Current milestone kind: `DELIVERY`
- Target environment: local/dev only
- Risk: low
- Repository model: single Git repository
- Expected planning depth: 3-5 dependent coding/documentation tasks
- No network or external service is required
- No production or destructive operation is allowed

The stable project contract is in `docs/PROJECT.md`. The current delivery contract is in `docs/MILESTONE.md`. Repository-specific rules are in `AGENTS.md`.

## Baseline and reset

The immutable fixture reference for this version is:

```text
fixture/baseline-v1
```

Use the exact commit behind that ref as the clean baseline when enrolling a fresh demo project. Normal `dsh-project-control` validation should use managed branches/worktrees and should not merge or push autonomous results into `main`.

If a local clone becomes dirty, discard the clone and recreate it from the fixture ref instead of trying to preserve runtime state in this repository.

## Commands

Requires Node.js 20 or newer. The project intentionally has no third-party runtime or test dependencies.

```bash
npm test
npm run acceptance
```

Expected state at `fixture/baseline-v1`:

- `npm test`: **PASS**. These are baseline regression/smoke tests.
- `npm run acceptance`: **FAIL**. The current milestone is intentionally not implemented yet.

Expected state after the milestone is correctly delivered:

- `npm test`: **PASS**
- `npm run acceptance`: **PASS**

## Product to build

The milestone turns this starter repository into a tiny SRE-oriented service health evaluator. Given a JSON file containing services and check results, the finished project must:

1. validate and normalize service/check input;
2. classify every service as `healthy`, `degraded`, or `unhealthy`;
3. produce a fleet summary;
4. expose the behavior through a deterministic CLI;
5. document the behavior and usage.

The detailed behavior is intentionally specified as acceptance criteria rather than as an implementation plan. The Planner should decompose the milestone instead of copying a pre-authored task list.
