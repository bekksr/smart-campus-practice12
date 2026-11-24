# Practice #11 — Task #05: Test Results

## 1. Normal Cases

| Test Case | Expected Result | Status |
|---|---|---|
| Available room | Explanation confirms availability | PASS |
| Booking overlap | Explanation describes conflict | PASS |
| Blocked room | Explanation describes blocked room | PASS |
| Invalid time | Explanation identifies invalid interval | PASS |
| Past time | Explanation identifies past start time | PASS |
| Duration exceeded | Explanation mentions 120-minute limit | PASS |

## 2. Input Validation

| Test Case | Expected Result |
|---|---|
| Empty room name | Request rejected |
| Invalid time format | Request rejected |
| Room name over 100 characters | Request rejected |
| Contradictory status and reason | Request rejected |

## 3. Failure Cases

The current implementation uses a local mock adapter.

Real API timeout, API failure and unavailable API key scenarios
are not applicable yet because no external LLM API is connected.

## 4. Deterministic Availability

The existing checkAvailability() function remains the single
source of truth.

The explanation service does not modify room availability
or booking data.

## 5. Automated Test Results

Command: npm test

Test files: 5 passed
Tests: 59 passed
Failed: 0

TypeScript: Passed
ESLint: Passed
Production build: Passed

## 6. Limitations

- No real LLM API integration.
- No actual API timeout simulation.
- No real API failure simulation.
- UI screenshots should be captured separately.

## 7. Conclusion

The mock explanation feature passes its current automated tests.
The deterministic availability checker remains unchanged.
Further failure testing is required before real LLM integration.
