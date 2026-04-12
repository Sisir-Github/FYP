# FEATURE_COMMIT_PLAN

This file suggests a clean logical commit plan based on the current repository contents.

Important:
- These are suggested logical commits for documentation, reporting, or future clean work habits.
- They are not the repository's actual historical commits.
- Do not rewrite Git history or fake dates to match this plan.

Suggested total: 75 logical commits

## Project Setup

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 1 | `chore: initialize repository ignores and base README` | `.gitignore`, `README.md` | chore |
| 2 | `chore(client): scaffold Vite React frontend` | `client/package.json`, `client/index.html`, `client/vite.config.js`, `client/src/main.jsx` | chore |
| 3 | `chore(server): scaffold Express API server` | `server/package.json`, `server/server.js`, `server/src/app.js` | chore |
| 4 | `style(client): add Tailwind setup and global design tokens` | `client/tailwind.config.js`, `client/postcss.config.js`, `client/src/index.css`, `client/src/App.css` | feature |
| 5 | `feat(state): configure Redux store and RTK Query base API` | `client/src/app/store.js`, `client/src/api/apiSlice.js` | feature |
| 6 | `chore(server): add env, db, and shared middleware foundations` | `server/src/config/env.js`, `server/src/config/db.js`, `server/src/middleware/errorMiddleware.js`, `server/src/middleware/validate.js` | chore |

## Authentication

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 7 | `feat(auth): add user model with role and refresh token storage` | `server/src/modules/users/user.model.js` | feature |
| 8 | `feat(auth): add JWT helper utilities` | `server/src/utils/jwt.js`, `server/src/config/env.js` | feature |
| 9 | `feat(auth): implement register, login, refresh, and logout services` | `server/src/modules/auth/auth.service.js` | feature |
| 10 | `feat(auth): expose validated auth routes and controllers` | `server/src/modules/auth/auth.routes.js`, `server/src/modules/auth/auth.controller.js` | feature |
| 11 | `feat(auth): add auth slice and local session persistence` | `client/src/app/authSlice.js`, `client/src/utils/token.js` | feature |
| 12 | `feat(auth): connect client auth API mutations` | `client/src/api/authApi.js`, `client/src/api/apiSlice.js` | feature |
| 13 | `feat(auth-ui): build login page with zod form validation` | `client/src/pages/Login.jsx` | feature |
| 14 | `feat(auth-ui): build register page with confirm-password validation` | `client/src/pages/Register.jsx` | feature |
| 15 | `feat(nav): surface login, register, and logout actions in navbar` | `client/src/components/Navbar.jsx` | feature |
| 16 | `fix(auth): retry failed requests after refresh and clear stale auth state` | `client/src/api/apiSlice.js` | fix |
| 17 | `fix(auth): clear client auth state even if logout API fails` | `client/src/components/Navbar.jsx` | fix |
| 18 | `fix(auth): harden Bearer token parsing in middleware` | `server/src/middleware/authMiddleware.js` | fix |

## UI Pages

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 19 | `feat(routes): add public route tree for home, treks, login, and register` | `client/src/routes/AppRoutes.jsx`, `client/src/App.jsx` | feature |
| 20 | `feat(layout): add shared main layout with navbar and footer` | `client/src/layouts/MainLayout.jsx`, `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx` | feature |
| 21 | `feat(ui): add loader component for page and API states` | `client/src/components/Loader.jsx` | feature |
| 22 | `feat(home): build hero banner and search form` | `client/src/pages/Home.jsx` | feature |
| 23 | `feat(home): add adventure modes and featured trek cards` | `client/src/pages/Home.jsx`, `client/src/assets/*` | feature |
| 24 | `feat(home): add service highlights, testimonials, and gallery sections` | `client/src/pages/Home.jsx` | feature |
| 25 | `feat(treks): build trek catalogue page` | `client/src/pages/TrekList.jsx` | feature |
| 26 | `feat(treks): add region, difficulty, season, duration, and price filters` | `client/src/pages/TrekList.jsx` | feature |
| 27 | `feat(trek-details): build overview, itinerary, map, and FAQ sections` | `client/src/pages/TrekDetails.jsx` | feature |
| 28 | `feat(trek-details): add booking request and availability sidebar` | `client/src/pages/TrekDetails.jsx`, `client/src/api/bookingApi.js`, `client/src/api/trekApi.js` | feature |
| 29 | `refactor(routes): lazy-load public pages with suspense fallback` | `client/src/routes/AppRoutes.jsx` | refactor |

## Backend/API

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 30 | `feat(api): add region controller, service, and routes` | `server/src/modules/regions/*` | feature |
| 31 | `feat(api): add trek CRUD and public detail endpoints` | `server/src/modules/treks/*` | feature |
| 32 | `feat(api): support trek filtering, pagination, and region population` | `server/src/modules/treks/trek.service.js` | feature |
| 33 | `feat(api): add booking create, my-bookings, and invoice endpoints` | `server/src/modules/bookings/*` | feature |
| 34 | `feat(api): add review list and protected review submission rules` | `server/src/modules/reviews/*` | feature |
| 35 | `feat(api): add inquiry submission and admin inquiry listing` | `server/src/modules/inquiries/*` | feature |
| 36 | `feat(api): add gallery public feed and admin CRUD routes` | `server/src/modules/gallery/*` | feature |
| 37 | `feat(api): add hero slide public feed and admin CRUD routes` | `server/src/modules/hero/*` | feature |
| 38 | `feat(api): compute trek availability from booking load` | `server/src/modules/treks/trek.service.js`, `server/src/modules/bookings/booking.model.js` | feature |
| 39 | `feat(api): create payment record when booking becomes paid` | `server/src/modules/bookings/booking.controller.js`, `server/src/modules/payments/payment.model.js` | feature |
| 40 | `feat(api): add shared upload handling for content images` | `server/src/utils/upload.js`, `server/src/modules/treks/trek.routes.js`, `server/src/modules/gallery/gallery.routes.js`, `server/src/modules/hero/hero.routes.js` | feature |

## Database/Models

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 41 | `feat(model): add region schema with slug support` | `server/src/modules/regions/region.model.js`, `server/src/modules/regions/region.service.js` | feature |
| 42 | `feat(model): add trek package schema with itinerary, FAQ, and media fields` | `server/src/modules/treks/trek.model.js` | feature |
| 43 | `feat(model): add booking schema with payment and status tracking` | `server/src/modules/bookings/booking.model.js` | feature |
| 44 | `feat(model): add review schema linked to bookings and treks` | `server/src/modules/reviews/review.model.js` | feature |
| 45 | `feat(model): add inquiry schema for contact records` | `server/src/modules/inquiries/inquiry.model.js` | feature |
| 46 | `feat(model): add gallery item schema` | `server/src/modules/gallery/gallery.model.js` | feature |
| 47 | `feat(model): add hero slide schema with CTA and ordering fields` | `server/src/modules/hero/hero.model.js` | feature |
| 48 | `feat(model): add payment schema for booking transactions` | `server/src/modules/payments/payment.model.js` | feature |

## Admin Panel / Admin Backend

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 49 | `feat(admin): protect admin routes with auth and role middleware` | `server/src/middleware/authMiddleware.js`, `server/src/middleware/roleMiddleware.js`, `server/src/app.js` | feature |
| 50 | `feat(admin): add admin region and trek management endpoints` | `server/src/modules/regions/region.routes.js`, `server/src/modules/treks/trek.routes.js` | feature |
| 51 | `feat(admin): add admin booking update flow` | `server/src/modules/bookings/booking.routes.js`, `server/src/modules/bookings/booking.controller.js` | feature |
| 52 | `feat(admin): add admin review and inquiry monitoring endpoints` | `server/src/modules/reviews/review.routes.js`, `server/src/modules/inquiries/inquiry.routes.js` | feature |
| 53 | `feat(admin): add admin gallery and hero content management endpoints` | `server/src/modules/gallery/gallery.routes.js`, `server/src/modules/hero/hero.routes.js` | feature |
| 54 | `style(admin): add admin utility classes in shared stylesheet` | `client/src/index.css` | feature |

## User Features

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 55 | `feat(user): add currency context and price formatting` | `client/src/contexts/CurrencyContext.jsx`, `client/src/components/Navbar.jsx`, `client/src/pages/TrekList.jsx`, `client/src/pages/TrekDetails.jsx` | feature |
| 56 | `feat(user): add multilingual dictionary and language selector` | `client/src/contexts/LanguageContext.jsx`, `client/src/components/Navbar.jsx`, `client/src/pages/*` | feature |
| 57 | `feat(user): connect home page to trek, region, review, gallery, and hero APIs` | `client/src/pages/Home.jsx`, `client/src/api/trekApi.js`, `client/src/api/reviewApi.js`, `client/src/api/galleryApi.js`, `client/src/api/heroApi.js` | feature |
| 58 | `feat(user): connect trek list page to region and filtered trek APIs` | `client/src/pages/TrekList.jsx`, `client/src/api/trekApi.js` | feature |
| 59 | `feat(user): connect trek details page to booking, review, inquiry, and availability APIs` | `client/src/pages/TrekDetails.jsx`, `client/src/api/bookingApi.js`, `client/src/api/reviewApi.js`, `client/src/api/trekApi.js` | feature |
| 60 | `feat(user): persist auth, language, and currency preferences locally` | `client/src/utils/token.js`, `client/src/contexts/LanguageContext.jsx`, `client/src/contexts/CurrencyContext.jsx` | feature |
| 61 | `feat(user): add analytics bootstrap to the client app` | `client/src/utils/analytics.js`, `client/src/App.jsx` | feature |

## Bug Fixes

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 62 | `fix(scope): align navbar and footer with the reduced public demo scope` | `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx` | fix |
| 63 | `fix(scope): trim current route tree to login, register, home, and trek flow` | `client/src/routes/AppRoutes.jsx`, `client/src/main.jsx`, `server/src/app.js` | fix |
| 64 | `fix(api): add /api/health alias for versioned health checks` | `server/src/app.js` | fix |
| 65 | `fix(i18n): sync document lang with the selected app language` | `client/src/contexts/LanguageContext.jsx` | fix |
| 66 | `fix(client): clean up ESLint config and route loading behavior` | `client/eslint.config.js`, `client/src/routes/AppRoutes.jsx`, `client/src/pages/Home.jsx` | fix |

## Refactoring

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 67 | `refactor(server): keep controller-service-model structure consistent across modules` | `server/src/modules/*` | refactor |
| 68 | `refactor(validation): reuse generic validate middleware for content modules` | `server/src/middleware/validate.js`, `server/src/modules/gallery/gallery.routes.js`, `server/src/modules/hero/hero.routes.js` | refactor |
| 69 | `refactor(client): normalize flexible API response parsing across pages` | `client/src/pages/Home.jsx`, `client/src/pages/TrekList.jsx`, `client/src/pages/TrekDetails.jsx`, `client/src/pages/Login.jsx`, `client/src/pages/Register.jsx` | refactor |
| 70 | `refactor(upload): centralize upload storage and file filtering logic` | `server/src/utils/upload.js`, `server/src/modules/treks/trek.routes.js`, `server/src/modules/gallery/gallery.routes.js`, `server/src/modules/hero/hero.routes.js` | refactor |

## Testing

No separate automated test files, test directories, or test scripts are present in the current repository snapshot. To stay honest, this plan does not invent test commits that are not evidenced by the codebase.

## Deployment

| # | Suggested commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 71 | `chore(deploy): connect MongoDB during server startup` | `server/server.js`, `server/src/config/db.js` | chore |
| 72 | `feat(deploy): serve uploaded files from a public static path` | `server/src/app.js`, `server/src/utils/upload.js` | feature |
| 73 | `chore(deploy): add root health endpoint for smoke checks` | `server/src/app.js` | chore |
| 74 | `feat(deploy): expose /api aliases for production-oriented client calls` | `server/src/app.js` | feature |
| 75 | `chore(deploy): support cookie and client-origin settings from environment` | `server/src/config/env.js`, `server/src/modules/auth/auth.controller.js`, `server/src/app.js` | chore |

## How To Use This Plan In Documentation

- Refer to it as a "logical commit grouping" or "feature-wise breakdown".
- Do not claim that all 75 entries exist in the real Git history.
- Use it to explain development flow, module boundaries, and engineering effort in a cleaner way during report writing or viva presentation.
