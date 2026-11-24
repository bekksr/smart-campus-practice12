# Smart Campus Room Availability Checker — Low-code Implementation

## Overview

This is the low-code implementation of the Smart Campus Room Availability
Checker for Practice #12. It is an independent React + TypeScript
application that shares the same business requirements, input/output
contract, reason codes, and acceptance tests as the Code-based
implementation.

## Availability Workflow

1. **Input validation**: The user selects a room, enters a start time
   (HH:MM) and a duration in minutes. The contract layer validates the
   time format and duration range before any availability calculation.
2. **Availability calculation**: The `checkAvailability` function checks
   the start time against the fixed reference time (08:00), verifies
   duration is 1–120 minutes, rejects blocked rooms, and detects
   overlapping bookings. Adjacent intervals (touching endpoints) are
   allowed.
3. **Result display**: The UI shows a clear Available/Unavailable banner
   with the reason code and a human-readable explanation message.

## Booking Data Storage

Booking data is stored locally as read-only TypeScript constants in
`src/data/rooms.ts`. No backend or database is used. The data is never
modified during availability checks — the engine operates on a filtered,
sorted copy of the bookings array.

## Platform Features vs Custom Logic

### Platform features
- React component architecture for UI rendering
- Tailwind CSS for responsive styling and layout
- Vite for build tooling and dev server
- Vitest for test execution
- TypeScript for type safety

### Custom logic
- The availability engine (`src/lib/availability.ts`) implements all
  business rules: time validation, duration limits, overlap detection,
  and blocked-room checks.
- The contract layer (`src/lib/contract.ts`) defines the shared
  input/output types and reason codes.
- Time conversion utilities (`src/lib/time.ts`) handle HH:MM parsing.

### Platform limitations
- The "low-code" platform here is a standard React/Vite stack, so all
  business logic is expressed in TypeScript rather than visual flow
  builders. No visual drag-and-drop logic builder is available.
- No built-in scheduling or calendar widget is used; time inputs use
  the native HTML `<input type="time">` element.

## Reason Codes

| Code | Meaning |
|---|---|
| AVAILABLE | Room is available for the requested interval |
| INVALID_TIME | Start time or current time is not a valid HH:MM value |
| PAST_START | Start time is not later than the current time |
| INVALID_DURATION | Duration is zero, negative, or exceeds 120 minutes |
| BOOKING_OVERLAP | Requested interval overlaps an existing booking |
| ROOM_BLOCKED | Room is blocked and always unavailable |

## Acceptance Tests

All eight acceptance tests (T1–T8) are implemented in
`src/lib/availability.test.ts` and produce the same expected results as
the Code-based implementation.

## Running

```bash
npm install
npm test        # run acceptance tests
npm run build   # production build
npm run lint    # eslint
npm run typecheck  # type checking
```
