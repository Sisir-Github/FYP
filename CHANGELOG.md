# CHANGELOG

This changelog is prepared for academic review and viva use.

It is intentionally honest:
- Exact dates are only used where they are supported by the repository's real Git history.
- Broad phase summaries are derived from the current repository snapshot and are labeled as documentation summaries, not reconstructed Git history.
- No fake commits, fake tags, or rewritten dates are implied by this document.

## Repository Snapshot

- Project theme: trekking and expedition booking platform for Everest Encounter
- Reviewed snapshot date: 2026-04-09
- Frontend stack: React, Vite, Tailwind CSS, Redux Toolkit, RTK Query, React Hook Form, Zod, Framer Motion
- Backend stack: Express, MongoDB, Mongoose, JWT, Multer, Zod

## Actual Git Checkpoints

| Date | Commit | Branch context | Summary |
| --- | --- | --- | --- |
| 2026-02-22 | `48a35c2` | `main` | Authentication foundation added: login/register pages, auth API layer, auth slice, JWT helpers, auth service, auth routes, user model. |
| 2026-02-23 | `6c62248` | `backup/main-before-scope-cleanup-2026-02-25` | Archived broader prototype evidence: extra pages, admin UI files, payment-related files, and expanded modules existed on a backup branch before later scope cleanup. |
| 2026-02-25 | `4712de4` | `main` | Public site and core backend modules were added in bulk: home page, trek list/detail pages, regions, treks, bookings, reviews, inquiries, gallery, hero, upload utility, and app wiring. |
| 2026-02-25 | `298ce64` | `main` | Client route scope was reduced and aligned to the current public demo flow: login, register, home, trek list, trek details. |
| 2026-03-07 | `b998d50` | `main` | Added `/api/health` endpoint alias. |
| 2026-03-08 | `938c803` | `main` | Hardened Bearer token parsing in auth middleware. |
| 2026-03-08 | `7085b5b` | `main` | Synced the HTML `lang` attribute with the selected UI language. |
| 2026-03-10 | `aa1da73` | `main` | Cleaned client lint issues and switched route loading to lazy loading with suspense fallback. |
| 2026-03-23 | `f63d75e` | `main` | Marker commit named `home backend`; the commit is present in history but contains no file diff. |

## Timeline Summary For Review

### 2026-02-22: Authentication Baseline

- User schema added with role and refresh token support.
- JWT signing and verification helpers added.
- Backend auth service and routes added for register, login, refresh, and logout.
- Frontend login and register pages added with validation.
- Redux auth slice and local session persistence added.

### 2026-02-23: Archived Broader Prototype Evidence

- A backup branch shows that a larger prototype existed early, including additional user pages, admin pages, and payment-related files.
- This broader state is not the same as the current `main` branch deliverable and should be described as archived prototype work, not as current shipped scope.

### 2026-02-25: Public Product Scope And Core Backend Foundation

- Home page, trek list page, and trek detail page were introduced.
- Frontend data layer was expanded for treks, bookings, reviews, gallery, and hero content.
- Backend modules were added for regions, treks, bookings, reviews, inquiries, gallery, hero, and payment records.
- Shared server concerns were added: DB bootstrap, error middleware, role middleware, validation middleware, and upload handling.

### 2026-02-25: Scope Cleanup On Current Main

- Public routes and navigation were cleaned up to focus on login, register, home, trek list, and trek detail pages.
- This makes the current main branch easier to demo as a focused FYP prototype, even though some backend modules remain broader than the visible client scope.

### 2026-03-07 To 2026-03-10: Hardening And Cleanup

- Added `/api/health` to support environment-aware health checks.
- Improved Bearer token parsing in auth middleware.
- Synced selected language with the browser document language.
- Cleaned lint setup and converted route components to lazy loading.

### 2026-03-23 To 2026-04-09: Review Snapshot State

- No further dated file-changing commits are visible on `main` after 2026-03-10.
- A marker commit exists on 2026-03-23, but it does not carry file changes.
- As of 2026-04-09, the repository represents a working prototype with:
  - public authentication
  - public trek browsing and trek detail flow
  - booking request creation
  - review display
  - inquiry capture
  - gallery and hero content APIs
  - admin-protected backend CRUD endpoints for content and operational data

## Current Feature Inventory

### Frontend

- Public pages on current route tree:
  - Home
  - Trek List
  - Trek Details
  - Login
  - Register
- Shared UI:
  - Navbar
  - Footer
  - Loader
  - Main layout
- User-facing platform features:
  - multilingual content dictionary
  - currency switching
  - RTK Query API integration
  - auth persistence
  - analytics bootstrap
  - lazy-loaded routes

### Backend

- Auth module
- Region module
- Trek module
- Booking module
- Review module
- Inquiry module
- Gallery module
- Hero module
- Payment record model
- Shared middleware for auth, validation, roles, and errors
- File upload utility and static `/uploads` serving
- Health endpoints and `/api/*` route aliases

## Honest Notes And Gaps

- The root [`README.md`](/e:/Fyp/1st/Log%20book%201/shishir%20bhai/fyp/README.md) is outdated and still describes the repository as auth-only, while the current tree contains a much larger public site and backend.
- The current client route tree only registers home, treks, login, and register pages, but the home page still contains links to `/guide` and `/gallery`, which are not routed on current `main`.
- The client auth API includes a `me` query, but current `main` does not expose a matching `/auth/me` route.
- Payment support is partial on current `main`: a payment model exists and booking updates can create payment records, but dedicated payment routes/controllers/pages are not present in this branch.
- No automated test suite, CI pipeline, containerization, or deployment manifests are present in the current repository snapshot.

## Recommended Academic Framing

The fairest description of this repository as of 2026-04-09 is:

"A functional FYP prototype with a completed public browsing and booking-request workflow, a substantial backend module foundation, and partial admin/content-management backend support. The Git history is compact and batched, so feature progress should be explained phase-wise rather than by pretending there were many fine-grained historical commits."
