# Task #05 — Identical Acceptance Test Results

## Overview

Both the Code-based and Low-code implementations were tested
independently against the same eight acceptance test cases (T1–T8)
using identical inputs. A cross-implementation comparison test suite
was also executed to verify both engines produce the same results for
every test case.

**Reference time:** 08:00 (480 minutes)

## Data Comparison

| Aspect | Code-based | Low-code | Match? |
|---|---|---|---|
| Reference time | 08:00 | 08:00 | Yes |
| Duration limits | 1–120 min | 1–120 min | Yes |
| Overlap calculation | `start < b.end && b.start < end` | `start < b.end && b.start < end` | Yes |
| Adjacent intervals allowed | Yes | Yes | Yes |
| Blocked room behavior | Unavailable | Unavailable | Yes |
| Reason codes | 6 canonical codes | 6 canonical codes | Yes |
| lib-201 booking 1 | 09:00–10:30 | 09:00–10:30 | Yes |
| lib-201 booking 2 | 14:00–15:00 | 13:00–14:30 | **No** (different title/time) |
| lib-201 booking 3 | 16:30–17:30 | 15:00–16:00 | **No** (different title/time) |
| sci-310 blocked | Yes | Yes | Yes |

### Note on booking data differences

The lib-201 booking data differs between implementations in titles and
time ranges for the 2nd and 3rd bookings. However, all eight acceptance
test cases (T1–T8) interact only with the first booking (09:00–10:30)
or with general validation rules (duration, past start, blocked room).
The first booking is identical in both implementations. Therefore, all
test cases produce identical results despite the data differences in
non-tested bookings.

The sci-310 room is blocked in both implementations, so its booking
data is never consulted during T3.

## Verification Commands

### Code-based

| Command | Result |
|---|---|
| `npm test` | 86 passed (7 files) |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed |

### Low-code

| Command | Result |
|---|---|
| `npm test` | 18 passed (2 files) |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed |

### Cross-implementation comparison

| Command | Result |
|---|---|
| `npm test` (code-based, includes comparison tests) | 86 passed (7 files) |

The comparison test file (`task05-comparison.test.ts`) contains 10
tests: 8 per-case comparisons verifying both engines match the expected
result, 1 data integrity test, and 1 cross-implementation consistency
test verifying both engines produce identical reason codes and
availability for every case.

## Acceptance Test Results

| ID | Input | Expected | Code-based Observed | Low-code Observed | CB Pass | LC Pass | Notes |
|---|---|---|---|---|---|---|---|
| T1 | lib-201, 11:00, 60 min | Available, AVAILABLE | Available, AVAILABLE | Available, AVAILABLE | PASS | PASS | Both engines correctly find 11:00–12:00 is free |
| T2 | lib-201, 10:00, 60 min | Unavailable, BOOKING_OVERLAP | Unavailable, BOOKING_OVERLAP | Unavailable, BOOKING_OVERLAP | PASS | PASS | 10:00–11:00 overlaps the 09:00–10:30 booking |
| T3 | sci-310, 09:00, 60 min | Unavailable, ROOM_BLOCKED | Unavailable, ROOM_BLOCKED | Unavailable, ROOM_BLOCKED | PASS | PASS | Room is blocked regardless of time |
| T4 | lib-201, 11:00, 0 min | Unavailable, INVALID_DURATION | Unavailable, INVALID_DURATION | Unavailable, INVALID_DURATION | PASS | PASS | Duration must be > 0 |
| T5 | lib-201, 11:00, 121 min | Unavailable, INVALID_DURATION | Unavailable, INVALID_DURATION | Unavailable, INVALID_DURATION | PASS | PASS | Duration must be ≤ 120 |
| T6 | lib-201, 07:00, 60 min | Unavailable, PAST_START | Unavailable, PAST_START | Unavailable, PAST_START | PASS | PASS | 07:00 is before reference 08:00 |
| T7 | lib-201, 10:30, 60 min | Available, AVAILABLE | Available, AVAILABLE | Available, AVAILABLE | PASS | PASS | 10:30–11:30 starts where 09:00–10:30 ends (adjacent) |
| T8 | lib-201, 11:00, 60 min | Data unchanged | Data unchanged, Available | Data unchanged, Available | PASS | PASS | No booking added, deleted, or modified |

## Summary

- **Total test checks:** 16 (8 cases × 2 implementations)
- **Passed:** 16
- **Failed:** 0
- **Unresolved defects:** None
- **Reason code mismatches:** None
- **Availability mismatches:** None

## Defects Found

No genuine defects were found in either implementation. Both produce
identical results for all eight acceptance test cases.

## Evidence Files

All execution evidence is stored in `evidence/practice12/task05/`:

- `code-based-tests.txt` — full test output (86 tests)
- `code-based-typecheck.txt` — typecheck output
- `code-based-lint.txt` — lint output
- `code-based-build.txt` — build output
- `low-code-tests.txt` — full test output (18 tests)
- `low-code-typecheck.txt` — typecheck output
- `low-code-lint.txt` — lint output
- `low-code-build.txt` — build output
- `comparison-test-results.txt` — cross-implementation comparison test output
- `comparison-test.ts` — standalone comparison script (reference)

## Incomplete Requirements

None. All eight tests pass on both implementations. All verification
commands pass for both projects. The cross-implementation comparison
confirms identical behavior for every test case.
