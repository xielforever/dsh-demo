# M1 — Service Health Evaluator

## Milestone contract

- Kind: `DELIVERY`
- Environment: `local/dev`
- Risk: `LOW`
- Schedule mode: `MANUAL`
- Current fixture execution model: one persisted coding task

## Goal

Deliver a small, deterministic service-health evaluator and CLI from the existing starter repository.

## Input model

A service record has this shape:

```json
{
  "service": "api",
  "checks": [
    { "name": "http", "status": "pass" },
    { "name": "database", "status": "warn" }
  ]
}
```

Rules:

- `service` must be a non-empty string after trimming;
- every check must have a non-empty `name` after trimming;
- valid check status values are exactly `pass`, `warn`, and `fail`;
- a service must contain at least one check;
- service IDs and check names are normalized with trim + lowercase.

## Per-service classification

- `unhealthy` if any check is `fail`;
- otherwise `degraded` if any check is `warn`;
- otherwise `healthy`.

Normalized result:

```json
{
  "service": "api",
  "status": "healthy",
  "checkCount": 2
}
```

## Fleet summary

Return exact counts:

```json
{
  "total": 3,
  "healthy": 1,
  "degraded": 1,
  "unhealthy": 1
}
```

## CLI

```bash
node src/cli.js fixtures/services.json
```

The CLI must write one valid JSON document containing:

- `services`: normalized results in input order;
- `summary`: exact fleet counts.

For missing path, unreadable file, invalid JSON, or invalid service/check data, it must write a concise error to stderr, exit non-zero, and not emit a successful JSON result.

## Required deterministic acceptance

The candidate must pass:

```bash
npm run verify
```

This command combines regression and milestone acceptance. The acceptance suite verifies:

1. healthy/degraded/unhealthy precedence;
2. invalid check status rejection;
3. empty check list rejection;
4. exact fleet counts;
5. deterministic CLI output for `fixtures/services.json`;
6. clean CLI failure when no input path is supplied.

## Required implementation outcome

- finish `evaluateService`;
- finish `summarizeFleet`;
- finish `src/cli.js`;
- preserve existing smoke behavior;
- update `README.md` with final status rules and CLI usage;
- keep the implementation small and readable;
- add no third-party dependency.

## Non-goals

HTTP server, persistence/database, authentication, network probing, UI, production monitoring, concurrency, streaming.

## Change policy

If the acceptance contract is inconsistent or impossible, stop for Human Gate. Do not modify frozen acceptance files to make the implementation pass.
