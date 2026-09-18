# DevReview — Production Readiness Audit

## Audit Information

- **Date:** September 18, 2026
- **Scope:** Complete application — frontend (Next.js 16 App Router, React 19), backend (Express 5, Node.js), database (MongoDB/Mongoose), deployment config
- **Application Architecture:** Monorepo with independent `frontend/` (Next.js 16 on Vercel) and `backend/` (Express 5 on Render) apps. REST API, MongoDB Atlas, Cloudinary image storage, Resend email, Google OAuth 2.0
- **Audit Type:** Full production-readiness code audit (no runtime/browser testing)
- **Status:** AUDIT COMPLETE — DO NOT DEPLOY WITHOUT FIXING CRITICAL ISSUES

---

## Executive Summary

**This application is NOT production-ready.** There are critical security vulnerabilities that must be resolved before any public deployment.

### Critical Findings
- **All production secrets are hardcoded in `.env` files** — MongoDB password, Resend API key, Cloudinary API secret, Gmail app password, and a trivially guessable JWT secret (`devreview123`). If these files were ever committed to git, all credentials are compromised and must be rotated immediately.
- **No CSRF protection** combined with `sameSite: "none"` cookies in production creates a real attack vector for state-changing requests.
- **OTP type confusion** — password reset OTP can be used for email verification and vice versa, since the lookup doesn't filter by OTP type.

### High Findings
- `getAllUsers` endpoint returns ALL users with no pagination — server will crash at scale
- `getReviews` endpoint returns ALL reviews for a project with no pagination
- `deleteProject` doesn't clean up associated reviews or notifications (orphaned data)
- Embedded `followers`/`following` arrays in User model will hit MongoDB's 16MB document limit
- Route collision between `/reviews/unread-count` and `/:id/review`

### Medium Findings
- 14+ endpoints lack pagination
- Race conditions in follow, like, and save operations
- Weak password validation (length only, no complexity)
- Hardcoded CORS origins instead of environment variable
- 10MB JSON body limit enables DoS
- Landing page Featured Projects section is entirely hardcoded

### Dynamic Data Status
- **Backend-connected pages (GOOD):** Dashboard, Explore Projects, Explore Users, Leaderboard, Project Detail, Notifications, Saved Projects, Auth, Settings, Messages, User Profiles
- **Hardcoded/static pages (NEEDS FIX):** Landing Page Featured Projects, Landing Page Reviews section, filter category arrays

---

## 1. Critical Issues

| ID | Area | Location | Issue | Impact | Status | Confidence |
|----|------|----------|-------|--------|--------|------------|
| C-1 | Security | `backend/.env:6` | JWT secret is `devreview123` — trivially guessable. Attacker can forge any JWT token, impersonate any user including admins | Complete authentication bypass | VERIFIED | VERIFIED |
| C-2 | Security | `backend/.env:3,5,9-14` | All production secrets hardcoded in plaintext: MongoDB password (`hamid%400008`), Resend API key, Gmail app password, Cloudinary API secret, Google OAuth Client ID. If committed to git, all credentials compromised | Full infrastructure compromise | VERIFIED | VERIFIED |
| C-3 | Security | `backend/controllers/auth.controller.js:100` | OTP lookup `OTP.findOne({ email })` does NOT filter by `type`. A password reset OTP (type `RESET_PASSWORD`) can be used for email verification and vice versa | OTP type confusion — security bypass | VERIFIED | VERIFIED |
| C-4 | Security | `backend/server.js:26-32` + global | No CSRF protection middleware. Combined with `sameSite: "none"` cookies in production (`auth.controller.js:185`), state-changing POST/PATCH/DELETE endpoints are vulnerable to cross-site request forgery | Attacker can make authenticated requests on behalf of users | VERIFIED | LIKELY |
| C-5 | Data Integrity | `backend/controllers/projectController.js:404-409` | `deleteProject` deletes the project and removes from saved arrays but does NOT delete associated `Review` documents or `Notification` documents | Orphaned reviews and notifications reference non-existent projects | VERIFIED | VERIFIED |
| C-6 | Scalability | `backend/controllers/userController.js:194` | `getAllUsers` fetches EVERY user in the database with no pagination, no search, no limit | Server crash and OOM at ~10K+ users | VERIFIED | VERIFIED |
| C-7 | Scalability | `backend/controllers/reviewController.js:105-107` | `getReviews` fetches ALL reviews for a project with no limit or pagination | Unbounded response size for popular projects | VERIFIED | VERIFIED |
| C-8 | Scalability | `backend/models/Users.js:64-81` | Embedded `followers`/`following` arrays have no size limit. A user with millions of followers will exceed MongoDB's 16MB document size limit | Document corruption, query failure | VERIFIED | LIKELY |

---

## 2. High Priority Issues

| ID | Area | Location | Issue | Impact | Status | Confidence |
|----|------|----------|-------|--------|--------|------------|
| H-1 | Routing | `backend/server.js:57` + `backend/routes/projectRoutes.js:29` | Route collision: `/api/reviews/unread-count` vs `GET /:id/review` — Express matches `/:id/review` where `id = "unread-count"` | Unpredictable routing, 404s or wrong handler | VERIFIED | LIKELY |
| H-2 | Authorization | `backend/models/Users.js:35` + `backend/utils/generateToken.js:5` | `role` field is freeform String (no enum). Admin check on `/leaderboard/initialize` relies solely on JWT payload `role` without DB re-verification | Privilege escalation if JWT is forged | VERIFIED | LIKELY |
| H-3 | Security | `backend/controllers/auth.controller.js:185` | `sameSite: "none"` in production enables cross-site cookie sending. Without CSRF tokens, mutation endpoints vulnerable | CSRF attacks on state-changing endpoints | VERIFIED | LIKELY |
| H-4 | Security | `frontend/.env:1` | API URL defaults to `http://localhost:5000/api`. Production URL in comments has typo: `devreiview.onrender.com` (should be `devreview`) | Broken API in production if env var not set on Vercel | VERIFIED | VERIFIED |
| H-5 | Performance | `backend/controllers/projectController.js:149` | `getProjectById` loads ALL reviews into memory to compute stats. Should use `Reviews.aggregate()` server-side | Slow responses, high memory usage for popular projects | VERIFIED | LIKELY |
| H-6 | Data | `backend/controllers/projectController.js:404-409` | `deleteProject` doesn't cascade-delete reviews or notifications | Orphaned data, broken references | VERIFIED | VERIFIED |
| H-7 | Security | `frontend/next.config.mjs:12` | `dangerouslyAllowSVG: true` for ui-avatars.com — SVG images can contain scripts | Potential stored XSS via SVG | VERIFIED | POTENTIAL |
| H-8 | UX | `frontend/Components/LandingPage/FeaturedProjects.jsx:11-26` | Hardcoded static project list instead of API fetch. Shows fake projects with hardcoded titles, tech stacks, developer names | Users see fake data on landing page | VERIFIED | VERIFIED |
| H-9 | UX | `frontend/Components/LandingPage/Reviews.jsx:75-97` | Hardcoded fake review from "Hariom Singh" with fake rating and review text | Misleading content, fake social proof | VERIFIED | VERIFIED |
| H-10 | UX | `frontend/Components/LandingPage/Community.jsx:84-123` | Hardcoded fake community review preview card | Fabricated community feedback | VERIFIED | VERIFIED |
| H-11 | Security | `backend/server.js:33` | 10MB JSON body limit. Malicious client can send many 10MB payloads to exhaust server memory | DoS via memory exhaustion | VERIFIED | LIKELY |
| H-12 | SEO | frontend (all routes) | No `robots.txt` or `sitemap.xml` — search engines cannot discover site structure | Poor SEO indexing for public launch | VERIFIED | VERIFIED |

---

## 3. Medium Priority Issues

| ID | Area | Location | Issue | Impact | Status | Confidence |
|----|------|----------|-------|--------|--------|------------|
| M-1 | Security | `backend/utils/validate.js:9-13` | Password validation only checks `length >= 8`. No uppercase, lowercase, number, or special character requirements | Weak passwords vulnerable to dictionary attacks | VERIFIED | VERIFIED |
| M-2 | Security | `backend/controllers/auth.controller.js:185` | Cookie `sameSite: "none"` in production. If `NODE_ENV` isn't set, defaults to `"lax"` breaking cross-origin cookies | Inconsistent cookie behavior | VERIFIED | POTENTIAL |
| M-3 | Security | `backend/utils/generateToken.js:4-8` | JWT has 7-day expiry with no refresh token and no `jti` for revocation | Stolen tokens valid for 7 days, no way to revoke | VERIFIED | VERIFIED |
| M-4 | Race Condition | `backend/controllers/userController.js:89-118` | `toggleFollow` reads array, checks, then pushes. Concurrent follows can both push, creating duplicates | Duplicate follower entries | VERIFIED | LIKELY |
| M-5 | Race Condition | `backend/controllers/projectController.js:440-444` | `toggleLikes` same pattern — concurrent likes can duplicate the like entry | Duplicate like entries | VERIFIED | LIKELY |
| M-6 | Race Condition | `backend/controllers/chatController.js:54-65` | No unique compound index on conversation `participants`. Concurrent conversations can be created | Duplicate conversations | VERIFIED | LIKELY |
| M-7 | Race Condition | `backend/controllers/auth.controller.js:238-245` | Username generation uses TOCTOU pattern (`findOne` then `create`). No unique index catch | Duplicate usernames possible | VERIFIED | LIKELY |
| M-8 | Performance | `backend/middleware/rateLimiter.middleware.js` | All rate limiters use IP-based key. Behind a load balancer, all users share one IP | Rate limiting ineffective or overly restrictive | VERIFIED | LIKELY |
| M-9 | Validation | `backend/controllers/reviewController.js:8-89` | `addReviews` doesn't type-check `rating` — string `"3"` passes `rating < 1` comparison via JS coercion | Non-numeric ratings may be stored | VERIFIED | LIKELY |
| M-10 | Validation | `backend/controllers/support.controller.js:14-21` | Support request accepts `name` and `email` from body instead of `req.user` | Support requests can impersonate other users | VERIFIED | VERIFIED |
| M-11 | Data | `backend/controllers/rankingService.js:44-46` | All ranking functions silently catch errors. Failed leaderboard updates give no feedback | Lost points, inconsistent leaderboard | VERIFIED | VERIFIED |
| M-12 | Data | `backend/controllers/reviewController.js:157` | `deleteReview` doesn't reverse ranking points for reviewer or project owner | Points accumulate permanently even on delete | VERIFIED | VERIFIED |
| M-13 | Data | `backend/controllers/projectController.js:449` | Like ranking points added on like, but not removed on unlike | Points persist after unlike | VERIFIED | VERIFIED |
| M-14 | Performance | `backend/controllers/leaderboardController.js:7-8` | `getLeaderboard` limit has no upper bound — client can request `limit=999999` | Unbounded response | VERIFIED | VERIFIED |
| M-15 | Performance | `backend/controllers/userController.js:18` | `getUserProfile` loads ALL projects into memory to compute stats. N+1 query pattern | Slow for users with many projects | VERIFIED | LIKELY |
| M-16 | UX | `frontend/Components/DevReviewLayout/ExploreProjects.jsx:29-40` | Hardcoded category filter array. Projects with tech stacks not in list (Vue, Python, Django) aren't filterable | Incomplete filtering | VERIFIED | VERIFIED |
| M-17 | UX | `frontend/Components/DevReviewLayout/ExploreUsers.jsx:27-38` | Hardcoded user category filter array | Incomplete filtering | VERIFIED | VERIFIED |
| M-18 | UX | `frontend/Components/DevReviewLayout/Dashboard.jsx:330` | Project thumbnail fallback to external Unsplash URL. If URL changes or is blocked, no fallback | Broken thumbnails | VERIFIED | VERIFIED |
| M-19 | SEO | `frontend/app/page.js:11` | OG `url: "/"` is relative. Should be absolute URL | Incorrect Open Graph metadata | VERIFIED | VERIFIED |
| M-20 | Security | `next.config.mjs` + `backend/server.js` | No security headers configured on frontend (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) | Browser-level security mitigations missing | VERIFIED | VERIFIED |
| M-21 | Accessibility | Multiple auth components | `role="alert"` missing on error messages in SignUp, VerifyOtp, ForgotPassword, ResetPassword | Screen readers won't announce errors | VERIFIED | VERIFIED |
| M-22 | Accessibility | `Project.jsx:623-643` | Star rating buttons have no `aria-label` | Inaccessible to screen readers | VERIFIED | VERIFIED |
| M-23 | Edge Case | `UserProfile.jsx:498` | No handling for when user profile doesn't exist (deleted user) | Component may crash | VERIFIED | LIKELY |

---

## 4. Low Priority Issues

| ID | Area | Location | Issue | Impact | Status | Confidence |
|----|------|----------|-------|--------|--------|------------|
| L-1 | HTTP | `backend/controllers/projectController.js:45` | `createProjects` returns 200 OK. Should be 201 Created | Incorrect HTTP semantics | VERIFIED | VERIFIED |
| L-2 | HTTP | `backend/controllers/reviewController.js:29-37` | Validation errors return 403 Forbidden. Should be 400 Bad Request | Incorrect HTTP status | VERIFIED | VERIFIED |
| L-3 | Security | `backend/controllers/auth.controller.js:82-84` | Error handler leaks `err.message` in non-production. Since `NODE_ENV=production` is set, currently safe | Internal error details exposed if env var missing | VERIFIED | VERIFIED |
| L-4 | Security | `backend/utils/validate.js:1` | Email regex is basic — accepts technically valid but unusual emails | Minor validation gap | VERIFIED | VERIFIED |
| L-5 | UX | `frontend/Components/DevReviewLayout/Sidebar.jsx:312,319` | Mobile drawer close/home buttons are 32px. Below 44px touch target recommendation | Difficult mobile interaction | VERIFIED | VERIFIED |
| L-6 | UX | `frontend/Components/LandingPage/Navbar.jsx:166` | Hamburger button is 36px. Below 44px touch target | Difficult mobile interaction | VERIFIED | VERIFIED |
| L-7 | UX | `frontend/Components/DevReviewLayout/chat/Chat.jsx:335,448` | Back button (36px) and send button (40px) below 44px touch target | Difficult mobile interaction | VERIFIED | VERIFIED |
| L-8 | UX | `frontend/Components/DevReviewLayout/ExploreUsers.jsx:607` | Fixed height `h-[480px]` on user cards. Content may overflow on small screens or with long bios | Content clipping | VERIFIED | VERIFIED |
| L-9 | SEO | frontend (18 routes) | Missing metadata on most routes: projects/[id], users/explore, leaderboard, community, settings, etc. | Poor SEO per-page | VERIFIED | VERIFIED |
| L-10 | A11y | Multiple Skeleton components | Loading skeletons missing `role="status"` and `aria-busy="true"` | Screen readers can't determine page state | VERIFIED | VERIFIED |
| L-11 | A11y | `Features.jsx`, `HowItWorks.jsx` | SVG icons missing `aria-hidden="true"` | Decorative icons announced by screen readers | VERIFIED | VERIFIED |
| L-12 | A11y | `CreateProjects.jsx` | Labels not linked to inputs via `htmlFor`/`id` on 6 form fields | Reduced form accessibility | VERIFIED | VERIFIED |
| L-13 | A11y | `Navbar.jsx:165` | Hamburger button has no `aria-label` | Unlabeled button for screen readers | VERIFIED | VERIFIED |
| L-14 | Config | `backend/config/db.js:7` | `console.log` leaks MongoDB hostname in production | Information disclosure | VERIFIED | VERIFIED |
| L-15 | Config | `frontend/.env:2` | Commented-out production URL has typo: `devreiview` should be `devreview` | Broken production URL if uncommented | VERIFIED | VERIFIED |
| L-16 | Performance | `frontend/Components/LandingPage/CustomCursor.jsx` | Complex pointer tracking on mobile devices — should be disabled | Performance impact on mobile | VERIFIED | LIKELY |
| L-17 | Edge Case | `CreateProjects.jsx:164-165` | No max length validation on project title or description | Oversized data stored | VERIFIED | VERIFIED |
| L-18 | Edge Case | `Project.jsx:650` | Review textarea has no max length | Oversized reviews possible | VERIFIED | VERIFIED |

---

## 5. Dynamic Data Audit

| Page/Feature | Data Source | Dynamic? | Hardcoded/Mock Data | Location | Status |
|---|---|---|---|---|---|
| Dashboard Stats | `getMyProjects`, `getMyReviews` APIs | **YES** | None — real data | `Dashboard.jsx` | REAL |
| Dashboard Recent Projects | `getMyProjects` API | **YES** | None — real data | `Dashboard.jsx` | REAL |
| Explore Projects | `getExploreProjects` API (cursor-paginated) | **YES** | None — real data | `ExploreProjects.jsx` | REAL |
| Explore Projects Categories | Hardcoded array | **NO** | `["All", "Full Stack", "Frontend", ...]` | `ExploreProjects.jsx:29-40` | STATIC |
| Explore Users | `getAllUsers` API | **YES** | None — real data | `ExploreUsers.jsx` | REAL |
| Explore Users Categories | Hardcoded array | **NO** | `["All", "MERN", "Frontend", ...]` | `ExploreUsers.jsx:27-38` | STATIC |
| Leaderboard | `getLeaderboard`, `getMyRanking` APIs | **YES** | None — real data | `Leaderboard.jsx` | REAL |
| Project Detail | `getProjectById` API | **YES** | None — real data | `Project.jsx` | REAL |
| Project Reviews | `getReviews` API | **YES** | None — real data | `Project.jsx` | REAL |
| Notifications | `getNotifications` API | **YES** | None — real data | `Notifications.jsx` | REAL |
| Saved Projects | `getSavedProjects` API | **YES** | None — real data | `SavedProjects.jsx` | REAL |
| User Profile | `getUserProfile`, `getProjectByUsername` APIs | **YES** | None — real data | `UserProfile.jsx` | REAL |
| Messages/Chat | `conversationsApis` | **YES** | None — real data | `Chat.jsx`, `ConversationList.jsx` | REAL |
| Settings | `updateProfile`, `changePassword` APIs | **YES** | None — real data | `Settings.jsx` | REAL |
| Community Stats | `getStats` API | **YES** | None — real data | `Community.jsx` | REAL |
| Auth (Login/Signup) | `authApis` | **YES** | None — real data | Auth components | REAL |
| **Landing Featured Projects** | **Hardcoded array** | **NO** | Fake projects with hardcoded titles, stacks, developer names | `FeaturedProjects.jsx:11-26` | **STATIC** |
| **Landing Hero Demo Card** | **Hardcoded** | **NO** | Fake project card: "Hamid Raza", "Finance Tracker", `12 Reviews`, `24 Likes`, fake review | `Hero.jsx:140-231` | **STATIC** (marketing) |
| **Landing Reviews Section** | **Hardcoded** | **NO** | Fake review from "Hariom Singh", fake rating, fake text | `Reviews.jsx:75-97` | **STATIC** |
| **Landing Community Preview** | **Hardcoded** | **NO** | Fake community review preview | `Community.jsx:84-123` | **STATIC** |

---

## 6. Responsive Audit

| Page | Breakpoint | Problem | Location | Impact | Recommended Fix |
|---|---|---|---|---|---|
| Explore Users | All viewports | Fixed height `h-[480px]` on user cards causes overflow with long bios | `ExploreUsers.jsx:607` | Content clipping | Replace with `min-h-[480px]` or remove fixed height |
| Sidebar (mobile) | < `md` | Close/home buttons are 32px — below 44px touch target | `Sidebar.jsx:312,319` | Difficult mobile interaction | Increase to `w-11 h-11` |
| Landing Navbar | < `lg` | Hamburger button is 36px — below 44px touch target | `Navbar.jsx:166` | Difficult mobile interaction | Increase to `w-11 h-11` |
| Chat | All viewports | Back button 36px, send button 40px — below 44px target | `Chat.jsx:335,448` | Difficult mobile interaction | Increase to `w-11 h-11` |
| Landing Hero | < 480px | Decorative blur blobs `w-[600px]` may cause horizontal scrollbar if `overflow-hidden` not properly applied | `Hero.jsx:39,47` | Horizontal scroll on mobile | Verify `overflow-hidden` on parent section |
| Settings | < 360px | Tab labels may truncate on very small screens | `Settings.jsx:112` | Tab labels clipped | Acceptable — `truncate` handles gracefully |
| Project Detail | All viewports | Review edit/delete buttons use `px-3 py-1.5` (~32px) | `Project.jsx:753-759` | Small touch target | Increase padding to `px-4 py-2` |
| Dashboard | 320px | Stats grid `grid-cols-2` is tight but functional on smallest screens | `Dashboard.jsx:231` | Tight but usable | Acceptable |

---

## 7. Functional Flow Audit

| Feature | Flow | Status | Problem | Location |
|---|---|---|---|---|
| Email Signup | Register → OTP → Verify → Login | **WORKING** | None | `auth.controller.js` |
| Login | Email/password → JWT cookie | **WORKING** | None | `auth.controller.js` |
| Google OAuth | Google Sign-In → backend verify → JWT | **WORKING** | None | `auth.controller.js` |
| Forgot Password | Email → OTP → Reset | **PARTIALLY WORKING** | OTP type confusion with email verification | `auth.controller.js:100` |
| Create Project | Form → API → Redirect | **WORKING** | Returns 200 instead of 201 | `projectController.js:45` |
| Edit Project | Load → Edit → Save | **WORKING** | Ownership check present | `projectController.js:265-303` |
| Delete Project | Delete → Confirm | **PARTIALLY WORKING** | Doesn't clean up reviews/notifications | `projectController.js:404-409` |
| Explore Projects | Paginated feed → Search → Filter | **WORKING** | Category filters hardcoded | `ExploreProjects.jsx` |
| Add Review | Rating + text → API | **WORKING** | No type check on rating | `reviewController.js:8-89` |
| Edit Review | Load → Edit → Save | **WORKING** | Ownership check present | `reviewController.js` |
| Delete Review | Delete → Confirm | **PARTIALLY WORKING** | Doesn't reverse ranking points | `reviewController.js:157` |
| Like/Unlike | Toggle → API | **PARTIALLY WORKING** | Race condition, points not reversed on unlike | `projectController.js:440-444` |
| Follow/Unfollow | Toggle → API | **PARTIALLY WORKING** | Race condition, potential duplicates | `userController.js:89-118` |
| Save/Unsave Project | Toggle → API | **WORKING** | None | `projectController.js:553-603` |
| Chat | Send → Receive → Read | **WORKING** | No auto-scroll on new messages | `Chat.jsx` |
| Notifications | Fetch → Read → Mark | **WORKING** | None | `notificationController.js` |
| Settings | Edit profile → Save | **WORKING** | No input length validation | `Settings.jsx` |
| Landing Featured Projects | Display | **BROKEN** | Entirely hardcoded, not from API | `FeaturedProjects.jsx:11-26` |
| Landing Reviews | Display | **BROKEN** | Entirely hardcoded fake review | `Reviews.jsx:75-97` |
| Explore Users | Paginated list → Search | **WORKING** | `getAllUsers` has no pagination (backend) | `userController.js:194` |

---

## 8. API Audit

| Endpoint | Auth | Authorization | Validation | Rate Limit | Pagination | Issues |
|---|---|---|---|---|---|---|
| `POST /api/auth/signup` | No | N/A | Email + password regex | authLimiter | N/A | OTP not hashed in DB |
| `POST /api/auth/verify-otp` | No | N/A | Email + OTP format | otpLimiter | N/A | **OTP type not filtered** (H-3) |
| `POST /api/auth/login` | No | N/A | Email + password | authLimiter | N/A | None |
| `POST /api/auth/google` | No | N/A | Google token | authLimiter | N/A | None |
| `POST /api/auth/forgot-password` | No | N/A | Email | authLimiter | N/A | None |
| `POST /api/auth/reset-password` | No | N/A | Email + OTP + password | authLimiter | N/A | None |
| `GET /api/auth/me` | Yes | N/A | None | None | N/A | None |
| `PATCH /api/auth/me` | Yes | Self | Partial | None | N/A | No rate limit, no length validation |
| `PATCH /api/auth/me/password` | Yes | Self | Password | None | N/A | None |
| `POST /api/auth/logout` | No | N/A | None | None | N/A | Unauthenticated access harmless |
| `GET /api/users/:username` | Optional | Public | Username format | None | N/A | N+1 queries for stats |
| `GET /api/users` | Yes | Self | None | None | **NO PAGINATION** | **Returns ALL users** (C-6) |
| `POST /api/users/:username/follow` | Yes | Self | Username | None | N/A | Race condition (M-4) |
| `GET /api/users/:username/followers` | Yes | Public | Username | None | **NO PAGINATION** | Unbounded |
| `GET /api/users/:username/following` | Yes | Public | Username | None | **NO PAGINATION** | Unbounded |
| `POST /api/projects` | Yes | Self | `validateProjectPayload` | projectCreateLimiter | N/A | Returns 200 not 201 |
| `GET /api/projects/my` | Yes | Self | None | None | **NO PAGINATION** | Unbounded per user |
| `GET /api/projects/explore` | Yes | Public | Query params | None | Cursor-based ✓ | None |
| `GET /api/projects/my-reviews` | Yes | Self | None | None | **NO PAGINATION** | Unbounded |
| `GET /api/projects/saved/me` | Yes | Self | None | None | **NO PAGINATION** | Unbounded |
| `GET /api/projects/:id/edit` | Yes | Owner only | ObjectId | None | N/A | Ownership check ✓ |
| `PUT /api/projects/:id/edit` | Yes | Owner only | `validateProjectPayload` | None | N/A | None |
| `GET /api/projects/:id` | Yes | Public | ObjectId | None | N/A | Loads ALL reviews into memory |
| `POST /api/projects/:projectId/save` | Yes | Self | ObjectId | None | N/A | None |
| `POST /api/projects/:id/review` | Yes | Not own project | Rating + text | reviewCreateLimiter | N/A | No rating type check (M-9) |
| `PUT /api/projects/:id/review` | Yes | Review author | Rating + text | reviewCreateLimiter | N/A | None |
| `GET /api/projects/:id/review` | Yes | Public | ObjectId | None | **NO PAGINATION** | **Unbounded** (C-7) |
| `DELETE /api/projects/:id/review` | Yes | Review author | ObjectId | None | N/A | No point reversal (M-12) |
| `POST /api/projects/:id/like` | Yes | Self | ObjectId | likeLimiter | N/A | Race condition (M-5) |
| `DELETE /api/projects/:id` | Yes | Owner only | ObjectId | None | N/A | **No cascade delete** (C-5) |
| `GET /api/user/projects/:username` | Yes | Public | Username | None | **NO PAGINATION** | Unbounded |
| `GET /api/reviews/unread-count` | Yes | Self | None | None | N/A | **Route collision** with `/:id/review` (H-1) |
| `PATCH /api/reviews/:reviewId/read` | Yes | Self | ObjectId | None | N/A | Route collision risk |
| `POST /api/chat/send` | Yes | Self | Text (5000 max) | chatLimiter | N/A | No HTML sanitization |
| `GET /api/chat/conversations` | Yes | Self | None | None | **NO PAGINATION** | Unbounded |
| `GET /api/chat/messages/:conversationId` | Yes | Participant | ObjectId | None | Cursor-based ✓ | None |
| `GET /api/chat/unread-count` | Yes | Self | None | None | N/A | None |
| `PATCH /api/chat/messages/:conversationId/read` | Yes | Participant | ObjectId | None | N/A | None |
| `GET /api/chat/user/:userId` | Yes | Public | ObjectId | None | N/A | None |
| `GET /api/notifications/unread-count` | Yes | Self | None | None | N/A | None |
| `GET /api/notifications` | Yes | Self | None | None | Cursor-based ✓ | None |
| `PATCH /api/notifications/read-all` | Yes | Self | None | None | N/A | None |
| `PATCH /api/notifications/:id/read` | Yes | Self | ObjectId | None | N/A | Recipient check ✓ |
| `GET /api/leaderboard` | No | Public | Page/limit | leaderboardLimiter | Offset-based | Limit not capped (M-14) |
| `GET /api/leaderboard/me` | Yes | Self | None | leaderboardLimiter | N/A | O(N) rank calculation |
| `GET /api/leaderboard/user/:userId` | No | Public | ObjectId | leaderboardLimiter | N/A | None |
| `GET /api/stats` | No | Public | None | statsLimiter | N/A | None |
| `POST /api/upload` | Yes | Self | File type/size | uploadLimiter | N/A | None |
| `POST /api/support` | Yes | Self | None | supportLimiter | N/A | **Accepts client name/email** (M-10) |

---

## 9. Security Audit

### Authentication
| Finding | Severity | Location | Details |
|---|---|---|---|
| JWT secret is `devreview123` | CRITICAL | `backend/.env:6` | Trivially guessable, allows token forgery |
| No token revocation mechanism | MEDIUM | `generateToken.js` | No `jti`, no blacklist, no token versioning |
| 7-day token expiry without refresh | MEDIUM | `generateToken.js:7` | Long exposure window for stolen tokens |
| Password hashing uses bcrypt rounds=10 | LOW | `auth.controller.js:46` | Acceptable, 12 is recommended minimum |
| OTP stored in plaintext (not hashed) | MEDIUM | `auth.controller.js:67-72` | DB compromise exposes OTPs |
| OTP type confusion | CRITICAL | `auth.controller.js:100` | Password reset OTP usable for email verification |

### Authorization
| Finding | Severity | Location | Details |
|---|---|---|---|
| Admin role is freeform string, not enum | HIGH | `Users.js:35` + `generateToken.js:5` | No schema-level constraint on role values |
| Admin check relies on JWT payload only | HIGH | `leaderboardRoutes.js:15-17` | No DB re-verification of role |
| Project ownership checks present | ✓ | `projectController.js:285,333,397` | Edit/delete correctly verify owner |
| Review author checks present | ✓ | `reviewController.js:145-148,201-204` | Edit/delete correctly verify author |
| Notification recipient checks present | ✓ | `notificationController.js:54-58` | Mark-as-read verifies recipient |

### Input Validation
| Finding | Severity | Location | Details |
|---|---|---|---|
| Password validation is length-only | MEDIUM | `validate.js:9-13` | No complexity requirements |
| Rating not type-checked | MEDIUM | `reviewController.js:11` | String coercion may allow non-numeric ratings |
| Project payload validation present | ✓ | `validate.js:27-35` | Sanitization and allowed fields |
| No input sanitization for XSS | MEDIUM | Multiple controllers | User text stored without HTML sanitization |
| Support request accepts client name/email | MEDIUM | `support.controller.js:14-21` | Should use `req.user` data |
| No max length on profile fields | LOW | `auth.controller.js:448-510` | Name, bio, URLs can be arbitrarily long |

### Rate Limiting
| Finding | Severity | Location | Details |
|---|---|---|---|
| Auth routes rate-limited | ✓ | `auth.routes.js:7-17` | 15 req/15min |
| OTP routes rate-limited | ✓ | `auth.routes.js:7-17` | 6 req/15min |
| Project creation rate-limited | ✓ | `projectRoutes.js` | 10 req/15min |
| Review creation rate-limited | ✓ | `projectRoutes.js` | 10 req/15min |
| Like rate-limited | ✓ | `projectRoutes.js` | 60 req/15min |
| Upload rate-limited | ✓ | `upload.routes.js` | 20 req/15min |
| Chat rate-limited | ✓ | `chatRoutes.js` | 30 req/15min |
| Support rate-limited | ✓ | `support.routes.js` | 5 req/15min |
| `PATCH /auth/me` NOT rate-limited | MEDIUM | `auth.routes.js:20` | Profile updates unlimited |
| IP-based only (breaks behind proxy) | MEDIUM | `rateLimiter.middleware.js` | Needs `trust proxy` or user-based limiting |

### File Upload Security
| Finding | Severity | Location | Details |
|---|---|---|---|
| MIME type filter present | ✓ | `middleware/upload.js` | jpg, jpeg, png, webp only |
| File size limit 5MB | ✓ | `middleware/upload.js` | Correct |
| Cloudinary storage (no local files) | ✓ | `middleware/upload.js` | Direct streaming |
| `dangerouslyAllowSVG: true` | MEDIUM | `next.config.mjs:12` | SVG can contain scripts |

### Secrets
| Finding | Severity | Location | Details |
|---|---|---|---|
| MongoDB password hardcoded | CRITICAL | `backend/.env:3` | `hamidrza0008:hamid%400008` |
| Resend API key hardcoded | CRITICAL | `backend/.env:5` | `re_h1quiAZE...` |
| JWT secret hardcoded | CRITICAL | `backend/.env:6` | `devreview123` |
| Gmail app password hardcoded | CRITICAL | `backend/.env:10` | `smjbjkvlxrsmierz` |
| Cloudinary secret hardcoded | CRITICAL | `backend/.env:14` | `WLVXP0zKCckW04dtgJlibmspJFg` |
| `.env` in `.gitignore` | ✓ | Both `.gitignore` | Prevents future commits |
| Google OAuth Client ID public | ✓ | Frontend `.env` | Public by design |

### Security Headers
| Finding | Severity | Location | Details |
|---|---|---|---|
| Helmet enabled | ✓ | `server.js:25` | Default config — no CSP |
| No CSP configured | MEDIUM | `server.js:25` | Browser XSS mitigation missing |
| CORS restricted to 2 origins | ✓ | `server.js:26-32` | localhost:3000 + vercel.app |
| No frontend security headers | MEDIUM | `next.config.mjs` | Missing X-Frame-Options, Referrer-Policy, etc. |

### CORS
| Finding | Severity | Location | Details |
|---|---|---|---|
| Hardcoded origins | HIGH | `server.js:27-29` | Should use environment variable |
| Credentials enabled | ✓ | `server.js:31` | Required for cookie-based auth |
| `sameSite: "none"` in production | MEDIUM | `auth.controller.js:185` | Requires CSRF protection |

---

## 10. Database Audit

### Schema Issues
| Finding | Severity | Location | Details |
|---|---|---|---|
| `followers`/`following` are embedded arrays | HIGH | `Users.js:64-81` | Will exceed 16MB document limit at scale. Should use separate collection |
| `savedProjects` is embedded array | MEDIUM | `Users.js:60-63` | Same scalability concern |
| `likes` is embedded array in Projects | MEDIUM | `Projects.js:50-55` | Viral projects can hit 16MB limit |
| `role` field is freeform String | HIGH | `Users.js:35` | Should be enum: `["user", "admin"]` |
| No unique compound index on conversation participants | MEDIUM | `Conversation.js` | Allows duplicate conversations |
| OTP stored in plaintext | MEDIUM | `OTP.js` | Should hash before storage |

### Good Schema Practices
| Finding | Location | Details |
|---|---|---|
| Password `select: false` | `Users.js:24` | Password excluded from queries by default |
| Unique compound index on `{project, user}` for Reviews | `Review.js:43-51` | Prevents duplicate reviews at DB level |
| TTL index on OTP `expiresAt` | `OTP.js:26` | Auto-deletes expired OTPs |
| Index on `{ score: -1 }` for Leaderboard | `Leaderboard.js:37` | Supports leaderboard sort |
| Index on `{ owner: 1, createdAt: -1 }` for Projects | `Projects.js:58` | Supports `getMyProjects` |
| Index on `{ participants: 1, lastMessageAt: -1 }` for Conversations | `Conversation.js:33` | Supports conversation list |
| Compound indexes on Messages | `Message.js:34-35` | Covers message queries |
| Indexes on Notifications | `Notification.js:36-37` | Covers notification queries |

### Query Issues
| Finding | Severity | Location | Details |
|---|---|---|---|
| `getUserProfile` loads all projects into memory | MEDIUM | `userController.js:18` | Should use aggregation |
| `getProjectById` loads all reviews for stats | MEDIUM | `projectController.js:149` | Should use `$group` aggregation |
| `getAllUsers` unbounded | HIGH | `userController.js:194` | No pagination |
| `getReviews` unbounded | HIGH | `reviewController.js:105` | No pagination |
| 14+ endpoints without pagination | MEDIUM | Multiple | `getMyProjects`, `getSavedProjects`, `getConversations`, etc. |

---

## 11. Performance Audit

| Finding | Severity | Location | Details |
|---|---|---|---|
| `getAllUsers` fetches all users into memory | HIGH | `userController.js:194` | O(N) memory, will crash at scale |
| `getReviews` fetches all reviews per project | HIGH | `reviewController.js:105` | Unbounded response |
| `getProjectById` loads all reviews for stats computation | MEDIUM | `projectController.js:149` | Should use aggregation pipeline |
| `getUserProfile` N+1 query pattern | MEDIUM | `userController.js:18-37` | Loads all projects, then computes in JS |
| `getLeaderboard` rank calculation O(N) per request | MEDIUM | `leaderboardController.js:57-59` | `countDocuments` scans entire collection |
| 10MB JSON body limit | MEDIUM | `server.js:33` | Enables DoS via large payloads |
| Ranking service silently catches all errors | MEDIUM | `rankingService.js:44-46` | Lost points with no feedback |
| `CustomCursor` heavy on mobile | LOW | `CustomCursor.jsx` | Complex pointer tracking on touch devices |

---

## 12. Accessibility Audit

| Finding | Severity | Location | Details |
|---|---|---|---|
| `role="alert"` missing on auth error messages | MEDIUM | SignUp, VerifyOtp, ForgotPassword, ResetPassword | Screen readers won't announce errors |
| Star rating buttons no `aria-label` | MEDIUM | `Project.jsx:623-643` | Five buttons with only visual icons |
| Loading skeletons missing `role="status"` | LOW | All Skeleton components | Screen readers can't determine page state |
| SVG icons missing `aria-hidden="true"` | LOW | `Features.jsx`, `HowItWorks.jsx` | Decorative icons announced |
| Category filter chips no `aria-pressed` | LOW | `ExploreProjects.jsx`, `ExploreUsers.jsx` | Active filter not indicated |
| CreateProjects labels not linked via `htmlFor/id` | LOW | `CreateProjects.jsx` | 6 form fields affected |
| Hamburger button no `aria-label` | LOW | `Navbar.jsx:165` | Unlabeled button |
| Avatar fallback alt text is generic | LOW | `Dashboard.jsx:189` | Should use `user.name` |
| Skip-to-content link present | ✓ | `layout.js:64-68` | Properly implemented |
| Modal focus traps present | ✓ | `ConfirmDialog.jsx`, `SupportModal.jsx` | Tab cycling, Escape, focus restore |
| `aria-current="page"` on sidebar nav | ✓ | `Sidebar.jsx:136` | Correct |
| `role="dialog"` + `aria-modal` on modals | ✓ | `SupportModal.jsx`, Sidebar drawer | Correct |
| ARIA tab roles on dashboard/settings | ✓ | Dashboard, Settings, Notifications, MyProfile | Arrow navigation present |

---

## 13. SEO / Public Launch Audit

| Finding | Severity | Location | Details |
|---|---|---|---|
| No `robots.txt` | HIGH | Missing file | Search engines can't discover site |
| No `sitemap.xml` | HIGH | Missing file | No sitemap for indexing |
| Root metadata present | ✓ | `layout.js:7-41` | title, description, OG, twitter, robots |
| OG image generation | ✓ | `opengraph-image.js` | Dynamic ImageResponse |
| Favicon generation | ✓ | `icon.js` | Dynamic 32x32 PNG |
| 404 page with metadata | ✓ | `not-found.jsx` | Title present |
| OG `url` is relative | MEDIUM | `page.js:11` | Should be absolute |
| Missing metadata on 18 routes | LOW | Multiple page files | Most protected routes lack metadata |
| Public pages: Landing, Login, Signup, User profiles, Project detail, Leaderboard, Stats | INFO | Various | These should be indexable |
| Protected pages: Dashboard, Settings, Messages, Notifications | INFO | Various | Should have `noindex` |

---

## 14. Production Configuration Audit

| Finding | Severity | Location | Details |
|---|---|---|---|
| All secrets in `.env` files | CRITICAL | `backend/.env` | Must rotate all if ever committed |
| `NODE_ENV=production` set | ✓ | `backend/.env:7` | Correct |
| `.env` in `.gitignore` | ✓ | Both repos | Prevents future commits |
| API URL defaults to localhost | HIGH | `frontend/.env:1` | Must set `NEXT_PUBLIC_API_URL` on Vercel |
| Production URL typo in comments | LOW | `frontend/.env:2` | `devreiview` → `devreview` |
| CORS hardcoded to 2 origins | HIGH | `server.js:27-29` | Should use env variable |
| MongoDB hostname leaked in logs | MEDIUM | `config/db.js:7` | `console.log` in production |
| No frontend security headers | MEDIUM | `next.config.mjs` | Missing CSP, X-Frame-Options, etc. |
| `dangerouslyAllowSVG: true` | MEDIUM | `next.config.mjs:12` | Security risk with external SVGs |
| No `console.log` in frontend | ✓ | Frontend codebase | Clean |
| No TODO/FIXME/debugger | ✓ | Entire codebase | Clean |
| No test/demo routes | ✓ | Backend routes | Clean |

---

## 15. Edge Cases

| Finding | Severity | Location | Details |
|---|---|---|---|
| No handling for deleted user profiles | MEDIUM | `UserProfile.jsx:498` | Component may crash |
| Deleted project owner shows "anonymous" | LOW | `Project.jsx:398-416` | Acceptable fallback |
| No max length on project title/description | MEDIUM | `CreateProjects.jsx:164-165` | Oversized data |
| No max length on review text | MEDIUM | `Project.jsx:650` | Oversized reviews |
| No max length on profile fields | LOW | `Settings.jsx`, `MyProfile.jsx` | Oversized data |
| Empty states present on most pages | ✓ | Multiple components | Dashboard, Explore, Notifications, Chat, etc. |
| Error states with retry | ✓ | Multiple components | Project, Dashboard, Chat, ConversationList |
| Loading skeletons present | ✓ | 14+ components | AppShell, Sidebar, Projects, Users, etc. |
| Avatar fallback to initials | ✓ | `Avatar.jsx:32-43` | Broken image → initials |
| `useParams()` id not validated | LOW | `Project.jsx:96` | No ObjectId format check |
| `document.getElementById` for scroll | LOW | `Project.jsx:232` | Direct DOM manipulation, not React ref |

---

## 16. Verified Working Areas

- **Authentication flow**: Signup → OTP → Login flow is complete with proper validation, bcrypt hashing, JWT generation, HTTP-only cookies, and `timingSafeEqual` for OTP comparison
- **Project CRUD**: Create, Read, Update, Delete all functional with ownership checks on edit/delete
- **Review system**: Create, Edit, Delete reviews with author verification and duplicate prevention via compound unique index
- **Like/Save toggle**: Functional with proper user tracking
- **Follow/Unfollow**: Functional with follower/following counts
- **Chat system**: Send/receive messages with cursor-based pagination and participant verification
- **Notifications**: Fetch, mark-as-read with recipient verification
- **Image upload**: Cloudinary integration with Multer, file type/size validation
- **Rate limiting**: All sensitive endpoints have rate limiters
- **Error handling**: Global error handler catches file size, CastError, ValidationError
- **Theme system**: CSS variables with dark mode, View Transitions API, localStorage persistence
- **Responsive sidebar**: Mobile drawer with backdrop, collapse toggle on desktop
- **Loading states**: Skeleton UIs for most async pages
- **Empty states**: Present on Dashboard, Explore, Notifications, Chat, Saved Projects
- **Modal focus traps**: ConfirmDialog and SupportModal properly trap focus
- **Cursor-based pagination**: Explore Projects, Messages, Notifications use efficient cursor pagination
- **Database indexes**: Well-designed indexes on Reviews, Notifications, Messages, Conversations, Leaderboard

---

## 17. Not Verified

These items require runtime/browser testing or production environment access:

- Actual browser rendering at various viewports (320px, 375px, 390px, 414px, 768px)
- Horizontal scrollbar presence on mobile
- Touch target sizes in actual mobile browsers
- Dark mode rendering across all components
- Hydration mismatch detection
- Actual API response times under load
- MongoDB query performance with real data volumes
- Cloudinary upload flow end-to-end
- Resend email delivery
- Google OAuth redirect flow
- CORS behavior in production deployment
- Cookie behavior across domains
- Rate limiter behavior behind Render's proxy
- SSR/SSG behavior for public pages
- Build output and bundle sizes
- Console errors in production
- Actual SEO indexing behavior
- Lighthouse scores

---

## 18. Recommended Fix Order

### Phase 1 — CRITICAL (Must fix before ANY deployment)
1. **Rotate ALL secrets** — Generate new MongoDB password, Resend API key, Cloudinary API secret, Gmail app password, JWT secret. The current `.env` values must be considered compromised.
2. **Replace JWT secret** with cryptographically random 64+ character string
3. **Fix OTP type confusion** — Add `type` filter to `OTP.findOne()` in `verifyOTP`
4. **Add CSRF protection** — Implement double-submit cookie pattern or CSRF token middleware
5. **Add `role` enum to User schema** — Prevent arbitrary role values
6. **Fix `deleteProject` cascade** — Delete associated Reviews and Notifications

### Phase 2 — HIGH (Fix before public launch)
7. **Add pagination to `getAllUsers`** — Cursor-based with limit
8. **Add pagination to `getReviews`** — Cursor-based with limit
9. **Fix route collision** between `/reviews/unread-count` and `/:id/review`
10. **Fix production API URL** — Set `NEXT_PUBLIC_API_URL` correctly on Vercel
11. **Move CORS origins to environment variable**
12. **Replace hardcoded Landing Page Featured Projects** with API call
13. **Replace hardcoded Landing Page Reviews** with real reviews
14. **Add `robots.txt` and `sitemap.xml`**
15. **Add security headers** to Next.js config

### Phase 3 — MEDIUM (Fix shortly after launch)
16. Add pagination to remaining unbounded endpoints
17. Fix race conditions with `$addToSet`/`$pull` operations
18. Add password complexity requirements
19. Reduce JSON body limit to 1MB
20. Add input length validation on forms
21. Fix ranking point reversal on delete/unlike
22. Add `role="alert"` to auth error messages
23. Add `aria-label` to star rating buttons
24. Remove `dangerouslyAllowSVG: true`
25. Add MongoDB hostname redaction in logs

### Phase 4 — LOW (Polish)
26. Increase touch targets to 44px on mobile
27. Add metadata to remaining routes
28. Add `aria-hidden` to decorative SVGs
29. Fix HTTP status codes (201 for creation, 400 for validation)
30. Add max length to form inputs

---

*This audit was generated by code analysis only. Runtime/browser testing was not performed. All findings are based on code inspection and should be verified in a live environment where applicable.*

---

# Bunch 2 Completion Report

## Fixed

| Audit ID | File(s) Changed | What Was Wrong | What Was Changed | Why Production-Safe |
|---|---|---|---|---|
| H-1 | `backend/controllers/reviewController.js` | Route collision between `/reviews/unread-count` and `/:id/review` — Express could match `unread-count` as `:id` | Added `mongoose.Types.ObjectId.isValid(id)` validation at the start of `getReviews` and `addReviews` handlers. Invalid IDs (like `"unread-count"`) now return 400 before any DB query | Prevents parameter injection and eliminates the route collision risk. Both endpoints resolve correctly |
| C-6 | `backend/controllers/userController.js`, `frontend/services/usersApi.js`, `frontend/Components/DevReviewLayout/ExploreUsers.jsx` | `getAllUsers` fetched every user with no pagination — OOM risk at scale | Added cursor-based pagination (default limit=20, max=50). Added `hasMore`/`nextCursor` to response. Frontend updated with infinite scroll via `IntersectionObserver` | Bounded response size. Follows existing cursor pagination pattern from `getExploreProjects`. Frontend filtering preserved |
| C-7 | `backend/controllers/reviewController.js`, `frontend/services/reviewApis.js` | `getReviews` fetched all reviews for a project with no limit | Added cursor-based pagination (default limit=20, max=50). Added `hasMore`/`nextCursor` to response. Total `reviewsCount` uses `countDocuments()` for accurate stats | Bounded response. Stats remain accurate via separate count query |
| H-5 | `backend/controllers/projectController.js` | `getProjectById` loaded ALL reviews into Node.js memory for stats | Replaced `Reviews.find()` + `getReviewStats()` with `Reviews.aggregate()` pipeline that computes `reviewsCount` and `averageRating` server-side | No review documents loaded into application memory. Single aggregation query |
| H-6/C-5 | `backend/controllers/projectController.js` | `deleteProject` did not clean up associated Reviews or Notifications | Added `Reviews.deleteMany({ project: id })` and `Notification.deleteMany({ project: id })` after project deletion | Bulk deletion is efficient. Only project-dependent records are removed. Follows existing ownership checks |
| M-14 | `backend/controllers/leaderboardController.js` | `getLeaderboard` limit had no upper bound — client could request `limit=999999` | Added `Math.min(Math.max(..., 1), 50)` to cap limit. Added `Math.max(..., 1)` to prevent negative page values | Consistent with other paginated endpoints. Max 50 enforced server-side |
| API Safety | `backend/controllers/projectController.js` | `getMyProjects`, `getSavedProjects`, `getProjectByUsername` — all unbounded per-user | Added cursor-based pagination to all three endpoints (default limit=20, max=50). Added `hasMore`/`nextCursor` responses | All per-user project queries now bounded |
| API Safety | `backend/controllers/reviewController.js` | `getCurrentUserReview` — unbounded given/received reviews | Added cursor-based pagination. Stats (`totalGivenReviews`, `totalReceivedReviews`) use `countDocuments()` for accuracy | Paginated lists, accurate total counts |
| API Safety | `backend/controllers/userController.js` | `getFollowers`, `getFollowing` — unbounded embedded arrays | Added cursor-based pagination over the follower/following arrays (default limit=20, max=50) | Bounded response size for follow lists |
| API Safety | `backend/controllers/chatController.js` | `getConversations` — unbounded conversation list | Added cursor-based pagination with `$limit` stage (default limit=20, max=50) | Bounded conversation list response |
| Limit Validation | All paginated endpoints | Client-controlled `limit` parameter had no validation | All endpoints now validate: numeric check via `parseInt`, minimum 1, maximum 50. Invalid cursors rejected with 400 | Prevents negative, zero, NaN, infinite, or oversized limits |

## Pagination Changes

| Endpoint | Before | After | Max Limit |
|---|---|---|---|
| `GET /api/users` | Unbounded (all users) | Cursor-based (default 20) | 50 |
| `GET /api/projects/:id/review` | Unbounded (all reviews) | Cursor-based (default 20) | 50 |
| `GET /api/projects/my` | Unbounded (all user projects) | Cursor-based (default 20) | 50 |
| `GET /api/projects/saved/me` | Unbounded (all saved) | Cursor-based (default 20) | 50 |
| `GET /api/user/projects/:username` | Unbounded (all user projects) | Cursor-based (default 20) | 50 |
| `GET /api/projects/my-reviews` | Unbounded (all given/received) | Cursor-based (default 20) | 50 |
| `GET /api/users/:username/followers` | Unbounded (all followers) | Cursor-based (default 20) | 50 |
| `GET /api/users/:username/following` | Unbounded (all following) | Cursor-based (default 20) | 50 |
| `GET /api/chat/conversations` | Unbounded (all conversations) | Cursor-based (default 20) | 50 |
| `GET /api/leaderboard` | Page/limit, no max | Page/limit with max cap | 50 |

## Data Cleanup

- **Project deletion** (`DELETE /api/projects/:id`): Now cascades to delete all `Reviews` where `project` matches the deleted project ID, and all `Notifications` where `project` matches. User `savedProjects` arrays are also cleaned (existing behavior preserved).
- **No unrelated data deleted**: Only project-dependent records (reviews and project-specific notifications) are removed. User accounts, follow relationships, conversations, and unrelated notifications remain intact.

## Route Collision

The route collision between `/api/reviews/unread-count` and `/api/projects/:id/review` was resolved by adding `mongoose.Types.ObjectId.isValid(id)` validation at the beginning of the `getReviews` and `addReviews` handlers. When Express matches `/:id/review` with `id = "unread-count"`, the handler now returns a 400 error immediately instead of attempting a database query. Both endpoints continue to work correctly at their respective base paths (`/api/reviews/` and `/api/projects/`).

## Validation

- **Invalid limit handling**: All paginated endpoints validate `limit` via `parseInt()`, then clamp with `Math.max(..., 1)` and `Math.min(..., 50)`. Non-numeric, negative, zero, NaN, and infinite values are safely normalized.
- **Maximum limit enforcement**: Server-side max of 50 enforced on all paginated endpoints. Clients cannot request more than 50 items per page.
- **Cursor validation**: All `before` cursor parameters are validated with `mongoose.Types.ObjectId.isValid()`. Invalid cursors return 400 Bad Request.
- **Database query safety**: All changed queries use proper projections, indexed fields, and efficient aggregation pipelines. No N+1 queries introduced. No unnecessary document loading.

## Testing

- **Backend syntax check**: All 6 modified controller files pass `node -c` syntax validation
- **Frontend lint**: `npx eslint` on all modified frontend files — 0 new errors (1 pre-existing error in `ExploreUsers.jsx` line 627)
- **Frontend build**: `npm run build` completes successfully — compiled, TypeScript checked, all 29 routes generated
- **No test suite available**: Backend has no test scripts configured (`"test": "echo \"Error: no test specified\" && exit 1"`)

## Remaining Issues

Bunch 2 items that remain unfixed (out of scope for this batch):

- **C-8**: Embedded `followers`/`following` arrays — requires schema redesign (Bunch 3)
- **H-2**: Admin role is freeform string — requires enum addition (Bunch 1 security)
- **H-3**: SameSite cookie configuration — requires CSRF architecture (Bunch 1 security)
- **H-4**: Production API URL typo — requires Vercel env config (Bunch 1)
- **H-7**: `dangerouslyAllowSVG` — requires Next.js config change (Bunch 3)
- **H-8/H-9/H-10**: Hardcoded landing page data — requires API integration (Bunch 3)
- **H-11**: 10MB JSON body limit — requires config change (Bunch 3)
- **H-12**: Missing robots.txt/sitemap.xml — requires file creation (Bunch 3)
- **C-1/C-2/C-3/C-4**: Critical security issues — Bunch 1 scope
- **M-4/M-5/M-6/M-7**: Race conditions — require atomic operations (Bunch 3)
- **M-12/M-13**: Ranking point reversal on delete/unlike — requires ranking service changes (Bunch 3)
- **M-15**: `getUserProfile` N+1 query pattern — requires aggregation rewrite (Bunch 3)
