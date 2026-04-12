# COMMIT_PLAN_50

This file contains exactly 50 suggested logical commits based on the current repository contents.

Important:
- These are documentation-ready logical commits.
- They are not the repository's real Git history.
- Do not use them to fake dates or rewrite contribution history.

## 1. Project Setup

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 1 | `chore: initialize project repository and ignore rules` | `.gitignore`, `README.md` | chore |
| 2 | `chore(client): scaffold React app with Vite` | `client/package.json`, `client/index.html`, `client/vite.config.js`, `client/src/main.jsx` | chore |
| 3 | `chore(server): scaffold Express backend entry point` | `server/package.json`, `server/server.js`, `server/src/app.js` | chore |
| 4 | `style(client): configure Tailwind and global styles` | `client/tailwind.config.js`, `client/postcss.config.js`, `client/src/index.css`, `client/src/App.css` | feature |
| 5 | `feat(state): configure Redux store and API slice` | `client/src/app/store.js`, `client/src/api/apiSlice.js` | feature |

## 2. Authentication

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 6 | `feat(auth): add user schema with roles and refresh tokens` | `server/src/modules/users/user.model.js` | feature |
| 7 | `feat(auth): add JWT signing and verification helpers` | `server/src/utils/jwt.js`, `server/src/config/env.js` | feature |
| 8 | `feat(auth): implement register and login service logic` | `server/src/modules/auth/auth.service.js` | feature |
| 9 | `feat(auth): add auth controllers for register, login, refresh, and logout` | `server/src/modules/auth/auth.controller.js` | feature |
| 10 | `feat(auth): expose validated authentication routes` | `server/src/modules/auth/auth.routes.js` | feature |
| 11 | `feat(auth-ui): create login form with validation` | `client/src/pages/Login.jsx` | feature |
| 12 | `feat(auth-ui): create register form with confirm-password validation` | `client/src/pages/Register.jsx` | feature |
| 13 | `feat(auth): add client auth API integration` | `client/src/api/authApi.js` | feature |
| 14 | `feat(auth): persist authenticated user in Redux and local storage` | `client/src/app/authSlice.js`, `client/src/utils/token.js` | feature |
| 15 | `fix(auth): harden Bearer token parsing in middleware` | `server/src/middleware/authMiddleware.js` | fix |

## 3. Public UI And Navigation

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 16 | `feat(layout): add main layout with navbar and footer` | `client/src/layouts/MainLayout.jsx`, `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx` | feature |
| 17 | `feat(routes): register home, treks, login, and register routes` | `client/src/routes/AppRoutes.jsx`, `client/src/App.jsx` | feature |
| 18 | `feat(ui): add reusable loading component` | `client/src/components/Loader.jsx` | feature |
| 19 | `feat(home): build landing page hero section and search bar` | `client/src/pages/Home.jsx` | feature |
| 20 | `feat(home): add adventure modes and featured trek highlights` | `client/src/pages/Home.jsx`, `client/src/assets/*` | feature |
| 21 | `feat(home): add testimonials, services, preparation, and gallery preview sections` | `client/src/pages/Home.jsx` | feature |
| 22 | `refactor(routes): lazy-load main public pages` | `client/src/routes/AppRoutes.jsx` | refactor |
| 23 | `fix(scope): align public navigation with reduced demo scope` | `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx`, `client/src/routes/AppRoutes.jsx` | fix |

## 4. Trek Catalogue And Details

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 24 | `feat(treks): create trek catalogue page` | `client/src/pages/TrekList.jsx` | feature |
| 25 | `feat(treks): add filter controls for region, difficulty, season, duration, and price` | `client/src/pages/TrekList.jsx` | feature |
| 26 | `feat(trek-details): add trek overview, itinerary, map, and elevation sections` | `client/src/pages/TrekDetails.jsx` | feature |
| 27 | `feat(trek-details): add included, excluded, equipment, and FAQ sections` | `client/src/pages/TrekDetails.jsx` | feature |
| 28 | `feat(trek-details): add booking request form and total cost calculation` | `client/src/pages/TrekDetails.jsx`, `client/src/api/bookingApi.js` | feature |
| 29 | `feat(trek-details): add availability calendar and preferred-date inquiry form` | `client/src/pages/TrekDetails.jsx`, `client/src/api/trekApi.js` | feature |
| 30 | `feat(reviews): display traveler reviews on home and trek detail pages` | `client/src/pages/Home.jsx`, `client/src/pages/TrekDetails.jsx`, `client/src/api/reviewApi.js` | feature |

## 5. User Experience Features

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 31 | `feat(i18n): add multilingual translation context` | `client/src/contexts/LanguageContext.jsx` | feature |
| 32 | `feat(i18n): add language selector to navbar` | `client/src/components/Navbar.jsx`, `client/src/contexts/LanguageContext.jsx` | feature |
| 33 | `fix(i18n): sync selected language with HTML lang attribute` | `client/src/contexts/LanguageContext.jsx` | fix |
| 34 | `feat(currency): add currency conversion context and formatter` | `client/src/contexts/CurrencyContext.jsx` | feature |
| 35 | `feat(currency): add currency switcher to navbar and trek prices` | `client/src/components/Navbar.jsx`, `client/src/pages/TrekList.jsx`, `client/src/pages/TrekDetails.jsx` | feature |
| 36 | `feat(analytics): initialize Google Analytics hook on app startup` | `client/src/utils/analytics.js`, `client/src/App.jsx` | feature |

## 6. Backend Modules And APIs

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 37 | `feat(regions): add region schema, service, controller, and routes` | `server/src/modules/regions/*` | feature |
| 38 | `feat(treks): add trek schema, service, controller, and routes` | `server/src/modules/treks/*` | feature |
| 39 | `feat(treks): support trek filtering, pagination, and region population` | `server/src/modules/treks/trek.service.js` | feature |
| 40 | `feat(bookings): add booking schema, service, controller, and routes` | `server/src/modules/bookings/*` | feature |
| 41 | `feat(bookings): generate invoice response and booking confirmation metadata` | `server/src/modules/bookings/booking.controller.js` | feature |
| 42 | `feat(reviews): add review schema, service, controller, and routes` | `server/src/modules/reviews/*` | feature |
| 43 | `feat(inquiries): add inquiry schema, service, controller, and routes` | `server/src/modules/inquiries/*` | feature |
| 44 | `feat(gallery): add gallery content schema and CRUD API` | `server/src/modules/gallery/*` | feature |
| 45 | `feat(hero): add hero slide schema and CRUD API` | `server/src/modules/hero/*` | feature |

## 7. Admin And Operational Backend

| # | Commit message | Likely files/folders involved | Category |
| --- | --- | --- | --- |
| 46 | `feat(admin): protect admin endpoints with auth and role middleware` | `server/src/middleware/authMiddleware.js`, `server/src/middleware/roleMiddleware.js`, `server/src/app.js` | feature |
| 47 | `feat(media): add shared image upload utility and static uploads serving` | `server/src/utils/upload.js`, `server/src/app.js`, `server/src/modules/treks/trek.routes.js`, `server/src/modules/gallery/gallery.routes.js`, `server/src/modules/hero/hero.routes.js` | feature |
| 48 | `feat(health): add health endpoints and API alias` | `server/src/app.js` | feature |
| 49 | `feat(payments): add payment model and booking-paid record creation` | `server/src/modules/payments/payment.model.js`, `server/src/modules/bookings/booking.controller.js` | feature |
| 50 | `fix(client): clean lint configuration and page loading behavior` | `client/eslint.config.js`, `client/src/routes/AppRoutes.jsx`, `client/src/pages/Home.jsx` | fix |

## Suggested Phase Grouping

- Project setup: 1-5
- Authentication: 6-15
- UI pages: 16-23
- User features: 24-36
- Backend/API: 37-45
- Admin panel/backend foundation: 46-49
- Bug fixes/refactoring: 22, 23, 33, 50

## Honest Usage Note

If you use this in a report or viva, say:

"The actual Git repository has a compact commit history, so this 50-item list is a logical feature-wise breakdown of the development work based on the current codebase, not a claim that all 50 commits exist in Git."
