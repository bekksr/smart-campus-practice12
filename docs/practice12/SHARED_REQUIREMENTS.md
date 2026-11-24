# Practice #12 — Shared Requirements

## Project
Smart Campus Room Availability Checker

## User Story
As a university student, I want to check whether a campus room is
available for a requested time and duration, so that I can find a
suitable room without conflicting with existing bookings.

## Scope
- One fictional campus room per availability check.
- Fixed fictional booking data (identical for both implementations).
- No login, payment, personal data, or production database.
- Checking availability must not modify existing bookings.
- Both Code-based and Low-code implementations must use the same
  input contract, output contract, reason codes, and reference time.

## Acceptance Criteria

### AC1 — Future Start Time
The requested start time must be later than the reference current time.

### AC2 — Duration Validation
Duration must be greater than 0 and at most 120 minutes.

### AC3 — Booking Overlap
A requested interval overlapping an existing booking must be unavailable.
Adjacent intervals are allowed when one ends exactly as another begins.

### AC4 — Blocked Room
A blocked room must always return unavailable.

### AC5 — Clear Decision and Data Integrity
The application must display a clear availability decision and a
human-readable reason. Existing booking data must remain unchanged
after every check.

### AC6 — Invalid Input
Invalid time values and invalid duration must produce understandable
validation feedback.

## Reference Time
08:00 (480 minutes after midnight).

Both implementations must use the same fixed reference time during
the eight-case comparison.

## Input Contract
The availability checker accepts:

| Field | Type | Description |
|---|---|---|
| startTime | string (HH:MM) | Requested start time |
| duration | integer (minutes) | Requested duration |
| roomId | string | Room identifier |
| blocked | boolean | Whether the room is blocked |
| bookings | array | Fictional booking records for the room |
| currentTime | string (HH:MM) | Reference current time |

Each booking record contains:
- roomId: string
- start: number (minutes from midnight)
- end: number (minutes from midnight)
- title: string
- bookedBy: string

## Output Contract
Every availability check returns an object with exactly three fields:

| Field | Type | Description |
|---|---|---|
| availability | boolean | true if the room is available |
| reasonCode | string | Stable machine-readable code (see below) |
| message | string | Human-readable explanation |

## Canonical Reason Codes
| Code | Meaning |
|---|---|
| AVAILABLE | Room is available for the requested interval |
| INVALID_TIME | Start time or current time is not a valid HH:MM value |
| PAST_START | Start time is not later than the current time |
| INVALID_DURATION | Duration is zero, negative, or exceeds 120 minutes |
| BOOKING_OVERLAP | Requested interval overlaps an existing booking |
| ROOM_BLOCKED | Room is blocked and always unavailable |

## Implementation Notes
- The existing `checkAvailability` engine is reused unchanged.
- The shared contract layer (`checkAvailabilityContract`) normalizes
  the engine output into the platform-independent output contract.
- Booking data is never duplicated or mutated.
- Responsibilities are separated: input validation, availability
  calculation, and result presentation.
