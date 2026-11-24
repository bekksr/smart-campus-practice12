# Practice #12 — Shared Test Data

## Reference Time
08:00 (480 minutes after midnight).

All tests use this reference time.

## Rooms

### Open Room
- ID: lib-201
- Name: Library Study Room 201
- Building: Main Library
- Capacity: 8
- Blocked: false

### Blocked Room
- ID: sci-310
- Name: Science Seminar Room 310
- Building: Block C — Sciences
- Capacity: 20
- Blocked: true
- Reason: Maintenance — HVAC repair scheduled all day.

## Existing Fictional Bookings

### Room: lib-201

| Booking | Start | End | Booked By |
|---|---|---|---|
| Group Project — CS301 | 09:00 | 10:30 | A. Chen |
| Literature Review | 14:00 | 15:00 | M. Patel |
| Thesis Writing | 16:30 | 17:30 | J. Rivera |

### Room: sci-310
Blocked for maintenance — no bookings used in tests.

## Internal Representation
Times are stored internally as minutes from midnight.

| HH:MM | Minutes |
|---|---|
| 07:00 | 420 |
| 08:00 | 480 |
| 09:00 | 540 |
| 10:00 | 600 |
| 10:30 | 630 |
| 11:00 | 660 |
| 12:00 | 720 |
| 14:00 | 840 |
| 15:00 | 900 |
| 16:30 | 990 |
| 17:30 | 1050 |

## Test Data Rules
- All times use HH:MM format in the interface.
- Internally, times are minutes from midnight.
- All tests use reference time 08:00.
- Booking data is read-only.
- Both implementations must use identical data.
