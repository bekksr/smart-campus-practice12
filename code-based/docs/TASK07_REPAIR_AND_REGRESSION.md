# Practice #11 — Task #07
## Repair and Regression Testing

### 1. Confirmed Findings

| Finding | Severity | Status |
|---|---|---|
| Previous explanation remained visible after request changes | Medium | Fixed |
| AVAILABLE accepted an invalid time interval | High | Fixed |

### 2. Applied Repairs

#### Repair 1 — Stale explanation
The ExplainAvailability component now clears the previous
explanation and error whenever the request context changes.

This prevents an outdated explanation from being displayed
for a different room or time interval.

#### Repair 2 — Invalid available interval
The explanation service now rejects AVAILABLE requests
where the start time is greater than or equal to the end time.

This prevents contradictory availability explanations.

### 3. Regression Testing

Two additional tests verify:
- AVAILABLE with start time after end time is rejected.
- AVAILABLE with equal start and end times is rejected.

Existing booking and availability tests remain unchanged.

### 4. Verification

Results must be recorded after executing:

- npm test
- npm run typecheck
- npm run lint
- npm run build

### 5. Demonstration Readiness

The feature is ready for demonstration only if all
verification commands pass.

### 6. Remaining Limitations

- No real LLM API integration.
- No real API timeout or failure simulation.
- No external model response validation.
- Mock adapter remains in use.

### 7. Conclusion

Two focused repairs were applied without changing
the deterministic availability checker.

Existing acceptance criteria and regression tests
must remain passing.
