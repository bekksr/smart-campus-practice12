# Project memory

## Product intent & audience

- Web application with two development approaches stored in separate subdirectories: `code-based/` (primary app with full source) and `low-code/` (alternative or companion version).
- App content/purpose not yet clearly specified.

## Brand personality & voice

- Not yet established; no design copy or branding artifacts observed.

## Visual design & UX direction

- Entry point is `index.html` at root (moved from `code-based/`).
- Uses a build system with `package.json` dependencies; build confirmed working.

## Decisions, constraints & rationale

- Bolt's dev server runs from project root (`/home/project/`); requires `package.json` and `index.html` at root level.
- `code-based/` app files were copied (not moved) to root so preview server can start; original `code-based/` and `low-code/` folders left intact.
- Dependencies installed at root after the copy.
- Build verified successful after restructure.

## Open questions & assumptions

- The `low-code/` directory's role and whether it also needs root-level setup is unknown.
- Whether both `code-based/` and `low-code/` are meant to coexist or one will be deprecated.
- App's actual feature set, target users, and design system are not yet described.
- Tech stack details (framework, CSS approach) not explicitly confirmed beyond build tooling.