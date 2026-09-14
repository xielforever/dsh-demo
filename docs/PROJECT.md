# Stable Project Contract

## Project

- Name: `dsh-demo`
- Lifecycle: `FINITE`
- Purpose: provide a deterministic, disposable coding target for `dsh-project-control` end-to-end validation.

## Product goal

Build a tiny local service-health evaluator suitable for demonstrating autonomous engineering delivery. The product reads service check data, derives per-service health, produces fleet-level counts, and exposes the result through a CLI.

## Architectural constraints

- Node.js >= 20.
- ECMAScript modules.
- Built-in Node.js modules only.
- No network access.
- No database.
- No external service.
- Deterministic output for deterministic input.
- Keep the code intentionally small enough that evidence can be inspected manually.

## Safety / autonomy ceiling

- Local/dev repository only.
- LOW risk.
- No production apply.
- No destructive system operation.
- No credential or secret is required.
- Acceptance contract changes require Human Gate.

## Completion model

The project is complete when the current delivery milestone is accepted. Runtime state, evidence records, task state, leases, and control-plane metadata belong to `dsh-project-control` storage and must not be persisted into this repository as canonical state.
