# Practice #12 — Eight Acceptance Tests

Reference time: 08:00.

Both Code-based and Low-code implementations must produce identical
expected results for every test below.

## Test Cases

| ID | Scenario | Room | Start | Duration | Expected Availability | Expected Reason Code |
|---|---|---|---|---:|---|---|
| T1 | Valid free interval | lib-201 | 11:00 | 60 | true | AVAILABLE |
| T2 | Overlap with existing booking | lib-201 | 10:00 | 60 | false | BOOKING_OVERLAP |
| T3 | Blocked room | sci-310 | 09:00 | 60 | false | ROOM_BLOCKED |
| T4 | Zero duration | lib-201 | 11:00 | 0 | false | INVALID_DURATION |
| T5 | Duration exceeds maximum | lib-201 | 11:00 | 121 | false | INVALID_DURATION |
| T6 | Past start time | lib-201 | 07:00 | 60 | false | PAST_START |
| T7 | Adjacent non-overlapping interval | lib-201 | 10:30 | 60 | true | AVAILABLE |
| T8 | Booking data integrity | lib-201 | 11:00 | 60 | true | AVAILABLE |

## Detailed Test Descriptions

### T1 — Valid free interval
Request 11:00 for 60 minutes on lib-201. The interval 11:00–12:00
does not overlap any existing booking (09:00–10:30, 14:00–15:00,
16:30–17:30). Expected: available.

### T2 — Overlap with existing booking
Request 10:00 for 60 minutes on lib-201. The interval 10:00–11:00
overlaps the existing booking 09:00–10:30. Expected: unavailable,
BOOKING_OVERLAP.

### T3 — Blocked room
Request 09:00 for 60 minutes on sci-310 (blocked). A blocked room is
always unavailable regardless of the time. Expected: unavailable,
ROOM_BLOCKED.

### T4 — Zero duration
Request 11:00 for 0 minutes on lib-201. Duration must be greater than
zero. Expected: unavailable, INVALID_DURATION.

### T5 — Duration exceeds maximum
Request 11:00 for 121 minutes on lib-201. Duration must not exceed
120 minutes. Expected: unavailable, INVALID_DURATION.

### T6 — Past start time
Request 07:00 for 60 minutes on lib-201 with reference time 08:00.
Start time must be later than the current time. Expected: unavailable,
PAST_START.

### T7 — Adjacent non-overlapping interval
Request 10:30 for 60 minutes on lib-201. The interval 10:30–11:30
starts exactly when the booking 09:00–10:30 ends. Adjacent intervals
are allowed. Expected: available.

### T8 — Booking data integrity
Request 11:00 for 60 minutes on lib-201. After the check, the existing
booking data must be unchanged — no booking added, deleted, or modified.

## T8 Procedure
1. Take a snapshot of the existing booking data.
2. Perform an availability check.
3. Compare the booking data with the original snapshot.
4. Confirm that no booking was added, deleted, or modified.

## Important
- Expected results must be identical for Code-based and Low-code solutions.
- Observed results are recorded only after executing the tests.
- Do not modify existing tests merely to make them pass.
