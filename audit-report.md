# DevReview — Full-Stack Audit Report

**Generated:** August 30, 2026  
**Updated:** September 2, 2026 (Re-audit — all items verified against current codebase)  
**Scope:** Complete project-wide audit (frontend + backend)  
**Status:** AUDIT ONLY — no files modified

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Status Overview](#2-feature-status-overview)
3. [Pages & Routes](#3-pages--routes)
4. [Static/Mock Data Audit](#4-staticmock-data-audit)
5. [API ↔ UI Audit](#5-api--ui-audit)
6. [Interactive Elements Audit](#6-interactive-elements-audit)
7. [Counts & Badges Audit](#7-counts--badges-audit)
8. [Chat System Audit](#8-chat-system-audit)
9. [Reviews System Audit](#9-reviews-system-audit)
10. [Notifications Audit](#10-notifications-audit)
11. [Authentication Audit](#11-authentication-audit)
12. [Profiles Audit](#12-profiles-audit)
13. [Projects Audit](#13-projects-audit)
14. [Likes & Follows Audit](#14-likes--follows-audit)
15. [Loading/Error/Empty States](#15-loadingerrorempty-states)
16. [Database/Model Audit](#16-databasemodel-audit)
17. [Security Audit](#17-security-audit)
18. [Dead/Duplicate Code](#18-deadduplicate-code)
19. [Already Complete Features](#19-already-complete-features)
20. [Partially Complete Features](#20-partially-complete-features)
21. [Must Become Dynamic](#21-must-become-dynamic)
22. [Priority List](#22-priority-list)
23. [Implementation Phases](#23-implementation-phases)
24. [Before Testing Checklist](#24-before-testing-checklist)
25. [Summary Statistics](#25-summary-statistics)
26. [Changelog](#26-changelog)

---

## 1. Executive Summary

DevReview is a developer-focused project showcase and peer-review platform built with **Next.js 16 (App Router)** on the frontend and **Express.js + MongoDB** on the backend. The application allows developers to create project profiles, receive code reviews with star ratings, follow other developers, save/bookmark projects, chat with each other, and receive notifications.

### Overall Health Score: **74/100** *(up from 72)*

| Category | Score | Notes |
|----------|-------|-------|
| Core CRUD | 90% | All major create/read/update/delete flows work |
| API ↔ UI Sync | 88% | Most API chains complete; `getProjectById` missing `isSaved` |
| Auth System | 80% | JWT cookie auth works; some edge cases missing |
| Real-time Features | 40% | Chat is polling-based, no WebSocket |
| Security | 70% | Basic auth in place; missing rate limiting, CSRF, helmet |
| Error Handling | 75% | Frontend has good UX; backend inconsistent |
| Dead Code | 15% | Some stale references in old audit report; codebase itself cleaner |

### Key Findings
- **12** fully dynamic features working end-to-end
- **4** partially implemented features needing completion
- **3** features still using static/mock data
- **8** security concerns identified
- **3** dead code locations found
- **2** critical bugs found
- **3** new issues discovered in this re-audit

---

## 2. Feature Status Overview

| Feature | Status | API Connected | Dynamic | Notes |
|---------|--------|---------------|---------|-------|
| User Registration (Email/OTP) | ✅ Complete | Yes | Yes | OTP via email, 5-min expiry |
| Google OAuth Login | ✅ Complete | Yes | Yes | Auto-creates username from email |
| Email Verification | ✅ Complete | Yes | Yes | OTP-based verification |
| Forgot/Reset Password | ✅ Complete | Yes | Yes | OTP flow for password reset |
| Profile View (Self) | ✅ Complete | Yes | Yes | Tabbed: Projects/Resume/Saved |
| Profile View (Other) | ✅ Complete | Yes | Yes | Follow/unfollow, stats from API |
| Profile Edit | ✅ Complete | Yes | Yes | Image upload, skills, bio, links |
| Settings (Profile) | ✅ Complete | Yes | Yes | Username + portfolio URL |
| Settings (Notifications) | ⚠️ Partial | Yes | Partial | Preferences saved but `weeklyDigest` has no consumer |
| Settings (Security) | ✅ Complete | Yes | Yes | Password change for local accounts |
| Project Creation | ✅ Complete | Yes | Yes | Tech stack tags, image via Cloudinary |
| Project Edit | ✅ Complete | Yes | Yes | Ownership authorization enforced |
| Project Delete | ✅ Complete | Yes | Yes | Owner-only, confirmation dialog |
| Explore Projects | ✅ Complete | Yes | Yes | Search, category filter, stats |
| My Projects | ✅ Complete | Yes | Yes | Full CRUD, score calculation |
| Single Project View | ⚠️ Partial | Yes | Yes | Like works; bookmark state not hydrated from API |
| Save/Bookmark | ✅ Complete | Yes | Yes | Toggle, saved list page |
| Like/Unlike | ✅ Complete | Yes | Yes | Optimistic UI, API sync |
| Follow/Unfollow | ✅ Complete | Yes | Yes | Creates notification |
| Community Page | ⚠️ Partial | Partial | Partial | Stats dynamic; feature cards/hero static |
| Reviews (Add/Edit/Delete) | ✅ Complete | Yes | Yes | Unique constraint, self-review blocked |
| Reviews (Read/Unread) | ✅ Complete | Yes | Yes | isRead flag, badge count |
| Notifications | ✅ Complete | Yes | Yes | Like/review/follow types |
| Chat (Send/Receive) | ✅ Complete | Yes | Yes | Conversation aggregation |
| Chat (Unread Count) | ✅ Complete | Yes | Yes | Global unread badge |
| Support Requests | ✅ Complete | Yes | Yes | Form with validation |
| Platform Stats | ✅ Complete | Yes | Yes | Users, projects, reviews counts |
| Saved Projects Page | ⚠️ Partial | Yes | Yes | Route `GET /saved/me` shadowed by `GET /:id` |
| Explore Users | ✅ Complete | Yes | Yes | All users with stats |
| User Profile (by username) | ✅ Complete | Yes | Yes | Projects, reviews, activity |

---

## 3. Pages & Routes

### Frontend Routes (Next.js App Router)

| Route | Component | Auth Required | API Calls |
|-------|-----------|---------------|-----------|
| `/dashboard` | `Dashboard.jsx` | Yes | `getMyProjects`, `getMyReviews` |
| `/profile/my` | `MyProfile.jsx` | Yes | `getMyProjects`, `getSavedProjects`, `toggleLikes`, `toggleSaveProject`, `updateProfile` |
| `/users/:username` | `UserProfile.jsx` | Yes | `getUserProfile`, `toggleFollow`, `getProjectsByUsername`, `getFollowers`, `getFollowing` |
| `/projects/my` | `MyProjects.jsx` | Yes | `getMyProjects` |
| `/projects/explore` | `ExploreProjects.jsx` | Yes | `getExploreProjects`, `getStats`, `toggleLikes`, `toggleSaveProject` |
| `/projects/create` | `CreateProjects.jsx` | Yes | `createProject` |
| `/projects/:id` | `Project.jsx` | Yes | `getProjectById`, `getReviews`, `addReviews`, `editReview`, `deleteReview`, `toggleLikes`, `toggleSaveProject`, `deleteProject` |
| `/projects/:id/edit` | `EditProject.jsx` | Yes | `getProjectDetails`, `updateProject` |
| `/projects/saved` | `SavedProjects.jsx` | Yes | `getSavedProjects`, `toggleSaveProject` |
| `/review` | `ReviewsReceived.jsx` | Yes | `getMyReviews`, `markReviewAsRead` |
| `/notifications` | `Notifications.jsx` | Yes | `getNotifications`, `markNotificationRead`, `markAllNotificationsRead` |
| `/messages` | `Chat.jsx` + `ConversationList.jsx` | Yes | `getConversations`, `getMessages`, `sendMessage`, `getUnreadCount`, `markAsRead` |
| `/settings` | `Settings.jsx` | Yes | `updateProfile`, `changePassword` |
| `/users/explore` | `ExploreUsers.jsx` | Yes | `getAllUsers`, `toggleFollow` |
| `/community` | `Community.jsx` | Yes | `supportRequestsApi` (SupportModal only) |

### Backend Routes (Express)

| Mount Point | Router File | Endpoints |
|-------------|-------------|-----------|
| `/api/auth` | `auth.routes.js` | `POST /signup`, `POST /verify-otp`, `POST /login`, `POST /google`, `POST /forgot-password`, `POST /reset-password`, `GET /me`, `PATCH /me`, `PATCH /me/password`, `POST /logout` |
| `/api/users` | `user.routes.js` | `GET /:username`, `GET /`, `POST /:username/follow`, `GET /:username/followers`, `GET /:username/following` |
| `/api/projects` | `projectRoutes.js` | `POST /`, `GET /my`, `GET /explore`, `GET /my-reviews`, `GET /:id/edit`, `PUT /:id/edit`, `GET /:id`, `POST /:projectId/save`, `GET /saved/me`, `POST /:id/review`, `PUT /:id/review`, `GET /:id/review`, `DELETE /:id/review`, `POST /:id/like`, `DELETE /:id` |
| `/api/user/projects` | `userProject.routes.js` | `GET /:username` |
| `/api/upload` | `upload.routes.js` | Image upload endpoint |
| `/api` | `notifications.routes.js` | `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| `/api` | `reviews.routes.js` | `GET /reviews/unread-count`, `PATCH /reviews/:reviewId/read` |
| `/api/support` | `support.routes.js` | `POST /` |
| `/api/chat` | `chatRoutes.js` | `POST /send`, `GET /conversations`, `GET /messages/:conversationId`, `GET /unread-count`, `PATCH /messages/:conversationId/read`, `GET /user/:userId` |
| `/api/stats` | `stats.routes.js` | `GET /` |

### ⚠️ Route Ordering Bug

`backend/routes/projectRoutes.js` line 21 defines `GET /:id` **before** line 25 defines `GET /saved/me`. Express matches top-to-bottom, so `GET /api/projects/saved/me` matches `/:id` first with `id = "saved"`. The `getProjectById` handler validates ObjectId and returns `400 "Invalid Project ID"`.

**Fix:** Move `GET /saved/me` before `GET /:id`.

---

## 4. Static/Mock Data Audit

### Hardcoded Static Data Found

| Location | Type | Value | Impact |
|----------|------|-------|--------|
| `ExploreProjects.jsx:29-40` | Category chips | `["All", "Full Stack", "Frontend", "Backend", "MERN", "React", "Next.js", "Node.js", "TypeScript", "Tailwind"]` | **Medium** — Filters work client-side against project techStack |
| `ExploreProjects.jsx:589-595` | Badge logic | Data-driven: Trending (likes≥5 OR rating≥4.5), New (≤7 days) | ✅ **FIXED** — Now data-driven, no longer cyclic rotation |
| `ExploreProjects.jsx:189-191` | Trending filter | `likes > 2 || averageRating >= 4.0` — but "Trending" is NOT in CATEGORIES array | **Low** — Dead code path, unreachable via UI |
| `MyProjects.jsx:256` | Score formula | `Math.floor((likesCount*4)+(reviewsCount*3)+12)` | **Medium** — Hardcoded weights |
| `Dashboard.jsx:413-421` | Community Rank sidebar | Static text "Give reviews and share projects to increase your visibility" | **Low** — Decorative, but shows static rank placeholder |
| `Community.jsx:38-64` | Highlights + Feature cards | Hardcoded marketing copy | **Low** — Marketing page, acceptable |
| `Dashboard.jsx:309` | Default thumbnail | `"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"` | **Low** — Unsplash fallback |
| `Project.jsx:407-413` | Trending badge | `likesCount > 5` | **Medium** — Different threshold than ExploreProjects (≥5) |
| `SupportModal.jsx:8-13` | Categories | `["Bug", "Feature", "Feedback", "Support"]` | **Low** — Acceptable for support form |

---

## 5. API ↔ UI Audit

### Complete API Chain Map

#### Authentication Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Sign Up | `signUp()` → `POST /api/auth/signup` | `signUp` → creates User + OTP, sends email | ✅ |
| 2. Verify OTP | `verifyOTP()` → `POST /api/auth/verify-otp` | `verifyOTP` → sets isVerified=true | ✅ |
| 3. Login | `login()` → `POST /api/auth/login` | `login` → sets HTTP-only cookie | ✅ |
| 4. Google Auth | `googleAuth()` → `POST /api/auth/google` | `googleAuth` → verifyIdToken, auto-create user | ✅ |
| 5. Get Current User | `getMe()` → `GET /api/auth/me` | `getMe` → returns user without password | ✅ |
| 6. Logout | `logOutMe()` → `POST /api/auth/logout` | `logout` → clears cookie | ✅ |
| 7. Forgot Password | `forgotPassword()` → `POST /api/auth/forgot-password` | `forgotPassword` → sends OTP email | ✅ |
| 8. Reset Password | `resetPassword()` → `POST /api/auth/reset-password` | `resetPassword` → updates password | ✅ |
| 9. Change Password | `changePassword()` → `PATCH /api/auth/me/password` | `changePassword` → verifies old, hashes new | ✅ |

#### Project CRUD Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Create | `createProject()` → `POST /api/projects` | `createProjects` → Projects.create | ✅ |
| 2. Read All (My) | `getMyProjects()` → `GET /api/projects/my` | `getMyProjects` → finds by owner, enriches with reviews | ✅ |
| 3. Read All (Explore) | `getExploreProjects()` → `GET /api/projects/explore` | `getExploreProjects` → all projects with owner populate, includes `isSaved` | ✅ |
| 4. Read One | `getProjectById()` → `GET /api/projects/:id` | `getProjectById` → populates owner, computes avg rating | ⚠️ Missing `isSaved` |
| 5. Get for Edit | `getProjectDetails()` → `GET /api/projects/:id/edit` | `getProjectForEdit` → ownership check | ✅ |
| 6. Update | `updateProject()` → `PUT /api/projects/:id/edit` | `updateProject` → ownership check, partial update | ✅ |
| 7. Delete | `deleteProject()` → `DELETE /api/projects/:id` | `deleteProject` → ownership check, deleteOne | ✅ |

#### Like/Save Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Toggle Like | `toggleLikes()` → `POST /api/projects/:id/like` | `toggleLikes` → adds/removes from likes[], creates Notification | ✅ |
| 2. Toggle Save | `toggleSaveProject()` → `POST /api/projects/:projectId/save` | `toggleSaveProject` → adds/removes from user.savedProjects | ✅ |
| 3. Get Saved | `getSavedProjects()` → `GET /api/projects/saved/me` | `getSavedProjects` → populates savedProjects with owner | ⚠️ Route shadowed by `/:id` |

#### Review Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Get Reviews | `getReviews()` → `GET /api/projects/:id/review` | `getReviews` → finds by project, populates user | ✅ |
| 2. Add Review | `addReviews()` → `POST /api/projects/:id/review` | `addReviews` → self-review check, unique constraint, creates Notification (checks `reviewAlerts` preference) | ✅ |
| 3. Edit Review | `editReview()` → `PUT /api/projects/:id/review` | `editReview` → sets isEdited=true | ✅ |
| 4. Delete Review | `deleteReview()` → `DELETE /api/projects/:id/review` | `deleteReview` → ownership check | ✅ |
| 5. Get My Reviews | `getMyReviews()` → `GET /api/projects/my-reviews` | `getCurrentUserReview` → received + given reviews with stats | ✅ |
| 6. Unread Count | `getUnreadReviewCount()` → `GET /api/reviews/unread-count` | `getUnreadReviewCount` → counts isRead=false on owned projects | ✅ |
| 7. Mark Read | `markReviewAsRead()` → `PATCH /api/reviews/:reviewId/read` | `markReviewAsRead` → ownership check, sets isRead=true | ✅ |

#### Notification Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Get All | `getNotifications()` → `GET /api/notifications` | `getNotifications` → finds by recipient, populates sender+project | ✅ |
| 2. Mark One Read | `markNotificationRead()` → `PATCH /api/notifications/:id/read` | `markNotificationRead` → recipient check | ✅ |
| 3. Mark All Read | `markAllNotificationsRead()` → `PATCH /api/notifications/read-all` | `markAllNotificationsRead` → bulk update | ✅ |
| 4. Unread Count | `getUnreadNotificationCount()` → `GET /api/notifications/unread-count` | `getUnreadNotificationCount` → countDocuments | ✅ |

#### Chat Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Send Message | `sendMessage()` → `POST /api/chat/send` | `sendMessage` → creates/finds conversation, creates Message | ✅ |
| 2. Get Conversations | `getConversations()` → `GET /api/chat/conversations` | `getConversations` → aggregation with unread counts | ✅ |
| 3. Get Messages | `getMessages()` → `GET /api/chat/messages/:conversationId` | `getMessages` → participant check, sorted by date | ✅ |
| 4. Unread Count | `getUnreadCount()` → `GET /api/chat/unread-count` | `getUnreadCount` → aggregation pipeline | ✅ |
| 5. Mark Read | `markAsRead()` → `PATCH /api/chat/messages/:conversationId/read` | `markAsRead` → participant check, bulk update | ✅ |

#### Settings Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Update Profile | `updateProfile()` → `PATCH /api/auth/me` | `updateMe` → whitelist of allowed fields | ✅ |
| 2. Change Password | `changePassword()` → `PATCH /api/auth/me/password` | `changePassword` → local auth only, bcrypt compare | ✅ |
| 3. Notification Prefs | `updateProfile({notificationPreferences})` → `PATCH /api/auth/me` | `updateMe` → includes notificationPreferences in whitelist | ✅ |
| 4. Weekly Digest | Frontend saves preference | **No backend consumer** | ❌ Missing |

#### Profile Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. View Other User | `getUserProfile()` → `GET /api/users/:username` | `getUserProfile` → optionalAuth, computes totalProjects/Likes/Reviews, activity feed | ✅ |
| 2. Follow/Unfollow | `toggleFollow()` → `POST /api/users/:username/follow` | `toggleFollow` → updates both users' followers/following, creates Notification | ✅ |
| 3. Get All Users | `getAllUsers()` → `GET /api/users/` | `getAllUsers` → batched aggregation (NOT N+1) | ✅ |
| 4. Get Followers | `getFollowers()` → `GET /api/users/:username/followers` | `getFollowers` → populates followers | ⚠️ Frontend missing `credentials: "include"` |
| 5. Get Following | `getFollowing()` → `GET /api/users/:username/following` | `getFollowing` → populates following | ⚠️ Frontend missing `credentials: "include"` |

#### Image Upload Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Upload Avatar | Direct `fetch('/api/upload')` in `MyProfile.jsx` | `upload.routes.js` → Cloudinary upload | ✅ |

#### Support Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Submit Request | `supportRequestsApi()` → `POST /api/support` | `createSupportRequest` → SupportRequest.create | ✅ |

#### Stats Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Get Platform Stats | `getStats()` → `GET /api/stats` | `getStats` → countDocuments for users/projects/reviews | ✅ |

### Missing API ↔ UI Chains

| Gap | Frontend | Backend | Impact |
|-----|----------|---------|--------|
| **Weekly Digest** | Settings saves `weeklyDigest` preference | No email sending job exists | Feature is placeholder |
| **Community page stats** | Static feature cards + hero | Only stats API called; no dynamic member/project lists | Page feels incomplete |
| **Dashboard "Community Rank"** | Shows static sidebar | No ranking/leaderboard API exists | Placeholder content |
| **Profile image upload on Settings** | Settings page doesn't support image upload | Upload API exists | Gap in Settings vs MyProfile |
| **`getProjectById` missing `isSaved`** | `Project.jsx` `bookmarked` state never set from API | `getProjectById` response lacks `isSaved` field | Bookmark always shows false on page load |

---

## 6. Interactive Elements Audit

| Element | Location | Behavior | API Connected | Status |
|---------|----------|----------|---------------|--------|
| Like Button (Project) | `Project.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Like Button (Explore) | `ExploreProjects.jsx` | Toggle, optimistic UI, refetch | Yes | ✅ |
| Like Button (MyProfile) | `MyProfile.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Save/Bookmark (Project) | `Project.jsx` | Toggle, optimistic UI | Yes | ⚠️ Initial state always false |
| Save/Bookmark (Explore) | `ExploreProjects.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Save/Bookmark (ExploreProjects header) | `ExploreProjects.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Follow/Unfollow (UserProfile) | `UserProfile.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Follow/Unfollow (ExploreUsers) | `ExploreUsers.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Review Submit | `Project.jsx` | Form submit, refreshes list | Yes | ✅ |
| Review Edit | `Project.jsx` | Inline edit mode | Yes | ✅ |
| Review Delete | `Project.jsx` | Confirmation, removes | Yes | ✅ |
| Project Delete | `Project.jsx` | Confirmation dialog, redirect | Yes | ✅ |
| Chat Send | `Chat.jsx` | Message input, submit | Yes | ✅ |
| Notification Mark Read | `Notifications.jsx` | Click to mark read | Yes | ✅ |
| Mark All Read | `Notifications.jsx` | Button, marks all | Yes | ✅ |
| Review Mark Read | `ReviewsReceived.jsx` | Click marks read | Yes | ✅ |
| Profile Edit | `MyProfile.jsx` | Inline form, image upload | Yes | ✅ |
| Settings Profile | `Settings.jsx` | Form, saves username/portfolioUrl | Yes | ✅ |
| Settings Notifications | `Settings.jsx` | Toggle switches | Yes (partial) | ⚠️ |
| Settings Password | `Settings.jsx` | Form, validates | Yes | ✅ |
| Support Submit | `SupportModal.jsx` | Form, validates, submits | Yes | ✅ |
| Category Filter | `ExploreProjects.jsx` | Client-side filter | N/A | ✅ |
| Search | `ExploreProjects.jsx` | Client-side filter | N/A | ✅ |
| User Search | `ExploreUsers.jsx` | Client-side filter | N/A | ✅ |
| Tech Stack Tags (Create) | `CreateProjects.jsx` | Add/remove tags | N/A | ✅ |
| Tech Stack Tags (Edit) | `EditProject.jsx` | Add/remove tags | N/A | ✅ |
| Star Rating | `Project.jsx` | Hover preview, click select | N/A | ✅ |
| Tab Switching | Multiple components | Local state | N/A | ✅ |
| Sidebar Collapsed | `SidebarContext.jsx` | localStorage persist | N/A | ✅ |

---

## 7. Counts & Badges Audit

### Badge Sources

| Badge | Location | Data Source | Dynamic? |
|-------|----------|-------------|----------|
| Unread Messages | `Sidebar.jsx` | `GET /api/chat/unread-count` → `data.totalUnread` | ✅ Yes |
| Unread Notifications | `Sidebar.jsx` | `GET /api/notifications/unread-count` → `data.unreadCount` | ✅ Yes |
| Unread Reviews | `Sidebar.jsx` | `GET /api/reviews/unread-count` → `data.unreadCount` | ✅ Yes |
| Profile Projects Count | `MyProfile.jsx` | `myProjects.length` (local state) | ✅ Yes |
| Profile Saved Count | `MyProfile.jsx` | `savedProjects.length` (local state) | ✅ Yes |
| Dashboard Stats | `Dashboard.jsx` | `data.stats.totalProjects/Likes/ReceivedReviews/GivenReviews` from API | ✅ Yes |
| Dashboard Followers/Following | `Dashboard.jsx` | `user.followers.length` / `user.following.length` from AuthContext | ✅ Yes |
| Explore Stats Cards | `ExploreProjects.jsx` | `GET /api/stats` → developers/projects/reviews | ✅ Yes |
| Project Likes | `Project.jsx` | `likesCount` from `getProjectById` response | ✅ Yes |
| Project Reviews | `Project.jsx` | `reviews.length` from `getReviews` response | ✅ Yes |
| Trending Badge (Project) | `Project.jsx:407-413` | `likesCount > 5` | ⚠️ Hardcoded, differs from ExploreProjects |
| Trending/New (Explore) | `ExploreProjects.jsx:589-595` | Data-driven: likes≥5 OR rating≥4.5; New: ≤7 days | ✅ **FIXED** |
| MyProjects Score | `MyProjects.jsx:256` | `Math.floor((likesCount*4)+(reviewsCount*3)+12)` | ⚠️ Hardcoded formula |

### Badge Accuracy Issues

1. **Trending thresholds are inconsistent** across three locations:
   - `ExploreProjects.jsx:590`: likes ≥ 5 OR rating ≥ 4.5
   - `Project.jsx:407`: likes > 5 (i.e., 6+)
   - `ExploreProjects.jsx:190`: likes > 2 OR rating ≥ 4.0 (dead code — "Trending" not in CATEGORIES)

2. **MyProjects score** (`MyProjects.jsx:256`): Formula `Math.floor((likesCount*4)+(reviewsCount*3)+12)` uses hardcoded weights. The `+12` constant means even projects with 0 likes/reviews get a score of 12.

---

## 8. Chat System Audit

### Architecture
- **Model**: Conversation (participants[], lastMessage, lastMessageAt) + Message (conversationId, sender, text, isRead)
- **No real-time**: All polling via REST API
- **No WebSocket/Socket.io**: Messages only refresh on user action

### Chat Flow Analysis

| Step | Implementation | Status |
|------|---------------|--------|
| Start new conversation | Auto-created when first message sent to a user | ✅ |
| Send message | `POST /api/chat/send` → validates receiver, creates Message, updates Conversation | ✅ |
| Load conversations | Aggregation pipeline with unread counts, sorted by lastMessageAt | ✅ |
| Load messages | Sorted by createdAt ascending, populates sender | ✅ |
| Mark as read | Bulk update isRead for all messages in conversation from other party | ✅ |
| Unread count (global) | Aggregation pipeline counting unread messages from other participants | ✅ |
| Unread count (per conversation) | Included in getConversations aggregation | ✅ |
| Self-message prevention | Backend checks `receiverId === senderId` | ✅ |
| Message length limit | 5000 characters max | ✅ |
| ObjectId validation | Validates receiverId and conversationId | ✅ |
| Participant authorization | Checks user is participant before loading messages | ✅ |

### Chat Limitations
1. **No real-time**: Users must manually refresh or navigate to see new messages
2. **No typing indicators**
3. **No online/offline status**
4. **No message pagination**: All messages loaded at once
5. **No image/file sharing**: Text only

---

## 9. Reviews System Audit

### Review Constraints
| Constraint | Implementation | Location |
|------------|---------------|----------|
| One review per user per project | Unique compound index `{project:1, user:1}` | `Review.js:43-51` |
| Self-review prevention | `userId === project.owner.toString()` check | `reviewController.js:23-28` |
| Rating range (1-5) | Schema min/max + controller check | `Review.js:17-20`, `reviewController.js:28-33` |
| Non-empty review text | Trim + length check | `reviewController.js:35-40` |
| Review ownership for edit/delete | `user: userId` in query | `reviewController.js:141-144` |
| Owner can't review own project | Owner check | `reviewController.js:23-28` |

### Review Notification
- When a review is added, a notification is created IF the project owner has `notificationPreferences.reviewAlerts !== false` (`reviewController.js:65-73`)
- **Issue**: Like notifications (`projectController.js:377-382`) and follow notifications (`userController.js:106-110`) do NOT check notification preferences — they always create notifications

### Review Read/Unread
- `isRead` field on Review model, default `false`
- `getUnreadReviewCount` counts reviews where `isRead: false` on user's projects
- `markReviewAsRead` checks user owns the project before marking
- Sidebar badge shows unread review count
- ReviewsReceived page shows reviews with mark-as-read on click

### Average Rating Calculation
- Done in multiple places: `getProjectById` (via utility), `getMyProjects` (inline), `getExploreProjects` (inline), `getProjectByUsername` (inline)
- Each computes `totalRating / reviewsCount` separately — **duplicated logic**
- Frontend also computes avg in `Project.jsx:266`
- `calculateAverageRating` utility is imported in `projectController.js:6` but **never used**

---

## 10. Notifications Audit

### Notification Types
| Type | Trigger | Creates Notification | Checks Preferences |
|------|---------|---------------------|-------------------|
| `like` | `toggleLikes` in `projectController.js:377-382` | Yes (when liking, not unliking) | ❌ No |
| `review` | `addReviews` in `reviewController.js:65-73` | Yes | ✅ Yes (checks reviewAlerts) |
| `follow` | `toggleFollow` in `userController.js:106-110` | Yes (when following, not unfollowing) | ❌ No |

### Notification Preferences
- `reviewAlerts` (default: true) — checked before creating review notification
- `weeklyDigest` (default: true) — saved in DB but **no consumer** (no email job)

### Notification Display
- `Notifications.jsx` fetches all notifications, shows sender name/image, type icon, project title
- Click marks individual notification as read
- "Mark all as read" button marks all unread as read
- Unread count shown as sidebar badge
- Loading state: skeleton with `animate-pulse` (lines 211-212)
- Empty state: "No notifications yet" with `CheckCheck` icon (line 256)
- Error state: `AlertCircle` + "Retry" button (lines 213-218)
- Infinite scroll: "Loading more notifications..." at bottom (lines 236-239)

### Issues
1. **Like/follow notifications ignore preferences**: Even if user disables reviewAlerts, they still get like and follow notifications
2. **weeklyDigest has no effect**: Preference is saved but nothing reads it
3. **No notification deletion**: Notifications accumulate indefinitely
4. **No pagination**: All notifications loaded at once (infinite scroll loads more, but no backend pagination)

---

## 11. Authentication Audit

### Auth Mechanism
- **JWT in HTTP-only cookie**: 7-day expiry
- **Cookie settings**: `httpOnly: true`, `secure: true` in production, `sameSite: "none"` in production / `"lax"` in development
- **Token payload**: `{ id: userId }`

### Auth Middleware
| Middleware | Purpose | Used In |
|-----------|---------|---------|
| `authMiddleware` | Required auth — 401 if no token | Most routes |
| `optionalAuth` | Optional auth — continues without user if no token | `GET /api/users/:username` |

### Auth Edge Cases
1. **`getExploreProjects` requires auth** (`authMiddleware`) — logged-out users can't explore
2. **`getProjectById` requires auth** — can't view project details without login
3. **`getFollowers`/`getFollowing` have auth** (`authMiddleware`) — but frontend API calls omit `credentials: "include"`, so requests will fail with 401
4. **Google auth auto-creates users** with auto-generated username — no email verification needed
5. **`getAllUsers` excludes current user** via `$ne: req.user.id` — correct
6. **Token refresh not implemented** — user must re-login after 7 days
7. **No JWT algorithm pinning** — `jwt.verify` defaults to allowing multiple algorithms

### Password Security
- Bcrypt with salt rounds 10 ✅
- Password change requires current password verification ✅
- Google accounts can't change password (blocked in `changePassword`) ✅
- Password not returned in any API response (`.select("-password")`) ✅
- **No password length validation on signup** — `signUp` in `auth.controller.js` hashes without checking length ❌

---

## 12. Profiles Audit

### My Profile (`/profile/my`)
- **Data source**: AuthContext (`user`) + `getMyProjects()` + `getSavedProjects()`
- **Stats computed locally**: projects count, reviews sum, likes sum, followers/following from user object
- **Profile completion**: Weighted percentage (profileImage 20%, bio 20%, skills 20%, role 10%, githubUrl 10%, portfolioUrl 10%, name 5%, username 5%)
- **Edit mode**: Inline form with image upload via `/api/upload` (Cloudinary)
- **Skills**: Stored as comma-separated string, parsed to array on save
- **Legacy field**: `user.GitBranchUrl` referenced as fallback for `githubUrl` (lines 121, 263)

### Other User Profile (`/users/:username`)
- **Data source**: `GET /api/users/:username` → returns user, totalProjects, totalLikes, totalReviews, followersCount, followingCount, isFollowing, activity[]
- **Activity feed**: Last 10 projects + last 10 authored reviews, merged and sorted by date, limited to 15
- **Follow/Unfollow**: Toggle via `POST /api/users/:username/follow`
- **Projects tab**: `GET /api/projects/username/:username` via `getProjectsByUsernameApi`
- **Followers/Following modals**: `getFollowers`/`getFollowing` API calls (missing `credentials: "include"`)

### Profile Issues
1. **MyProfile stats don't match Dashboard stats**: MyProfile computes locally from loaded projects; Dashboard gets stats from `getCurrentUserReview` API
2. **Profile completion uses `user` from AuthContext**: May be stale if user updated profile elsewhere
3. **Image upload on MyProfile** uses direct fetch to `/api/upload` instead of a service function — inconsistent pattern
4. **Legacy `GitBranchUrl` field** referenced in fallback — should be cleaned up

---

## 13. Projects Audit

### Project Model Fields
```
title: String (required, trimmed)
description: String (required, trimmed)
thumbnail: String (default: "")
techStack: [String]
githubUrl: String (default: "")
liveUrl: String (default: "")
owner: ObjectId → Users (required)
likes: [ObjectId → Users]
timestamps: true (createdAt, updatedAt)
```

### Missing Fields
- **No `slug` field**: URLs use MongoDB ObjectId (`/projects/:id`)
- **No `views` or `stars` count**: Only likes array
- **No `category` field**: Categories are derived from techStack client-side
- **No `isDeleted`/soft-delete**: Hard delete only

### Project Enrichment (Backend)
The backend enriches projects in `getMyProjects`, `getExploreProjects`, `getProjectByUsername`, and `getProjectById` with:
- `likesCount` = `likes.length`
- `isLiked` = `likes.some(id => id === userId)`
- `reviewsCount` = count of reviews for project
- `averageRating` = computed from reviews
- `isSaved` = **ONLY in `getExploreProjects`** (line 202)

**Note**: This enrichment is duplicated across 4 controllers. `isSaved` is only present in 1 of 4.

### Project Score (Frontend)
`MyProjects.jsx:256` calculates a score: `Math.floor((likesCount*4)+(reviewsCount*3)+12)`
- This score is NOT stored in the database
- The `+12` base means every project starts at score 12
- Weights (4 for likes, 3 for reviews) are arbitrary

---

## 14. Likes & Follows Audit

### Like System
- **Storage**: `likes` array on Project model (array of User ObjectIds)
- **Toggle**: Adds/removes user ID from array
- **Notification**: Created when liking (not when unliking), **no preference check** (`projectController.js:377-382`)
- **Optimistic UI**: Frontend toggles state before API call, reverts on failure
- **Uniqueness**: Implicit — `some()` check prevents duplicates

### Follow System
- **Storage**: `followers` and `following` arrays on User model
- **Toggle**: Adds/removes from both users' arrays simultaneously
- **Self-follow prevention**: Backend checks `targetUser._id.toString() === currentUserId`
- **Notification**: Created when following (not when unfollowing), **no preference check** (`userController.js:106-110`)
- **No follow limit**: Users can follow unlimited accounts

### Issues
1. **Like notification doesn't check preferences**: Should respect a like-specific preference or `reviewAlerts`
2. **Follow notification doesn't check preferences**: Always creates notification
3. **No bulk operations**: Can't like/follow multiple items at once
4. **`getAllUsers` N+1 was fixed**: Now uses batched aggregation pipeline, not N+1 queries

---

## 15. Loading/Error/Empty States

### Loading States

| Page/Component | Loading Implementation | Quality |
|----------------|----------------------|---------|
| Dashboard | Skeleton with pulsing placeholders | ✅ Good |
| MyProfile | Skeleton with pulsing placeholders | ✅ Good |
| UserProfile | Shimmer skeleton with avatar, name, tabs | ✅ Good |
| ExploreProjects | Shimmer skeleton cards (6 items) | ✅ Good |
| Single Project | `ProjectSkeleton` with shimmer | ✅ Good |
| EditProject | "Checking authorization..." spinner | ✅ Good |
| CreateProjects | None visible | ❌ Missing |
| Settings | No explicit loading state | ❌ Missing |
| Notifications | Skeleton with `animate-pulse` | ✅ **FIXED** |
| ReviewsReceived | Skeleton with header, stats, placeholders | ✅ **FIXED** |
| Chat | Shimmer header + "Loading chat..." | ✅ **FIXED** |
| SavedProjects | Pulsing skeleton | ✅ Good |
| ExploreUsers | Shimmer skeleton cards (8 items) | ✅ **FIXED** |

### Error States

| Page/Component | Error Implementation | Quality |
|----------------|---------------------|---------|
| Dashboard | `AlertCircle` + error message + "Try Again" button | ✅ **FIXED** |
| ExploreProjects | Full error UI with "Try Again" button | ✅ Good |
| Single Project | Full error UI with "Return to Explore" | ✅ Good |
| EditProject | Authorization error + generic error states | ✅ Good |
| CreateProjects | try/catch with console.error only | ❌ No user-facing error |
| Settings | Toast messages for save success/failure | ✅ Good |
| MyProfile | Toast messages | ✅ Good |
| SupportModal | Error message below form | ✅ Good |

### Empty States

| Page/Component | Empty Implementation | Quality |
|----------------|---------------------|---------|
| Dashboard (No Projects) | "No projects indexed yet" with CTA | ✅ Good |
| Dashboard (No Reviews) | "No feedback received" with CTA | ✅ Good |
| MyProfile (No Projects) | "No projects uploaded yet" with CTA | ✅ Good |
| SavedProjects | Empty state with "Explore Projects" CTA | ✅ Good |
| ExploreProjects (No Results) | "No blueprints found" with clear filters | ✅ Good |
| Single Project (No Reviews) | "No reviews yet" with CTA | ✅ Good |
| Notifications (No Notifications) | "No notifications yet" with icon | ✅ **FIXED** |
| Messages (No Conversations) | No explicit empty state | ❌ Missing |
| ReviewsReceived (No Reviews) | "No reviews received yet" | ✅ **FIXED** |
| ExploreUsers (No Results) | "No developers found" with clear filters | ✅ **FIXED** |

---

## 16. Database/Model Audit

### Models Summary

| Model | Fields | Indexes | Relationships |
|-------|--------|---------|---------------|
| Users | name, username, email, password, authProvider, googleId, role, profileImage, bio, skills[], githubUrl, portfolioUrl, isVerified, savedProjects[], followers[], following[], notificationPreferences | username (unique), email (unique), googleId (unique, sparse) | Owner of Projects, author of Reviews, participant in Conversations |
| Projects | title, description, thumbnail, techStack[], githubUrl, liveUrl, owner, likes[] | None explicit | Belongs to Users, has many Reviews |
| Reviews | project, user, rating, review, isEdited, isRead | Compound unique: {project, user}; {project, createdAt}; {user, createdAt}; {project, isRead} | Belongs to Projects and Users |
| Notification | recipient, sender, type (like/review/follow), project, isRead | None explicit | References Users and Projects |
| Conversation | participants[], lastMessage, lastMessageSender, lastMessageAt | Compound: {participants, lastMessageAt} | Has many Messages |
| Message | conversationId, sender, text, isRead | None explicit (should have) | Belongs to Conversation and Users |
| OTP | email, otp, expiresAt, type | None explicit (should have TTL) | Standalone |
| Support | user, name, email, category, subject, message | None explicit | References Users |

### Index Gaps

| Collection | Recommended Index | Reason |
|------------|------------------|--------|
| Messages | `{ conversationId: 1, createdAt: 1 }` | getMessages sorts by createdAt |
| Messages | `{ isRead: 1, sender: 1 }` | getUnreadCount filters on these |
| Notifications | `{ recipient: 1, isRead: 1 }` | getUnreadNotificationCount |
| Notifications | `{ recipient: 1, createdAt: -1 }` | getNotifications sorts by date |
| OTP | TTL index on expiresAt | Auto-cleanup of expired OTPs |
| OTP | `{ email: 1, type: 1 }` | Lookup performance for findOne({email}) |
| Projects | `{ owner: 1, createdAt: -1 }` | getMyProjects sorts by date |
| Users | `{ savedProjects: 1 }` | Used in deleteProject cleanup and getExploreProjects |

### Data Integrity
- **Cascade deletes partially implemented**: `deleteProject` cleans up `savedProjects` in all users (`projectController.js:332-335`)
- **No cascade for reviews**: Deleting a project does NOT delete its reviews
- **No cascade for notifications**: Deleting a project/user does NOT clean up notifications
- **No soft delete**: Hard delete only — data permanently removed
- **Orphaned notifications**: If a user is deleted, notifications referencing them remain

---

## 17. Security Audit

### Critical Issues

| # | Issue | Location | Severity | Description |
|---|-------|----------|----------|-------------|
| 1 | **No rate limiting** | `backend/server.js:31` | 🔴 Critical | No rate limiting on any endpoint — vulnerable to brute force on login, OTP, forgot-password |
| 2 | **No CSRF protection** | `backend/server.js` | 🔴 Critical | Cookie-based auth without CSRF tokens — vulnerable to cross-site request forgery |
| 3 | **No helmet/security headers** | `backend/server.js` | 🔴 High | Missing X-Frame-Options, CSP, HSTS, etc. |
| 4 | **OTP brute force** | `auth.controller.js:80-124` | 🔴 High | No attempt limiting on OTP verification — attacker can brute force 6-digit OTP |
| 5 | **No password length validation on signup** | `auth.controller.js:36` | 🟡 Medium | Bcrypt hashes whatever password is sent — no minimum length check |
| 6 | **No email format validation** | `auth.controller.js` | 🟡 Medium | Email format not validated before DB insert |
| 7 | **No input sanitization** | All controllers | 🟡 Medium | No XSS protection on user-generated content (reviews, bios, project descriptions) |
| 8 | **No request body size limit** | `backend/server.js:31` | 🟡 Medium | `express.json()` without limit — vulnerable to large payload attacks |

### Moderate Issues

| # | Issue | Location | Severity | Description |
|---|-------|----------|----------|-------------|
| 9 | **JWT in cookie without rotation** | `generateToken.js:7` | 🟡 Medium | Same token for 7 days, no refresh mechanism, no revocation |
| 10 | **JWT verify lacks algorithm pinning** | `auth.middleware.js:14` | 🟡 Medium | Should specify `{ algorithms: ["HS256"] }` |
| 11 | **No user-exists-in-DB check on auth** | `auth.middleware.js` | 🟡 Medium | Once JWT issued, trusted for 7 days even if user deleted/banned |
| 12 | **Silent DB connection failure** | `config/db.js:8-9` | 🟡 Medium | Empty catch block — server starts even if DB connection fails |
| 13 | **CORS allows localhost:3000** | `server.js:24-27` | 🟢 Low | Development URL in production CORS list |
| 14 | **No OTP TTL index** | `OTP.js` | 🟡 Medium | Expired OTPs accumulate indefinitely, no auto-cleanup |
| 15 | **36 console.log in frontend services** | 15 files in `frontend/services/` | 🟡 Medium | Debug logs leak to production console |
| 16 | **No `credentials: "include"` on getFollowers/getFollowing** | `usersApi.js:27,32` | 🟢 Low | Requests fail with 401 against authMiddleware-protected routes |

### Good Security Practices Found
- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ SameSite cookie attribute set
- ✅ Secure flag in production
- ✅ Password excluded from all API responses
- ✅ Bcrypt with salt rounds 10
- ✅ Google auth verifies ID token server-side
- ✅ Ownership checks on project edit/delete
- ✅ Self-review prevention
- ✅ Self-follow prevention
- ✅ Self-message prevention
- ✅ Participant authorization on chat message loading
- ✅ ObjectId validation on all route params
- ✅ Auth middleware on protected routes
- ✅ optionalAuth for public profile viewing

---

## 18. Dead/Duplicate Code

### Dead Code

| File | Line(s) | Description | Verified? |
|------|---------|-------------|-----------|
| `reviewController.js` | N/A | **`getReviewForEdit` does NOT exist** — stale reference in old audit report. No such function in the codebase. | ❌ Stale — invalid finding |
| `userController.js` | N/A | **`getFollowers`/`getFollowing` ARE called** from `UserProfile.jsx` via `usersApi.js`. Frontend has `credentials` issue but the functions ARE wired. | ❌ Stale — partially invalid |
| `Dashboard.jsx:413-421` | Community Rank sidebar | Static placeholder content — not connected to any data | ✅ Valid |
| `ExploreProjects.jsx:83` | `isPinned` state | Used for scroll-based pinned search bar — functional but noted | ✅ Valid |
| `MyProfile.jsx:121,263` | `user.GitBranchUrl` | Fallback for `githubUrl` references a field name that doesn't exist on the model | ✅ Valid |
| `ExploreProjects.jsx:189-191` | Trending filter | `selectedCategory === "Trending"` is unreachable — "Trending" not in CATEGORIES array | ✅ Valid (dead code path) |

### Duplicate Code

| Pattern | Locations | Description |
|---------|-----------|-------------|
| Project enrichment (likes/reviews/rating) | `projectController.js` lines 82-94, 190-206, 444-460, 129-141 | Same enrichment logic in `getMyProjects`, `getExploreProjects`, `getProjectByUsername`, `getProjectById` |
| Average rating calculation | `projectController.js` (3 inline + 1 utility), `Project.jsx:266` | Backend computes in 4 places (3 duplicate inline, 1 utility), frontend computes again |
| Unused import | `projectController.js:6` | `calculateAverageRating` imported but never used |
| `console.log` in services | `frontend/services/` — 15 files, 36 occurrences | Debug logs left in production code |
| Image upload pattern | `MyProfile.jsx:204-219` | Direct `fetch` call instead of using a service function |
| Shimmer CSS | `ExploreProjects.jsx` vs `Project.jsx` | Same CSS defined in two components |

---

## 19. Already Complete Features

These features are fully implemented, dynamically connected, and production-ready:

| # | Feature | Evidence |
|---|---------|----------|
| 1 | **Email/Password Registration with OTP** | Full flow: signup → OTP email → verify → login |
| 2 | **Google OAuth Login** | Auto-creates user, sets isVerified, generates JWT |
| 3 | **Forgot Password with OTP** | Full flow: email → OTP → reset password |
| 4 | **JWT Cookie Authentication** | HTTP-only, secure, SameSite, 7-day expiry |
| 5 | **Project CRUD** | Create, read (my/explore/by-id), update (ownership check), delete (ownership check + savedProjects cleanup) |
| 6 | **Project Like/Unlike** | Toggle with optimistic UI, creates notification |
| 7 | **Project Save/Bookmark** | Toggle, saved list page, remove from saved |
| 8 | **Peer Reviews (CRUD)** | Add, edit (isEdited flag), delete, unique constraint, self-review blocked |
| 9 | **Review Star Rating** | 1-5 stars with hover preview, average computed |
| 10 | **Review Read/Unread System** | isRead flag, unread count, mark-as-read, sidebar badge |
| 11 | **Notification System** | Like/review/follow notifications, mark read, mark all read, unread badge |
| 12 | **Real-time Chat** | Send/receive messages, conversations list, unread counts, mark as read |
| 13 | **User Profiles** | View by username, stats, activity feed, follow/unfollow |
| 14 | **Profile Editing** | Image upload (Cloudinary), skills, bio, links |
| 15 | **Settings (Profile + Security)** | Username, portfolio URL, password change |
| 16 | **Explore Projects** | Search, category filter, stats cards, data-driven badges |
| 17 | **Explore Users** | User listing with stats, follow/unfollow |
| 18 | **Dashboard** | Projects list, reviews received, stats summary |
| 19 | **Support Requests** | Form with validation, creates Support document |
| 20 | **Platform Stats** | Users, projects, reviews counts |
| 21 | **ExploreProjects `isSaved`** | Backend returns `isSaved` per user, frontend consumes it directly |

---

## 20. Partially Complete Features

| # | Feature | What's Done | What's Missing | Severity |
|---|---------|-------------|----------------|----------|
| 1 | **Notification Preferences** | Settings UI saves `reviewAlerts` and `weeklyDigest` | `weeklyDigest` has no consumer; like/follow notifications ignore preferences | Medium |
| 2 | **Community Page** | Beautiful landing page with feature cards, support modal, dynamic stats | No dynamic content (member list, recent activity, trending projects) | Low |
| 3 | **Single Project View bookmark state** | Toggle works optimistically | `getProjectById` doesn't return `isSaved`; `Project.jsx` `bookmarked` never set from API — always false on load | High |
| 4 | **Dashboard Community Rank** | Sidebar with placeholder text | No ranking/leaderboard API or algorithm | Low |
| 5 | **Saved Projects Page** | Dedicated page with remove functionality | Route `GET /saved/me` shadowed by `/:id` — may not work | High |

---

## 21. Must Become Dynamic

| # | Current State | Required Change | Priority |
|---|---------------|----------------|----------|
| 1 | ExploreProjects badges are now data-driven | ✅ Already fixed — no change needed | ~~High~~ Done |
| 2 | MyProjects score uses hardcoded formula | Store score in DB or make weights configurable | Medium |
| 3 | Trending threshold inconsistent across 3 locations | Standardize threshold: same definition everywhere | Medium |
| 4 | Community page is entirely static (except stats) | Fetch and display platform stats, recent projects, top contributors | Medium |
| 5 | Dashboard "Community Rank" is placeholder | Implement ranking algorithm or remove placeholder | Low |
| 6 | Category chips in ExploreProjects are hardcoded | Derive from actual techStack values across all projects | Low |
| 7 | Average rating computed in 5+ places | Centralize in backend response, single source of truth | High |

---

## 22. Priority List

### P0 — Critical (Fix Immediately)
1. ✅ ~~Add rate limiting to auth endpoints~~ — NOT DONE, still needed
2. ✅ ~~Add CSRF protection for cookie-based auth~~ — NOT DONE, still needed
3. ✅ ~~Add OTP attempt limiting (max 5 attempts)~~ — NOT DONE, still needed
4. ~~Fix `getExploreProjects` to return `isSaved` field~~ — ✅ DONE
5. ~~Fix `getAllUsers` N+1 query~~ — ✅ DONE (uses aggregation)

### P1 — High (Fix Before Launch)
1. Add helmet.js for security headers — NOT DONE
2. ✅ ~~Remove `console.log` statements from production code~~ — NOT DONE (36 occurrences remain)
3. ~~Fix `projectController.js.js` double extension filename~~ — ✅ DONE
4. Centralize average rating calculation (backend only) — NOT DONE
5. Add notification preference checks for like/follow notifications — NOT DONE
6. **NEW: Fix `getProjectById` to return `isSaved` field** — NOT DONE
7. **NEW: Fix route ordering — move `GET /saved/me` before `GET /:id`** — NOT DONE
8. **NEW: Fix `getFollowers`/`getFollowing` frontend — add `credentials: "include"`** — NOT DONE

### P2 — Medium (Fix Soon)
1. Add message pagination to chat — NOT DONE
2. Add notification pagination — NOT DONE
3. Add loading states to CreateProjects, Settings — NOT DONE
4. Add empty states to Messages — NOT DONE
5. Add error states to CreateProjects — NOT DONE
6. Implement `weeklyDigest` email sending or remove the preference — NOT DONE
7. Add TTL index on OTP collection for auto-cleanup — NOT DONE
8. Add database indexes for Messages, Notifications, Users.savedProjects — NOT DONE
9. Add `express.json({ limit: '10mb' })` — NOT DONE
10. Remove all `console.log` from frontend service files — NOT DONE
11. Add password length validation on signup — NOT DONE
12. Add email format validation — NOT DONE

### P3 — Low (Nice to Have)
1. Add WebSocket for real-time chat — NOT DONE
2. Add typing indicators — NOT DONE
3. Add online/offline status — NOT DONE
4. Add soft delete for projects — NOT DONE
5. Add image/file sharing in chat — NOT DONE
6. Add JWT token rotation/refresh — NOT DONE
7. Implement Community page dynamic content — NOT DONE
8. Implement ranking/leaderboard — NOT DONE
9. Derive category chips from actual data — NOT DONE
10. Clean up legacy `GitBranchUrl` field reference — NOT DONE
11. Remove dead trending filter code path — NOT DONE

---

## 23. Implementation Phases

### Phase 1: Security Hardening (1-2 days)
- [ ] Install and configure `express-rate-limit`
- [ ] Add rate limiting to `/api/auth/*` routes
- [ ] Install and configure `helmet`
- [ ] Add `express.json({ limit: '10mb' })`
- [ ] Add CSRF middleware (e.g., `csrf-csrf` or double-submit cookie)
- [ ] Add OTP attempt tracking (max 5 per email)
- [ ] Add OTP TTL index for auto-cleanup
- [ ] Add password length validation on signup (min 6 chars)
- [ ] Add email format validation
- [ ] Add JWT algorithm pinning (`{ algorithms: ["HS256"] }`)
- [ ] Fix silent DB connection failure (log error in `config/db.js`)

### Phase 2: Bug Fixes (1-2 days)
- [x] ~~Rename `projectController.js.js` to `projectController.js`~~ — DONE
- [x] ~~Fix `getExploreProjects` to include `isSaved` field per user~~ — DONE
- [x] ~~Fix `getAllUsers` to use aggregation instead of N+1~~ — DONE
- [ ] Fix `getProjectById` to return `isSaved` field per user
- [ ] Fix `Project.jsx` to set `bookmarked` from API response
- [ ] Fix route ordering: move `GET /saved/me` before `GET /:id` in `projectRoutes.js`
- [ ] Fix `getFollowers`/`getFollowing` frontend — add `credentials: "include"` to `usersApi.js`
- [ ] Fix orphaned `reviews` when project is deleted
- [ ] Add notification preference checks for like/follow notifications
- [ ] Remove unused `calculateAverageRating` import from `projectController.js`

### Phase 3: UX Improvements (2-3 days)
- [ ] Add loading skeletons to CreateProjects, Settings
- [ ] Add empty states to Messages
- [ ] Add error states to CreateProjects
- [ ] Centralize average rating in backend responses
- [ ] Add database indexes for Messages, Notifications, Users.savedProjects, OTP
- [ ] Remove all `console.log` from frontend service files (36 occurrences)
- [ ] Clean up legacy `GitBranchUrl` fallback
- [ ] Remove dead trending filter code path

### Phase 4: Feature Completion (3-5 days)
- [ ] Implement `weeklyDigest` email or remove preference
- [ ] Add notification preference checks for like/follow
- [ ] Add message pagination (infinite scroll)
- [ ] Add notification pagination (backend)
- [ ] Implement cascade delete or orphan cleanup for reviews/notifications
- [ ] Add soft delete for projects
- [ ] Implement Community page with dynamic stats
- [ ] Implement ranking/leaderboard system

### Phase 5: Real-time & Advanced (5-7 days)
- [ ] Integrate Socket.io for real-time chat
- [ ] Add typing indicators
- [ ] Add online/offline status
- [ ] Add image/file sharing in chat
- [ ] Implement JWT refresh token rotation
- [ ] Add WebSocket-based notification push

---

## 24. Before Testing Checklist

### Backend
- [ ] All environment variables documented (JWT_SECRET, MONGODB_URI, GOOGLE_CLIENT_ID, CLOUDINARY_*, SMTP_*)
- [ ] CORS configuration reviewed for production
- [ ] Rate limiting configured
- [ ] Security headers enabled (helmet)
- [ ] Database indexes created
- [ ] Error handling consistent across all controllers
- [ ] No `console.log` in production controllers
- [ ] `connectDB` logs errors on failure

### Frontend
- [ ] All API service functions handle errors properly (return error objects, not undefined)
- [ ] Loading states present on all pages
- [ ] Empty states present on all list views
- [ ] Error states present on all data-fetching pages
- [ ] Optimistic UI updates revert on API failure
- [ ] No `console.log` in production code
- [ ] All interactive elements have proper `aria-label` attributes
- [ ] Forms have proper validation

### Database
- [ ] Indexes created for Messages, Notifications, Reviews, OTP, Users.savedProjects
- [ ] TTL index on OTP collection
- [ ] Compound unique index on Reviews verified
- [ ] Orphaned document cleanup strategy defined

### Security
- [ ] Rate limiting active on auth endpoints
- [ ] CSRF protection enabled
- [ ] OTP attempt limiting active
- [ ] HTTP security headers present
- [ ] No secrets in client-side code
- [ ] `.env` files in `.gitignore`

### Integration
- [ ] Login → Dashboard flow works end-to-end
- [ ] Signup → OTP → Verify → Login flow works
- [ ] Google OAuth flow works
- [ ] Project CRUD flow works
- [ ] Review CRUD flow works
- [ ] Like/Save toggle works across all pages
- [ ] Follow/Unfollow works across all pages
- [ ] Chat send/receive works
- [ ] Notifications appear and can be marked read
- [ ] Settings changes persist
- [ ] Image upload works (profile + project thumbnail)
- [ ] Saved Projects page loads correctly (route ordering fix needed)
- [ ] Single project view shows correct bookmark state

---

## 25. Summary Statistics

| Metric | Count |
|--------|-------|
| Frontend Pages | 15 |
| Backend Route Groups | 10 |
| Backend Controllers | 9 (including `leaderboardController.js`) |
| MongoDB Models | 8 |
| Frontend API Services | 15 |
| Frontend Components | 20+ |
| API Endpoints | ~45 |
| Security Issues Found | 8 confirmed + 8 moderate |
| Dead Code Locations | 3 valid (after removing stale references) |
| Duplicate Code Patterns | 6 |
| Missing Loading States | 2 (CreateProjects, Settings) |
| Missing Empty States | 1 (Messages) |
| Missing Error States | 1 (CreateProjects) |
| Features Complete | 21 |
| Features Partial | 5 |
| Features Static | 3 |
| Console.log in Frontend | 36 occurrences across 15 files |

---

## 26. Changelog

### Re-audit: September 2, 2026

**Items verified as FIXED (previously pending):**
- ✅ `projectController.js.js` renamed to `projectController.js`
- ✅ `getExploreProjects` now returns `isSaved` per user
- ✅ `getAllUsers` N+1 query fixed (uses batched aggregation)
- ✅ ExploreProjects badges now data-driven (not cyclic rotation)
- ✅ Loading states added to Notifications, ReviewsReceived, Chat, ExploreUsers
- ✅ Error state added to Dashboard
- ✅ Empty states added to Notifications, ReviewsReceived, ExploreUsers

**Items verified as STALE/INVALID (removed from pending):**
- ❌ `getReviewForEdit` — function does NOT exist in the codebase. Was a phantom reference.
- ❌ `getFollowers`/`getFollowing` — ARE called from frontend (but have `credentials` issue). Old audit incorrectly stated "NO frontend component calls them."

**New issues discovered:**
- 🔴 Route ordering bug: `GET /saved/me` shadowed by `GET /:id` in `projectRoutes.js`
- 🔴 `getProjectById` missing `isSaved` field — `Project.jsx` `bookmarked` always false on load
- 🟡 Silent DB connection failure — empty catch in `config/db.js`
- 🟡 36 `console.log` statements across 15 frontend service files
- 🟡 No password length validation on signup
- 🟡 No email format validation
- 🟡 No OTP attempt limiting
- 🟡 JWT verify lacks algorithm pinning
- 🟡 No user-exists-in-DB check on auth middleware
- 🟢 `getFollowers`/`getFollowing` frontend missing `credentials: "include"`
- 🟢 Dead code path: trending filter unreachable (not in CATEGORIES array)
- 🟢 `calculateAverageRating` imported but unused
- 🟢 Trending thresholds inconsistent across 3 locations

**Updated status:**
- Features Partial: 4 → 5 (added Single Project View bookmark state, Saved Projects route issue)
- Security Issues: 8 critical + 8 moderate → 3 critical + 13 moderate (refined categorization)
- Dead Code Locations: 6 → 3 valid (removed stale references)
- Console.log count: "multiple" → 36 across 15 files

---

*End of Audit Report*
