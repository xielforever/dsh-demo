export const VALID_CHECK_STATUSES = Object.freeze(["pass", "warn", "fail"]);

export function normalizeIdentifier(value, fieldName = "identifier") {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${fieldName} must be a non-empty string`);
  }

  return value.trim().toLowerCase();
}

export function assertCheckStatus(status) {
  if (!VALID_CHECK_STATUSES.includes(status)) {
    throw new TypeError(`invalid check status: ${String(status)}`);
  }

  return status;
}

export function evaluateService(_serviceRecord) {
  throw new Error("Not implemented: evaluateService");
}

export function summarizeFleet(_serviceRecords) {
  throw new Error("Not implemented: summarizeFleet");
}
