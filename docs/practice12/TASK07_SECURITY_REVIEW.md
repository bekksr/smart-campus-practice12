# Task #07 — Security Review (Lecture #12)

## Overview

Both implementations (`code-based/` and `low-code/`) were inspected for
security issues across five areas: Input Validation, XSS Protection,
Access Control and Secrets, Software Composition Analysis (SCA), and
Dynamic Application Security Testing (DAST). This document distinguishes
verified vulnerabilities, potential risks, security controls already
present, and checks that could not be performed.

No files were modified during this review.

---

## 1. Input Validation

### 1.1 Start-time Validation

**Code-based findings:**
- `src/lib/contract.ts` — `checkAvailabilityContract()` validates start
  time via `timeToMinutes()` which uses a strict regex
  `/^(\d{2}):(\d{2})$/` and range-checks hours (0–23) and minutes (0–59).
  Invalid formats return `null`, triggering `INVALID_TIME`.
- `src/App.tsx` (line 51) — Additional client-side regex
  `/^([01]\d|2[0-3]):[0-5]\d$/` validates before submission.
- HTML `<input type="time">` provides browser-native format enforcement.
- **Risk level: Low.** Multiple layers of validation.

**Low-code findings:**
- `src/lib/availability.ts` (lines 14–23) — Same `timeToMinutes()`
  validation with strict regex and range checks.
- `src/App.tsx` (line 42) — Same client-side regex as code-based.
- HTML `<input type="time">` for browser-native enforcement.
- **Risk level: Low.** Equivalent validation layers.

### 1.2 Duration Validation

**Code-based findings:**
- `src/lib/contract.ts` — Duration validated as `Number.isFinite()` and
  `> 0` and `<= 120`. Zero, negative, NaN, and >120 all rejected with
  `INVALID_DURATION`.
- `src/App.tsx` (lines 48–50) — Client-side validation with
  `Number.isFinite()` and range check.
- HTML `<input type="number" min={1} max={120}>` provides browser hint.
- **Risk level: Low.**

**Low-code findings:**
- `src/lib/availability.ts` (lines 41–55) — Same validation:
  `Number.isFinite()`, `> 0`, `<= 120`.
- `src/App.tsx` (lines 39–41) — Same client-side validation.
- HTML `<input type="number" min={1} max={120}>`.
- **Risk level: Low.**

### 1.3 Unexpected Input Types and Malformed Values

**Code-based findings:**
- `parseInt(durationStr, 10)` in `App.tsx` (line 48) — If the input is
  empty or non-numeric, `parseInt` returns `NaN`. `Number.isFinite(NaN)`
  is `false`, so the result is `INVALID_DURATION`. This is safe.
- `timeToMinutes()` trims input and returns `null` for any non-matching
  string, preventing type confusion.
- The `ContractInput` type enforces `duration: number` at compile time.
- **Risk level: Low.**

**Low-code findings:**
- Same `parseInt` + `Number.isFinite` pattern in `App.tsx` (line 39).
- Same `timeToMinutes()` null-return for malformed strings.
- Same `ContractInput` type enforcement.
- **Risk level: Low.**

### 1.4 Injection Risks

**Code-based findings:**
- No SQL queries, no shell commands, no `eval()`, no `Function()`
  constructor anywhere in the codebase.
- Booking data is hardcoded TypeScript constants — no external data
  source, no query layer.
- The Supabase dependency (`@supabase/supabase-js`) is imported in
  `package.json` but no Supabase client is instantiated in any source
  file. No database connection is made.
- **Risk level: Low.**

**Low-code findings:**
- No SQL queries, no shell commands, no `eval()`, no `Function()`.
- No database dependency at all.
- **Risk level: Low.**

---

## 2. XSS Protection

### 2.1 React Output Escaping

**Code-based findings:**
- All user-facing content is rendered through JSX expressions (`{result.message}`,
  `{room.name}`, `{b.title}`, etc.) which React auto-escapes by default.
- **No instances of `dangerouslySetInnerHTML` found** in either
  implementation (verified via grep across all `.ts`/`.tsx`/`.js`/`.jsx`
  files).
- **Risk level: Low.** React's built-in escaping protects all output.

**Low-code findings:**
- Same JSX expression pattern for all rendered content.
- No `dangerouslySetInnerHTML` found.
- **Risk level: Low.**

### 2.2 Unsafe HTML Rendering

**Code-based findings:**
- No `innerHTML`, `document.write()`, `.html()`, or `v-html` usage
  found anywhere.
- **Risk level: Low.**

**Low-code findings:**
- Same — no unsafe HTML rendering APIs used.
- **Risk level: Low.**

### 2.3 User-controlled Content Displayed in the UI

**Code-based findings:**
- User input (start time, duration) flows through the availability
  engine and is displayed as `result.message` in `ResultBanner.tsx`
  (line 41). The message is constructed by the engine from validated,
  typed values — not from raw user strings.
- `ExplainAvailability.tsx` displays `roomLabel` (from hardcoded room
  data, not user input) and engine-generated explanation text.
- The `explainAvailability()` function in `src/lib/ai/explainAvailability.ts`
  validates `roomLabel` (non-empty, max 100 chars), `startTime` and
  `endTime` (strict regex), and `reasonCode` (allowlist check) before
  generating text.
- **Risk level: Low.** All displayed content is engine-generated from
  validated inputs, not raw user strings.

**Low-code findings:**
- `result.message` displayed in `ResultBanner.tsx` (line 41) — same
  pattern, engine-generated from validated values.
- No AI explanation module, so fewer user-content display paths.
- **Risk level: Low.**

---

## 3. Access Control and Secrets

### 3.1 Authentication and Authorization

**Code-based findings:**
- No authentication system is present. The application is a read-only
  availability checker with no user accounts, no login, and no
  role-based access control.
- No API endpoints require authorization.
- **Risk level: Low** (for the current scope). The application performs
  no privileged operations and stores no user data. If extended to
  support bookings, authentication would be required.

**Low-code findings:**
- Same — no authentication, no authorization, no user accounts.
- **Risk level: Low** (same rationale).

### 3.2 Public Sharing and Deployment Configuration

**Code-based findings:**
- The application is a static SPA built with Vite. The `dist/` output
  contains only static HTML, CSS, and JS — no server-side code.
- No `.env` files exist in the project (verified via glob search).
- The `.bolt/config.json` contains only `{"template": "bolt-vite-react-ts"}`.
- **Risk level: Low.** Static deployment with no server attack surface.

**Low-code findings:**
- Same — static Vite SPA, no server-side code.
- No `.env` files found.
- **Risk level: Low.**

### 3.3 API Keys, Tokens, Environment Variables, and Exposed Secrets

**Code-based findings:**
- Grep for `SUPABASE`, `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD` across
  all source files: **no matches found**.
- The `@supabase/supabase-js` dependency is declared in `package.json`
  but never imported or used in any source file. No Supabase client is
  instantiated. No environment variables are read.
- **Risk level: Low.** No secrets are present in the codebase. The
  unused Supabase dependency adds bundle weight but does not expose
  credentials.
- **Potential risk:** If a `.env` file with Supabase keys were added
  later and committed, keys could be exposed in the static bundle. This
  is not currently the case.

**Low-code findings:**
- Same grep: **no matches found**.
- No Supabase dependency, no external service dependencies.
- **Risk level: Low.**

### 3.4 Whether Booking Data Can Be Modified

**Code-based findings:**
- Booking data is stored as `const` in `src/data/rooms.ts` — a
  read-only TypeScript constant array.
- The availability engine in `src/lib/contract.ts` operates on a
  filtered copy via `getBookingsForRoom()` in `src/lib/bookingSelectors.ts`,
  which returns `bookings.filter(...)` (a new array, not a reference).
- No `push`, `splice`, `pop`, or mutation methods are called on the
  bookings array anywhere in the codebase.
- T8 acceptance test explicitly verifies data integrity after checks.
- **Risk level: Low.** Booking data cannot be modified through the
  availability check flow.

**Low-code findings:**
- Same pattern — `const` bookings array, `getBookingsForRoom()` returns
  a filtered copy, no mutation methods used.
- T8 acceptance test verifies data integrity.
- **Risk level: Low.**

---

## 4. SCA (Software Composition Analysis)

### 4.1 Dependency Versions

**Code-based top-level dependencies:**

| Package | Version | Role |
|---|---|---|
| react | 18.3.1 | Runtime |
| react-dom | 18.3.1 | Runtime |
| lucide-react | 0.446.0 | Runtime (icons) |
| @supabase/supabase-js | ^2.57.4 | Runtime (unused) |
| vite | ^5.4.2 | Dev (build tool) |
| vitest | ^2.1.9 | Dev (test runner) |
| typescript | ^5.5.3 | Dev |
| eslint | ^9.9.1 | Dev |

**Low-code top-level dependencies:**

| Package | Version | Role |
|---|---|---|
| react | 18.3.1 | Runtime |
| react-dom | 18.3.1 | Runtime |
| lucide-react | 0.446.0 | Runtime (icons) |
| vite | ^5.4.2 | Dev (build tool) |
| vitest | ^2.1.9 | Dev (test runner) |
| typescript | ^5.5.3 | Dev |
| eslint | ^9.9.1 | Dev |
| jsdom | ^31.0.1 | Dev (test environment) |

### 4.2 npm Audit Findings

**Code-based:** 25 vulnerabilities (2 low, 7 moderate, 14 high, 2 critical)

Key findings:
- `brace-expansion` — High severity, ReDoS and DoS vulnerabilities
  (transitive dependency via Vite/esbuild)
- `ws` — High severity, uninitialized memory disclosure and DoS
  (transitive dependency)
- `@vitest/mocker` — Moderate, path traversal and code injection in
  Vitest (dev-only, not in production bundle)
- `tinypool` — Critical, prototype pollution leading to RCE
  (transitive via Vitest, dev-only)
- `@babel/core` — Arbitrary file read via sourceMappingURL
- `yaml` — Stack overflow via deeply nested collections

**Low-code:** 6 vulnerabilities (3 moderate, 1 high, 2 critical)

Key findings:
- `tinypool` — Critical, prototype pollution to RCE (via Vitest, dev-only)
- `@vitest/mocker` — Moderate, path traversal and code injection (dev-only)
- `esbuild` — Moderate, cross-origin dev server requests (via Vite, dev-only)

### 4.3 Outdated Dependencies

Both projects use similar dependency versions. Key observations:

| Package | Current version | Latest available | Outdated? |
|---|---|---|---|
| vite | 5.4.x | 8.x | Yes (major) |
| vitest | 2.1.9 | 5.x | Yes (major) |
| react | 18.3.1 | 19.x | Yes (major) |
| typescript | 5.5.x | 5.9.x | Yes (minor) |

### 4.4 Update Responsibilities

- **Vitest and Vite vulnerabilities are dev-only** — they do not appear
  in the production `dist/` bundle. The risk is limited to the
  development environment.
- **`npm audit fix`** can resolve most non-breaking issues. 
- **`npm audit fix --force`** would upgrade Vitest to v5 and Vite to v8,
  which are breaking changes requiring test and build verification.
- **`@supabase/supabase-js`** in the code-based project is unused and
  should be removed to reduce the dependency surface.
- **Risk level: Medium** (dev-only vulnerabilities, but critical
  severity findings exist in transitive dependencies).

### 4.5 Risk Assessment

| Implementation | Production risk | Development risk |
|---|---|---|
| Code-based | Low (static bundle, no server) | Medium (25 vulns, 2 critical in dev deps) |
| Low-code | Low (static bundle, no server) | Medium (6 vulns, 2 critical in dev deps) |

The lower vulnerability count in low-code is primarily due to fewer
transitive dependencies (no Supabase, fewer tooling packages).

---

## 5. DAST (Dynamic Application Security Testing)

### 5.1 Checks That Can Be Performed Locally

**Note:** No browser or runtime inspection tool is available in this
environment. The following are safe manual checks that could be
performed locally but were not executed during this review. They are
listed as recommended checks, not as verified results.

### 5.2 Invalid Input Behavior

**Code-based and Low-code (same behavior expected):**

| Check | Method | Expected result |
|---|---|---|
| Non-numeric duration | Enter "abc" in duration field | `INVALID_DURATION` (NaN → not finite) |
| Empty start time | Clear the time input | `INVALID_TIME` (empty string fails regex) |
| Negative duration | Enter "-5" | `INVALID_DURATION` (≤ 0 rejected) |
| Very large duration | Enter "99999" | `INVALID_DURATION` (> 120 rejected) |
| Special characters in time | Enter "09:00; DROP TABLE" | `INVALID_TIME` (regex rejects non-HH:MM) |
| HTML in time field | Enter "<script>alert(1)</script>" | `INVALID_TIME` (regex rejects; even if passed through, React escapes output) |

### 5.3 Unexpected Input Handling

| Check | Method | Expected result |
|---|---|---|
| Extremely long string in duration | Paste 10,000 chars | `INVALID_DURATION` (parseInt handles, result is NaN or large number) |
| Unicode in time field | Enter "09：00" (full-width colon) | `INVALID_TIME` (regex requires ASCII colon) |
| null/undefined passed to engine | Direct API call with null startTime | `INVALID_TIME` (timeToMinutes handles null input safely — `.trim()` on null would throw, but TypeScript types prevent this at compile time) |

### 5.4 Browser-Visible Security Issues

| Check | Method | Status |
|---|---|---|
| Content Security Policy | Check HTTP headers | Cannot verify — no server, depends on hosting platform |
| HTTPS enforcement | Check deployment URL | Cannot verify — depends on hosting platform |
| Console errors | Open browser dev tools | Cannot verify — no browser available |
| XSS via URL parameters | Append `?q=<script>` to URL | No URL parameter handling in either app — low risk |

### 5.5 Checks That Cannot Be Performed

- **Browser rendering inspection:** No browser or screenshot tool is
  available in this environment.
- **HTTP header analysis:** The application is a static SPA; headers
  depend on the hosting platform configuration, which is not accessible.
- **Network traffic interception:** No running server or network proxy
  is available.
- **WebSocket inspection:** No WebSocket connections are made by either
  application.
- **Production deployment security:** Deployment configuration is
  managed by the Bolt platform, not accessible from this environment.

---

## 6. Security Controls Already Present

| Control | Code-based | Low-code |
|---|---|---|
| Strict input validation (regex + range) | Yes | Yes |
| TypeScript compile-time type safety | Yes | Yes |
| React auto-escaping (no `dangerouslySetInnerHTML`) | Yes | Yes |
| Read-only booking data (const, no mutation) | Yes | Yes |
| No secrets in source code | Yes | Yes |
| No external API calls | Yes | Yes |
| Data integrity test (T8) | Yes | Yes |
| ESLint static analysis | Yes | Yes |
| No `eval()` or dynamic code execution | Yes | Yes |
| Filtered array copies (no reference sharing) | Yes | Yes |

---

## 7. Prioritized Security Improvements

1. **Remove unused `@supabase/supabase-js` dependency from code-based**
   — This dependency is declared but never imported. Removing it
   reduces the attack surface and bundle size. **Risk reduced: Low.**
   **Effort: Low.**

2. **Run `npm audit fix` in both projects** — Addresses non-breaking
   vulnerability fixes (e.g., `@babel/core`, `@babel/helpers`, `ajv`,
   `yaml`, `ws`). **Risk reduced: Medium → Low.** **Effort: Low.**

3. **Upgrade Vitest to v5 in both projects** — Resolves the critical
   `tinypool` prototype pollution and `@vitest/mocker` path traversal
   vulnerabilities. This is a breaking change requiring test
   verification. **Risk reduced: Medium → Low.** **Effort: Medium.**

4. **Add Content-Security-Policy meta tag to `index.html` in both
   projects** — A CSP header restricts script sources, providing
   defense-in-depth against XSS. Recommended policy:
   `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`.
   **Risk reduced: Low → Very Low.** **Effort: Low.**

5. **Upgrade Vite to v6+ in both projects** — Resolves the `esbuild`
   cross-origin dev server vulnerability. This is a breaking change
   requiring build verification. **Risk reduced: Medium → Low.**
   **Effort: Medium.**

6. **Add input length sanitization to `ExplainAvailability` in
   code-based** — The `roomLabel` is currently limited to 100 chars,
   but `reasonDetail` has no length cap. If the explanation feature
   were extended to accept external text, an unbounded string could
   cause performance issues. **Risk reduced: Low.** **Effort: Low.**

7. **Consider upgrading React to v19 in both projects** — Not a
   security fix, but ensures continued security patch support for the
   runtime framework. **Effort: Medium.**

---

## 8. Summary

| Area | Code-based risk | Low-code risk | Key finding |
|---|---|---|---|
| Input Validation | Low | Low | Multi-layer validation with strict regex and range checks |
| XSS Protection | Low | Low | React auto-escaping, no `dangerouslySetInnerHTML` |
| Access Control & Secrets | Low | Low | No auth needed for read-only app; no secrets present |
| SCA | Medium (dev) | Medium (dev) | Critical vulns in dev-only deps; unused Supabase dep in code-based |
| DAST | Not performed | Not performed | No browser available; manual checks documented as recommendations |

**Verified vulnerabilities:** None in application code. All
vulnerabilities are in development dependencies (Vitest, Vite) and do
not appear in the production bundle.

**Potential risks:** The unused Supabase dependency in code-based could
become a risk if `.env` files with keys were added and committed.

**No files were modified during this review.**
