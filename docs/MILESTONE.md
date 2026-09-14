# M1 — Service Health Evaluator

## Milestone contract

- Kind: `DELIVERY`
- Environment: `local/dev`
- Risk: `LOW`
- Schedule mode for demo: `MANUAL`
- Expected autonomous decomposition: 3-5 dependent tasks

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

For each service:

- `unhealthy` if any check is `fail`;
- otherwise `degraded` if any check is `warn`;
- otherwise `healthy`.

The normalized result shape is:

```json
{
  "service": "api",
  "status": "healthy",
  "checkCount": 2
}
```

## Fleet summary

Given all service records, return:

```json
{
  "total": 3,
  "healthy": 1,
  "degraded": 1,
  "unhealthy": 1
}
```

Counts must exactly match evaluated services.

## CLI

The command:

```bash
node src/cli.js fixtures/services.json
```

must write one valid JSON document to stdout with this shape:

```json
{
  "services": [
    { "service": "api", "status": "healthy", "checkCount": 2 }
  ],
  "summary": {
    "total": 1,
    "healthy": 1,
    "degraded": 0,
    "unhealthy": 0
  }
}
```

The actual fixture contains more than one service. Preserve input service order in the `services` array.

For missing path, unreadable file, invalid JSON, or invalid service/check data, CLI must:

- write a concise error to stderr;
- exit non-zero;
- not emit a successful result document.

## Required acceptance

### Deterministic

1. Baseline regression suite remains green: `npm test`.
2. Milestone acceptance suite passes: `npm run acceptance`.
3. Healthy/degraded/unhealthy precedence matches the rules above.
4. Invalid check status is rejected.
5. Empty check list is rejected.
6. Fleet counts are exact.
7. CLI output for `fixtures/services.json` is valid JSON and matches the expected normalized result.

### Semantic

1. `README.md` clearly documents the status rules.
2. `README.md` includes the finished CLI usage and expected output concept.
3. Implementation remains small and readable; no third-party dependency is introduced.

## Non-goals

- HTTP server;
- persistence/database;
- authentication;
- network health probing;
- UI;
- production monitoring;
- concurrency or streaming.

## Change policy

If these criteria are internally inconsistent or technically impossible, stop and request a Human Gate. Do not alter the acceptance contract to make an implementation pass.
