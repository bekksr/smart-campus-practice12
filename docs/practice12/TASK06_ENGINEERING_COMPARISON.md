# Task #06 — Engineering Effort Comparison

## Executive Summary

Two independent implementations of the Smart Campus Room Availability
Checker were built and tested against the same eight acceptance cases
(T1–T8). The **Code-based** implementation is a mature React +
TypeScript application with 25 source files, 86 tests, an AI explanation
feature, bug-reproduction tests, and regression tests. The **Low-code**
implementation is a leaner React + TypeScript application with 14 source
files and 18 tests covering the same acceptance criteria.

Both implementations pass all eight acceptance tests (T1–T8) with
identical results. All four verification commands (test, typecheck,
lint, build) pass on both projects. No unresolved defects were found in
either implementation.

A data divergence was confirmed: the low-code implementation's lib-201
booking data differs from the shared specification for the 2nd and 3rd
bookings. This does not affect acceptance test results because those
tests only interact with the 1st booking (09:00–10:30, identical in
both) or with validation rules that do not depend on booking data.

No time-based effort measurements were recorded during development;
those fields are marked "Not recorded" throughout this document.

---

## 1. Quantitative Comparison

### 1.1 Project Size

| Metric | Code-based | Low-code |
|---|---|---|
| Source files | 25 | 14 |
| Source lines of code (TS/TSX) | 2,272 | 900 |
| Component files | 4 | 3 |
| Library/logic files | 11 | 5 |
| Test files | 7 | 2 |
| Data files | 1 | 1 |
| Configuration files | 8 | 8 |

### 1.2 Dependencies

| Metric | Code-based | Low-code |
|---|---|---|
| Runtime dependencies | 4 | 3 |
| Dev dependencies | 14 | 15 |
| Unique to code-based | `@supabase/supabase-js` | — |
| Unique to low-code | — | `jsdom` (test env) |

### 1.3 Test Counts

| Metric | Code-based | Low-code |
|---|---|---|
| Test files | 7 | 2 |
| Total tests | 86 | 18 |
| Acceptance tests (T1–T8) | Covered in contract tests + comparison tests | Covered in availability tests |
| Bug reproduction tests | 22 | 0 |
| Regression tests | 3 | 0 |
| AI explanation tests | 13 | 0 |
| Comparison tests (Task 05) | 10 | 0 |
| Contract output shape tests | 14 | 3 (within availability tests) |
| Booking selector tests | 4 | 4 |

### 1.4 Verification Results (Task #06 execution)

| Command | Code-based | Low-code |
|---|---|---|
| `npm test` | 86 passed (7 files) | 18 passed (2 files) |
| `npm run typecheck` | Passed | Passed |
| `npm run lint` | Passed | Passed |
| `npm run build` | Passed (166 KB JS, 14.5 KB CSS) | Passed (162 KB JS, 14.3 KB CSS) |

### 1.5 Acceptance Test Results (from Task #05)

| Test | Expected | Code-based | Low-code |
|---|---|---|---|
| T1 — Valid free interval | Available, AVAILABLE | PASS | PASS |
| T2 — Overlapping booking | Unavailable, BOOKING_OVERLAP | PASS | PASS |
| T3 — Blocked room | Unavailable, ROOM_BLOCKED | PASS | PASS |
| T4 — Zero duration | Unavailable, INVALID_DURATION | PASS | PASS |
| T5 — Duration exceeds max | Unavailable, INVALID_DURATION | PASS | PASS |
| T6 — Past start time | Unavailable, PAST_START | PASS | PASS |
| T7 — Adjacent interval | Available, AVAILABLE | PASS | PASS |
| T8 — Data integrity | Data unchanged, Available | PASS | PASS |

### 1.6 Effort Measurements

| Metric | Code-based | Low-code |
|---|---|---|
| Setup time | Not recorded | Not recorded |
| Implementation time | Not recorded | Not recorded |
| Debugging time | Not recorded | Not recorded |
| Testing time | Not recorded | Not recorded |
| Total development time | Not recorded | Not recorded |

No time-based measurements were recorded in any existing documentation
or evidence files. These values are absent, not omitted.

### 1.7 Build Output

| Metric | Code-based | Low-code |
|---|---|---|
| JS bundle (raw) | 166.15 KB | 162.20 KB |
| JS bundle (gzip) | 52.41 KB | 51.25 KB |
| CSS (raw) | 14.51 KB | 14.28 KB |
| CSS (gzip) | 3.48 KB | 3.45 KB |
| HTML | 0.71 KB | 0.49 KB |

---

## 2. Qualitative Comparison

### 2.1 Setup Effort

| Aspect | Code-based | Low-code |
|---|---|---|
| Project scaffolding | Vite + React + TS template (pre-existing) | Vite + React + TS (scaffolded from scratch) |
| Tailwind CSS | Pre-configured | Configured manually |
| Path aliases | Pre-configured (`@/`) | Configured manually |
| Vitest | Pre-configured | Configured manually, required jsdom install |

The code-based project was a pre-existing starter template, reducing
setup work. The low-code project was scaffolded from scratch, requiring
manual configuration of Tailwind, path aliases, and test environment.

### 2.2 Implementation Effort

| Aspect | Code-based | Low-code |
|---|---|---|
| Availability engine | 86 lines, mature with edge-case handling | 100 lines, clean implementation |
| Contract layer | 146 lines, includes validation helpers | 24 lines, type definitions only |
| UI components | 4 components (RoomCard, ResultBanner, ScheduleList, ExplainAvailability) | 3 components (RoomOption, ResultBanner, ScheduleList) |
| AI explanation feature | Yes (explainAvailability module + mock adapter) | No |
| App.tsx complexity | 323 lines | 284 lines |

The code-based implementation includes an AI-powered explanation feature
that generates human-readable summaries of availability decisions. The
low-code implementation omits this feature, focusing on the core
availability checking workflow.

### 2.3 Debugging Effort

| Aspect | Code-based | Low-code |
|---|---|---|
| Bug reproduction tests | 22 tests documenting prior bugs | None |
| Regression tests | 3 tests guarding against regressions | None |
| Documented defects | 2 bugs documented in TASK07 docs | None found during development |
| Bug-detector skill | Present (mutant testing infrastructure) | Not present |

The code-based project has a documented history of bugs being found and
fixed, with reproduction tests retained as regression guards. The
low-code project was built fresh with no bugs encountered during
development.

### 2.4 Testing Effort

| Aspect | Code-based | Low-code |
|---|---|---|
| Test coverage breadth | Engine, contract, selectors, AI, regression, bug-repro, comparison | Engine, selectors |
| Test depth | Edge cases, invalid inputs, boundary conditions | Core acceptance cases + invalid inputs |
| Mutation testing | Present (bug-detector skill) | Not present |
| Cross-implementation tests | Yes (Task 05 comparison suite) | No (tested independently) |

### 2.5 Successful Acceptance Tests

Both implementations pass all 8 acceptance tests (T1–T8) with identical
observed results. See the quantitative table in section 1.5.

### 2.6 Unresolved Defects

| Implementation | Unresolved defects |
|---|---|
| Code-based | None |
| Low-code | None |

### 2.7 Customization

| Aspect | Code-based | Low-code |
|---|---|---|
| Room data | 4 rooms (lib-201, eng-104, sci-310, bus-120) | 2 rooms (lib-201, sci-310) |
| Booking data | 6 bookings across 3 rooms | 6 bookings across 2 rooms |
| AI explanation | Customizable prompt + mock adapter | Not present |
| UI theme | Sky/slate color system | Sky/slate color system |

### 2.8 Security Controls

| Aspect | Code-based | Low-code |
|---|---|---|
| Supabase dependency | Present (not used for availability logic) | Not present |
| Data modification prevention | Read-only booking data, no mutation in engine | Read-only booking data, no mutation in engine |
| Input validation | Contract layer validates time format and duration | Engine validates time format and duration |
| User input sanitization | Native HTML inputs with type enforcement | Native HTML inputs with type enforcement |

Neither implementation exposes sensitive data or performs writes. Both
treat booking data as read-only. The code-based project includes a
Supabase dependency that is not used for the availability feature.

### 2.9 Version Control

| Aspect | Code-based | Low-code |
|---|---|---|
| Git repository | Not initialized | Not initialized |
| Version history | Bolt Version History (platform feature) | Bolt Version History (platform feature) |

Neither project uses git. Both rely on Bolt's built-in Version History
for change tracking.

### 2.10 Portability

| Aspect | Code-based | Low-code |
|---|---|---|
| Framework | React 18 + Vite 5 | React 18 + Vite 5 |
| Language | TypeScript 5.5 | TypeScript 5.5 |
| External services | Supabase (unused for core feature) | None |
| Platform-specific code | None | None |
| Deployment | Static build (dist/) | Static build (dist/) |

Both produce static builds deployable to any static host. The
code-based project's Supabase dependency adds bundle weight but is not
required for the availability feature.

### 2.11 Ongoing Maintenance

| Aspect | Code-based | Low-code |
|---|---|---|
| Files to maintain | 25 source files | 14 source files |
| Test suite size | 86 tests | 18 tests |
| External dependencies | 4 runtime + 14 dev | 3 runtime + 15 dev |
| Complexity | Higher (AI module, bug-repro tests, more rooms) | Lower (core feature only) |
| Regression risk | Mitigated by 22 bug-repro + 3 regression tests | Lower complexity reduces risk |

---

## 3. Booking Data Difference Analysis

### 3.1 Shared Specification (from `docs/practice12/TEST_DATA.md`)

Room lib-201 should have these bookings:

| Booking | Start | End | Booked By |
|---|---|---|---|
| Group Project — CS301 | 09:00 | 10:30 | A. Chen |
| Literature Review | 14:00 | 15:00 | M. Patel |
| Thesis Writing | 16:30 | 17:30 | J. Rivera |

### 3.2 Code-based Data (matches specification)

| Booking | Start | End | Booked By |
|---|---|---|---|
| Group Project — CS301 | 09:00 | 10:30 | A. Chen |
| Literature Review | 14:00 | 15:00 | M. Patel |
| Thesis Writing | 16:30 | 17:30 | J. Rivera |

### 3.3 Low-code Data (differs from specification)

| Booking | Start | End | Booked By |
|---|---|---|---|
| Database Systems | 09:00 | 10:30 | A. Chen |
| Web Development | 13:00 | 14:30 | M. Patel |
| Software Engineering | 15:00 | 16:00 | J. Rivera |

### 3.4 Differences Identified

| Booking | Field | Code-based | Low-code | Affects tests? |
|---|---|---|---|---|
| 1st | Title | Group Project — CS301 | Database Systems | No |
| 1st | Time | 09:00–10:30 | 09:00–10:30 | No (identical) |
| 2nd | Title | Literature Review | Web Development | No |
| 2nd | Start | 14:00 (840) | 13:00 (780) | No |
| 2nd | End | 15:00 (900) | 14:30 (870) | No |
| 3rd | Title | Thesis Writing | Software Engineering | No |
| 3rd | Start | 16:30 (990) | 15:00 (900) | No |
| 3rd | End | 17:30 (1050) | 16:00 (960) | No |

### 3.5 Impact Assessment

None of the eight acceptance test cases are affected by these
differences:

- **T1** (11:00, 60 min): The interval 11:00–12:00 does not overlap any
  booking in either implementation. The 2nd booking starts at 13:00 or
  14:00 — both after 12:00.
- **T2** (10:00, 60 min): Overlaps the 1st booking (09:00–10:30) in
  both implementations. The 1st booking is identical.
- **T3** (sci-310, blocked): Room is blocked; booking data is never
  consulted.
- **T4, T5, T6**: Validation errors (duration, past start) — booking
  data is irrelevant.
- **T7** (10:30, 60 min): The interval 10:30–11:30 starts where the 1st
  booking ends. Adjacent intervals are allowed in both implementations.
  The 2nd booking starts at 13:00 or 14:00 — both after 11:30.
- **T8**: Data integrity check — verifies no mutation, not specific
  booking values.

**Conclusion:** The data difference is a genuine divergence from the
shared specification but does not affect acceptance test results. Per
task instructions, the data was not silently modified.

---

## 4. Evidence References

All evidence files are stored in `evidence/practice12/task06/`:

| File | Description |
|---|---|
| `code-based-tests.txt` | Code-based test output (86 tests passed) |
| `code-based-typecheck.txt` | Code-based typecheck output (passed) |
| `code-based-lint.txt` | Code-based lint output (passed) |
| `code-based-build.txt` | Code-based build output (passed) |
| `low-code-tests.txt` | Low-code test output (18 tests passed) |
| `low-code-typecheck.txt` | Low-code typecheck output (passed) |
| `low-code-lint.txt` | Low-code lint output (passed) |
| `low-code-build.txt` | Low-code build output (passed) |

Additional evidence from Task #05 in `evidence/practice12/task05/`:

| File | Description |
|---|---|
| `comparison-test-results.txt` | Cross-implementation comparison (86 tests) |
| `code-based-tests.txt` | Code-based test output |
| `low-code-tests.txt` | Low-code test output |

---

## 5. Limitations

1. **No time measurements:** Development effort was not tracked with a
   timer. All time-based fields are marked "Not recorded." The
   comparison relies on structural metrics (file count, line count, test
   count) rather than elapsed time.

2. **No git history:** Neither project uses git, so commit frequency,
   commit size, and change history could not be analyzed. Bolt's
   Version History is not accessible from this environment.

3. **Qualitative assessments are observational:** Sections 2.1–2.11
   reflect structural observations about the code, not subjective
   developer experience surveys. No developers were interviewed.

4. **Booking data difference not corrected:** Per task instructions, the
   data divergence in the low-code implementation was documented but not
   silently modified. The difference does not affect test results.

5. **UI testing not performed:** No browser or screenshot tool is
   available in this environment. Verification is limited to automated
   tests, type checking, linting, and build success.

---

## 6. Final Recommendation

For university coursework demonstrating software engineering practices,
the **Code-based implementation is the stronger submission** because it
includes:

- Comprehensive test coverage (86 tests including bug reproduction and
  regression tests)
- An AI explanation feature extending beyond the base requirements
- Documented bug history and mutation testing infrastructure
- More rooms and booking data for richer testing scenarios

However, the **Low-code implementation is more maintainable** for
ongoing use because it has:

- Fewer files (14 vs 25) and fewer lines (900 vs 2,272)
- No unused dependencies (the code-based project includes Supabase but
  does not use it for availability)
- Simpler architecture focused solely on the core feature

**Recommended action:** Align the low-code booking data with the shared
specification (Task #07 scope) to achieve full data parity. Both
implementations are otherwise production-ready for the acceptance
criteria defined in Practice #12.
