# Practice #12 — Shared Requirements

## Project
Smart Campus Room Availability Checker

## User Story
As a student, I want to select a campus room, a future start time,
and a booking duration so that I can check whether the room is available
before making a booking.

## Scope
- One fictional campus room per availability check.
- Fixed fictional booking data.
- No login, payment, personal data, or production database.
- Checking availability must not modify existing bookings.

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
The application must display availability status and a clear reason.
Existing booking data must remain unchanged after every check.

### AC6 — Invalid Input
Invalid time values and invalid duration must produce understandable
validation feedback.

## Input Contract
- roomId: string
- start: number (minutes from midnight)
- duration: number (minutes)
- currentTime: number (minutes from midnight)
- blocked: boolean
- existingBookings: array of fictional booking intervals

## Output Contract
- available: boolean
- reasonCode: string
- message: string

## Canonical Reason Codes
- AVAILABLE
- PAST_START
- INVALID_DURATION
- ROOM_BLOCKED
- BOOKING_OVERLAP
- INVALID_INPUT

The existing code-based engine currently returns status, reason and detail.
The reasonCode field will be normalized in the shared comparison layer.

## Reference Time
08:00 (480 minutes after midnight).

Both implementations must use the same fixed reference time during
the eight-case comparison.
