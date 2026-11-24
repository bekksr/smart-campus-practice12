---
name: bug-detector
description: A systematic workflow for reproducing, localizing, explaining, fixing, and verifying software bugs using focused tests and regression testing.
---

# Bug Detector

## Purpose

Use this skill to investigate software defects systematically,
avoid unsupported assumptions, make minimal fixes, and verify
that existing functionality continues to work.

## Workflow

### 1. REPRODUCE
- Read the relevant source code and existing tests.
- Identify the expected and actual behavior.
- Create a minimal test case that demonstrates the defect.
- Record the command and test result.
- If the original defect cannot be reproduced, state this limitation.
- Never claim that a historical bug was reproduced without evidence.

### 2. LOCALIZE
- Trace the failing test to the relevant function or code path.
- Inspect boundary conditions, comparisons, state changes,
  input validation, and possible side effects.
- Use the smallest relevant code section to identify the cause.

### 3. EXPLAIN
- Explain the root cause in clear language.
- Describe why the observed behavior differs from the expected behavior.
- Distinguish confirmed findings from assumptions.

### 4. PATCH
- Make the smallest change that addresses the confirmed root cause.
- Avoid unrelated refactoring or unnecessary dependency updates.
- Preserve existing interfaces and intended behavior.

### 5. VERIFY
- Run the focused test that reproduces the defect.
- Run the full regression test suite.
- Run available type checking, linting, and production build commands.
- Record the actual results, including warnings and failures.
- Do not report a check as passed unless it was actually executed.

### 6. IMPROVE
- Add regression tests for the defect and relevant edge cases.
- Check that input data and shared state are not unexpectedly mutated.
- Consider controlled mutation testing to check whether tests detect
  representative incorrect implementations.
- Clearly label artificial mutants as test experiments, not original bugs.

## Reporting Format

For each investigated defect, record:

1. **Expected behavior**
2. **Observed behavior**
3. **Reproduction test and evidence**
4. **Root cause**
5. **Fix or limitation**
6. **Verification results**
7. **Regression tests added**

## Safety and Accuracy Rules

- Never invent test output, screenshots, code history, or evidence.
- Do not describe a defect as fixed unless a corresponding fix was made.
- If the supplied implementation already behaves correctly, report that.
- Keep temporary mutant implementations separate from production code.
- Remove temporary test files before final verification.
- Preserve useful evidence logs and document how they were generated.
