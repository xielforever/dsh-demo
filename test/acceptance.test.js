import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

import { evaluateService, summarizeFleet } from "../src/health.js";

const fixtureUrl = new URL("../fixtures/services.json", import.meta.url);
const cliUrl = new URL("../src/cli.js", import.meta.url);

const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

const expectedServices = [
  { service: "api", status: "healthy", checkCount: 2 },
  { service: "worker", status: "degraded", checkCount: 2 },
  { service: "billing", status: "unhealthy", checkCount: 2 },
];

const expectedSummary = {
  total: 3,
  healthy: 1,
  degraded: 1,
  unhealthy: 1,
};

test("evaluateService implements healthy/degraded/unhealthy precedence", () => {
  assert.deepEqual(evaluateService(fixture[0]), expectedServices[0]);
  assert.deepEqual(evaluateService(fixture[1]), expectedServices[1]);
  assert.deepEqual(evaluateService(fixture[2]), expectedServices[2]);
});

test("evaluateService rejects invalid status and empty checks", () => {
  assert.throws(
    () => evaluateService({ service: "api", checks: [{ name: "http", status: "unknown" }] }),
    /invalid check status/,
  );
  assert.throws(
    () => evaluateService({ service: "api", checks: [] }),
    /at least one check/,
  );
});

test("summarizeFleet returns exact counts", () => {
  assert.deepEqual(summarizeFleet(fixture), expectedSummary);
});

test("CLI returns deterministic JSON for the fixture", () => {
  const result = spawnSync(process.execPath, [cliUrl.pathname, fixtureUrl.pathname], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");

  const parsed = JSON.parse(result.stdout);
  assert.deepEqual(parsed.services, expectedServices);
  assert.deepEqual(parsed.summary, expectedSummary);
});

test("CLI fails cleanly when no input path is supplied", () => {
  const result = spawnSync(process.execPath, [cliUrl.pathname], { encoding: "utf8" });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /input|path|usage/i);
  assert.equal(result.stdout, "");
});
