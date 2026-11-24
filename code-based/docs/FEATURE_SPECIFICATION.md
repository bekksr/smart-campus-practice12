# Smart Campus — Explain Availability
## Practice #11 — Task #02: Feature Specification

### 1. User Story

As a student, I want a short explanation of room availability
so that I understand the decision for my requested time interval.

### 2. Feature Description

Explain Availability is an optional AI-enabled feature.
It explains the result produced by the existing deterministic
availability checker.

The AI must never decide whether a room is available,
modify booking data, or override the rule engine.

### 3. Input Contract

- roomLabel: string
- startTime: string (HH:MM)
- endTime: string (HH:MM)
- isAvailable: boolean
- reasonCode: string

Reason codes will represent:
- AVAILABLE
- INVALID_TIME
- PAST_TIME
- DURATION_EXCEEDED
- ROOM_BLOCKED
- BOOKING_OVERLAP

Reason codes are derived from the deterministic result.

### 4. Output Contract

{
  "explanation": "Short student-friendly explanation."
}

Output requirements:
- Maximum two sentences.
- Must agree with the deterministic result.
- Must use only supplied facts.
- Must not invent booking details.
- Must not change availability status.

### 5. Acceptance Criteria

AC1: Existing availability and overlap rules remain unchanged.

AC2: Explanation agrees with the deterministic result;
no invented booking details.

AC3: Empty, malformed or overly long input is rejected.

AC4: API timeout, error or unavailable key produces a safe fallback.

AC5: A user can distinguish generated explanation
from confirmed booking status.

### 6. Failure Behavior

- Invalid input: reject the request.
- Empty input: reject the request.
- Excessively long input: reject the request.
- API timeout: show deterministic fallback.
- API unavailable: show deterministic fallback.
- Invalid model response: reject and use fallback.
- Contradictory model response: never override availability.

### 7. Architecture Flow

Student Input
-> Validation
-> Existing Availability Checker
-> Structured Deterministic Result
-> LLM Adapter
-> Response Validation
-> UI Explanation

The existing checkAvailability() function remains
the single source of truth for availability.

### 8. Security and Privacy

- No API keys in browser code.
- No personal information sent to the model.
- Treat model output as untrusted data.
- Use a mock adapter when API access is unavailable.
- Do not execute instructions from user-provided text.

### 9. Project Constraints

- Preserve AC1–AC6 from AGENTS.md.
- No database or authentication.
- No booking persistence.
- Keep fictional room and booking data.
- Keep business logic separate from React UI.
