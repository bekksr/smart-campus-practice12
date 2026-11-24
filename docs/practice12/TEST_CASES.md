# Practice #12 — Eight Acceptance Tests

Reference time: 08:00.

| ID | Scenario | Room | Start | Duration | Expected |
|---|---|---|---|---:|---|
| T1 | Valid free interval | lib-201 | 11:00 | 60 | Available |
| T2 | Overlap with existing booking | lib-201 | 10:00 | 60 | Unavailable |
| T3 | Blocked room | sci-310 | 09:00 | 60 | Unavailable |
| T4 | Zero duration | lib-201 | 11:00 | 0 | Validation error |
| T5 | Duration exceeds maximum | lib-201 | 11:00 | 121 | Validation error |
| T6 | Past start time | lib-201 | 07:00 | 60 | Validation error |
| T7 | Adjacent non-overlapping interval | lib-201 | 10:30 | 60 | Available |
| T8 | Booking data integrity | lib-201 | 11:00 | 60 | Data unchanged |

## Expected Reason Codes

| Test | Reason Code |
|---|---|
| T1 | AVAILABLE |
| T2 | BOOKING_OVERLAP |
| T3 | ROOM_BLOCKED |
| T4 | INVALID_DURATION |
| T5 | INVALID_DURATION |
| T6 | PAST_START |
| T7 | AVAILABLE |
| T8 | DATA_UNCHANGED |

## T8 Procedure
1. Take a snapshot of the existing booking data.
2. Perform an availability check.
3. Compare the booking data with the original snapshot.
4. Confirm that no booking was added, deleted or modified.

## Important
Expected results must be identical for Code-based and Low-code solutions.
Observed results will be recorded only after executing the tests.
