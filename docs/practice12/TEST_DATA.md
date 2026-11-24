# Practice #12 — Shared Test Data

## Reference Time
08:00 (480 minutes).

## Rooms

### Open Room
- ID: lib-201
- Name: Library Study Room 201
- Blocked: false

### Blocked Room
- ID: sci-310
- Name: Science Seminar Room 310
- Blocked: true
- Reason: Maintenance — HVAC repair scheduled all day.

## Existing Fictional Bookings

Room: lib-201

| Booking | Start | End |
|---|---|---|
| Group Project — CS301 | 09:00 | 10:30 |
| Literature Review | 14:00 | 15:00 |
| Thesis Writing | 16:30 | 17:30 |

Room: sci-310

- Blocked for maintenance.

## Test Data Rules
- All times use HH:MM format in the interface.
- Internally, times are minutes from midnight.
- All tests use reference time 08:00.
- Booking data is read-only.
- Both implementations must use identical data.
