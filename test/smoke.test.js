import test from "node:test";
import assert from "node:assert/strict";

import {
  VALID_CHECK_STATUSES,
  assertCheckStatus,
  normalizeIdentifier,
} from "../src/health.js";

test("baseline exposes the three supported check states", () => {
  assert.deepEqual(VALID_CHECK_STATUSES, ["pass", "warn", "fail"]);
});

test("normalizeIdentifier trims and lowercases", () => {
  assert.equal(normalizeIdentifier(" API ", "service"), "api");
  assert.equal(normalizeIdentifier(" Database ", "check name"), "database");
});

test("normalizeIdentifier rejects blank values", () => {
  assert.throws(() => normalizeIdentifier("   ", "service"), /non-empty string/);
});

test("assertCheckStatus accepts known values and rejects unknown values", () => {
  assert.equal(assertCheckStatus("pass"), "pass");
  assert.throws(() => assertCheckStatus("unknown"), /invalid check status/);
});
