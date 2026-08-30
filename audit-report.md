# DevReview — Full-Stack Audit Report

**Generated:** August 30, 2026  
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

---

## 1. Executive Summary

DevReview is a developer-focused project showcase and peer-review platform built with **Next.js 16 (App Router)** on the frontend and **Express.js + MongoDB** on the backend. The application allows developers to create project profiles, receive code reviews with star ratings, follow other developers, save/bookmark projects, chat with each other, and receive notifications.

### Overall Health Score: **72/100**

| Category | Score | Notes |
|----------|-------|-------|
| Core CRUD | 90% | All major create/read/update/delete flows work |
| API ↔ UI Sync | 85% | Most API chains are complete; a few gaps in settings |
| Auth System | 80% | JWT cookie auth works; some edge cases missing |
| Real-time Features | 40% | Chat is polling-based, no WebSocket |
| Security | 70% | Basic auth in place; missing rate limiting, CSRF |
| Error Handling | 75% | Frontend has good UX; backend inconsistent |
| Dead Code | 15% | Several unused controllers, orphaned routes |

### Key Findings
- **12** fully dynamic features working end-to-end
- **4** partially implemented features needing completion
- **3** features still using static/mock data
- **8** security concerns identified
- **6** dead code locations found
- **2** critical bugs found

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
| Single Project View | ✅ Complete | Yes | Yes | Like, save, reviews, edit/delete |
| Save/Bookmark | ✅ Complete | Yes | Yes | Toggle, saved list page |
| Like/Unlike | ✅ Complete | Yes | Yes | Optimistic UI, API sync |
| Follow/Unfollow | ✅ Complete | Yes | Yes | Creates notification |
| Community Page | ⚠️ Partial | No | No | Static content, support modal only |
| Reviews (Add/Edit/Delete) | ✅ Complete | Yes | Yes | Unique constraint, self-review blocked |
| Reviews (Read/Unread) | ✅ Complete | Yes | Yes | isRead flag, badge count |
| Notifications | ✅ Complete | Yes | Yes | Like/review/follow types |
| Chat (Send/Receive) | ✅ Complete | Yes | Yes | Conversation aggregation |
| Chat (Unread Count) | ✅ Complete | Yes | Yes | Global unread badge |
| Support Requests | ✅ Complete | Yes | Yes | Form with validation |
| Platform Stats | ✅ Complete | Yes | Yes | Users, projects, reviews counts |
| Saved Projects Page | ✅ Complete | Yes | Yes | Dedicated /projects/saved page |
| Explore Users | ✅ Complete | Yes | Yes | All users with stats |
| User Profile (by username) | ✅ Complete | Yes | Yes | Projects, reviews, activity |

---

## 3. Pages & Routes

### Frontend Routes (Next.js App Router)

| Route | Component | Auth Required | API Calls |
|-------|-----------|---------------|-----------|
| `/dashboard` | `Dashboard.jsx` | Yes | `getMyProjects`, `getMyReviews` |
| `/profile/my` | `MyProfile.jsx` | Yes | `getMyProjects`, `getSavedProjects`, `toggleLikes`, `toggleSaveProject`, `updateProfile` |
| `/users/:username` | `UserProfile.jsx` | Yes | `getUserProfile`, `toggleFollow`, `getProjectsByUsername` |
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
| `/api/user/projects` | `userProject.routes.js` | (see routes file) |
| `/api/upload` | `upload.routes.js` | Image upload endpoint |
| `/api` | `notifications.routes.js` | `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| `/api` | `reviews.routes.js` | `GET /reviews/unread-count`, `PATCH /reviews/:reviewId/read` |
| `/api/support` | `support.routes.js` | `POST /` |
| `/api/chat` | `chatRoutes.js` | `POST /send`, `GET /conversations`, `GET /messages/:conversationId`, `GET /unread-count`, `PATCH /messages/:conversationId/read`, `GET /user/:userId` |
| `/api/stats` | `stats.routes.js` | `GET /` |

---

## 4. Static/Mock Data Audit

### Hardcoded Static Data Found

| Location | Type | Value | Impact |
|----------|------|-------|--------|
| `ExploreProjects.jsx:29-40` | Category chips | `["All", "Full Stack", "Frontend", "Backend", "MERN", "React", "Next.js", "Node.js", "TypeScript", "Tailwind"]` | **Medium** — Filters work client-side against project techStack |
| `ExploreProjects.jsx:589-591` | Badge assignment | `["Trending", "New", "Staff Pick"]` cyclic | **High** — Badges are purely visual rotation, not data-driven |
| `ExploreProjects.jsx:190-191` | Trending filter logic | `(project.likes?.length \|\| 0) > 2 \|\| parseFloat(project.averageRating \|\| 0) >= 4.0` | **Medium** — Hardcoded thresholds |
| `MyProjects.jsx` (score calc) | Score formula | `Math.floor((likesCount*4)+(reviewsCount*3)+12)` | **Medium** — Hardcoded weights |
| `Dashboard.jsx:392-399` | Community Rank sidebar | Static text "Give reviews and share projects to increase your visibility" | **Low** — Decorative, but shows static rank placeholder |
| `Community.jsx:33-38` | Highlights | `["Share projects", "Explore other developers' work", ...]` | **Low** — Marketing copy, acceptable |
| `Community.jsx:40-59` | Feature cards | `["Showcase Projects", "Get Feedback", "Learn & Improve"]` | **Low** — Static marketing page |
| `Dashboard.jsx:288` | Default thumbnail | `"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"` | **Low** — Unsplash fallback |
| `Project.jsx:407-412` | Trending badge | `likesCount > 5` triggers "Trending" badge | **Medium** — Hardcoded threshold |
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
| 3. Read All (Explore) | `getExploreProjects()` → `GET /api/projects/explore` | `getExploreProjects` → all projects with owner populate | ✅ |
| 4. Read One | `getProjectById()` → `GET /api/projects/:id` | `getProjectById` → populates owner, computes avg rating | ✅ |
| 5. Get for Edit | `getProjectDetails()` → `GET /api/projects/:id/edit` | `getProjectForEdit` → ownership check | ✅ |
| 6. Update | `updateProject()` → `PUT /api/projects/:id/edit` | `updateProject` → ownership check, partial update | ✅ |
| 7. Delete | `deleteProject()` → `DELETE /api/projects/:id` | `deleteProject` → ownership check, deleteOne | ✅ |

#### Like/Save Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Toggle Like | `toggleLikes()` → `POST /api/projects/:id/like` | `toggleLikes` → adds/removes from likes[], creates Notification | ✅ |
| 2. Toggle Save | `toggleSaveProject()` → `POST /api/projects/:projectId/save` | `toggleSaveProject` → adds/removes from user.savedProjects | ✅ |
| 3. Get Saved | `getSavedProjects()` → `GET /api/projects/saved/me` | `getSavedProjects` → populates savedProjects with owner | ✅ |

#### Review Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. Get Reviews | `getReviews()` → `GET /api/projects/:id/review` | `getReviews` → finds by project, populates user | ✅ |
| 2. Add Review | `addReviews()` → `POST /api/projects/:id/review` | `addReviews` → self-review check, unique constraint, creates Notification | ✅ |
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
| 4. Weekly Digest | Frontend saves preference | **No backend consumer** | ❌ **Missing** |

#### Profile Flow
| Step | Frontend | Backend | Status |
|------|----------|---------|--------|
| 1. View Other User | `getUserProfile()` → `GET /api/users/:username` | `getUserProfile` → optionalAuth, computes totalProjects/Likes/Reviews, activity feed | ✅ |
| 2. Follow/Unfollow | `toggleFollow()` → `POST /api/users/:username/follow` | `toggleFollow` → updates both users' followers/following, creates Notification | ✅ |
| 3. Get All Users | `getAllUsers()` → `GET /api/users/` | `getAllUsers` → N+1 query pattern (see Security section) | ⚠️ |
| 4. Get Followers | `getFollowers()` → `GET /api/users/:username/followers` | `getFollowers` → populates followers | ✅ |
| 5. Get Following | `getFollowing()` → `GET /api/users/:username/following` | `getFollowing` → populates following | ✅ |

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
| **Community page stats** | Static feature cards | No dynamic data fetched | Page feels empty |
| **ExploreProjects `isSaved`** | Toggle saves state optimistically | `getExploreProjects` does NOT return `isSaved` field | Save button state incorrect on page reload |
| **Dashboard "Community Rank"** | Shows static sidebar | No ranking/leaderboard API exists | Placeholder content |
| **Profile image upload on Settings** | Settings page doesn't support image upload | Upload API exists | Gap in Settings vs MyProfile |

---

## 6. Interactive Elements Audit

| Element | Location | Behavior | API Connected | Status |
|---------|----------|----------|---------------|--------|
| Like Button (Project) | `Project.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Like Button (Explore) | `ExploreProjects.jsx` | Toggle, optimistic UI, refetch | Yes | ✅ |
| Like Button (MyProfile) | `MyProfile.jsx` | Toggle, optimistic UI | Yes | ✅ |
| Save/Bookmark (Project) | `Project.jsx` | Toggle, optimistic UI | Yes | ✅ |
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
| Trending Badge (Project) | `Project.jsx` | `likesCount > 5` | ⚠️ Hardcoded |
| Trending/New/Staff Pick (Explore) | `ExploreProjects.jsx` | Cyclic `index % 3` | ❌ Fake/Static |
| MyProjects Score | `MyProjects.jsx` | `Math.floor((likesCount*4)+(reviewsCount*3)+12)` | ⚠️ Hardcoded formula |

### Badge Accuracy Issues

1. **ExploreProjects badges** (`ExploreProjects.jsx:589-591`): "Trending", "New", "Staff Pick" badges are assigned by array rotation (`index % 3`), not by actual data. This is misleading.

2. **Project.jsx Trending badge** (`Project.jsx:407-412`): Triggered by `likesCount > 5`. This is a reasonable heuristic but hardcoded.

3. **MyProjects score** (`MyProjects.jsx`): Formula `Math.floor((likesCount*4)+(reviewsCount*3)+12)` uses hardcoded weights. The `+12` constant means even projects with 0 likes/reviews get a score of 12.

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
| Self-review prevention | `userId === project.owner.toString()` check | `reviewController.js:22-27` |
| Rating range (1-5) | Schema min/max + controller check | `Review.js:17-20`, `reviewController.js:28-33` |
| Non-empty review text | Trim + length check | `reviewController.js:35-40` |
| Review ownership for edit/delete | `user: userId` in query | `reviewController.js:141-144` |
| Owner can't review own project | Owner check | `reviewController.js:22-27` |

### Review Notification
- When a review is added, a notification is created IF the project owner has `notificationPreferences.reviewAlerts !== false` (`reviewController.js:61-69`)
- **Issue**: Like notifications and follow notifications do NOT check notification preferences — they always create notifications

### Review Read/Unread
- `isRead` field on Review model, default `false`
- `getUnreadReviewCount` counts reviews where `isRead: false` on user's projects
- `markReviewAsRead` checks user owns the project before marking
- Sidebar badge shows unread review count
- ReviewsReceived page shows reviews with mark-as-read on click

### Average Rating Calculation
- Done in multiple places: `getProjectById`, `getMyProjects`, `getExploreProjects`, `getProjectByUsername`
- Each computes `totalRating / reviewsCount` separately — **duplicated logic**
- Frontend also computes avg in `Project.jsx:266`

---

## 10. Notifications Audit

### Notification Types
| Type | Trigger | Creates Notification | Checks Preferences |
|------|---------|---------------------|-------------------|
| `like` | `toggleLikes` in `projectController.js:342-347` | Yes (when liking, not unliking) | ❌ No |
| `review` | `addReviews` in `reviewController.js:63-69` | Yes | ✅ Yes (checks reviewAlerts) |
| `follow` | `toggleFollow` in `userController.js:102-106` | Yes (when following, not unfollowing) | ❌ No |

### Notification Preferences
- `reviewAlerts` (default: true) — checked before creating review notification
- `weeklyDigest` (default: true) — saved in DB but **no consumer** (no email job)

### Notification Display
- `Notifications.jsx` fetches all notifications, shows sender name/image, type icon, project title
- Click marks individual notification as read
- "Mark all as read" button marks all unread as read
- Unread count shown as sidebar badge

### Issues
1. **Like/follow notifications ignore preferences**: Even if user disables reviewAlerts, they still get like and follow notifications
2. **weeklyDigest has no effect**: Preference is saved but nothing reads it
3. **No notification deletion**: Notifications accumulate indefinitely
4. **No pagination**: All notifications loaded at once

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
3. **`getFollowers`/`getFollowing` have NO auth** — public but no `optionalAuth`
4. **Google auth auto-creates users** with auto-generated username — no email verification needed
5. **`getAllUsers` excludes current user** via `$ne: req.user.id` — correct
6. **Token refresh not implemented** — user must re-login after 7 days

### Password Security
- Bcrypt with salt rounds 10 ✅
- Password change requires current password verification ✅
- Google accounts can't change password (blocked in `changePassword`) ✅
- Password not returned in any API response (`.select("-password")`) ✅

---

## 12. Profiles Audit

### My Profile (`/profile/my`)
- **Data source**: AuthContext (`user`) + `getMyProjects()` + `getSavedProjects()`
- **Stats computed locally**: projects count, reviews sum, likes sum, followers/following from user object
- **Profile completion**: Weighted percentage (profileImage 20%, bio 20%, skills 20%, role 10%, githubUrl 10%, portfolioUrl 10%, name 5%, username 5%)
- **Edit mode**: Inline form with image upload via `/api/upload` (Cloudinary)
- **Skills**: Stored as comma-separated string, parsed to array on save

### Other User Profile (`/users/:username`)
- **Data source**: `GET /api/users/:username` → returns user, totalProjects, totalLikes, totalReviews, followersCount, followingCount, isFollowing, activity[]
- **Activity feed**: Last 10 projects + last 10 authored reviews, merged and sorted by date, limited to 15
- **Follow/Unfollow**: Toggle via `POST /api/users/:username/follow`
- **Projects tab**: `GET /api/projects/username/:username` via `getProjectsByUsernameApi`

### Profile Issues
1. **MyProfile stats don't match Dashboard stats**: MyProfile computes locally from loaded projects; Dashboard gets stats from `getCurrentUserReview` API
2. **Profile completion uses `user` from AuthContext**: May be stale if user updated profile elsewhere
3. **Image upload on MyProfile** uses direct fetch to `/api/upload` instead of a service function — inconsistent pattern

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

**Note**: This enrichment is duplicated across 4 controllers.

### Project Score (Frontend)
`MyProjects.jsx` calculates a score: `Math.floor((likesCount*4)+(reviewsCount*3)+12)`
- This score is NOT stored in the database
- The `+12` base means every project starts at score 12
- Weights (4 for likes, 3 for reviews) are arbitrary

---

## 14. Likes & Follows Audit

### Like System
- **Storage**: `likes` array on Project model (array of User ObjectIds)
- **Toggle**: Adds/removes user ID from array
- **Notification**: Created when liking (not when unliking), no preference check
- **Optimistic UI**: Frontend toggles state before API call, reverts on failure
- **Uniqueness**: Implicit — `some()` check prevents duplicates

### Follow System
- **Storage**: `followers` and `following` arrays on User model
- **Toggle**: Adds/removes from both users' arrays simultaneously
- **Self-follow prevention**: Backend checks `targetUser._id.toString() === currentUserId`
- **Notification**: Created when following (not when unfollowing), no preference check
- **No follow limit**: Users can follow unlimited accounts

### Issues
1. **Like notification doesn't check preferences**: Should respect `reviewAlerts` or have its own preference
2. **Follow notification doesn't check preferences**: Always creates notification
3. **No bulk operations**: Can't like/follow multiple items at once
4. **N+1 query in `getAllUsers`**: For each user, runs separate queries for projects, likes, reviews

---

## 15. Loading/Error/Empty States

### Loading States

| Page/Component | Loading Implementation | Quality |
|----------------|----------------------|---------|
| Dashboard | Skeleton with pulsing placeholders | ✅ Good |
| MyProfile | Skeleton with pulsing placeholders | ✅ Good |
| UserProfile | Loading check (brief 600ms delay) | ⚠️ Artificial delay |
| ExploreProjects | Shimmer skeleton cards (6 items) | ✅ Good |
| Single Project | `ProjectSkeleton` with shimmer | ✅ Good |
| EditProject | "Checking authorization..." spinner | ✅ Good |
| CreateProjects | None visible | ❌ Missing |
| Settings | No explicit loading state | ❌ Missing |
| Notifications | No explicit loading state | ❌ Missing |
| ReviewsReceived | No explicit loading state | ❌ Missing |
| Chat | No explicit loading state | ❌ Missing |
| SavedProjects | Pulsing skeleton | ✅ Good |
| ExploreUsers | No explicit loading state | ❌ Missing |

### Error States

| Page/Component | Error Implementation | Quality |
|----------------|---------------------|---------|
| Dashboard | try/catch with console.error only | ❌ No user-facing error |
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
| Notifications (No Notifications) | No explicit empty state | ❌ Missing |
| Messages (No Conversations) | No explicit empty state | ❌ Missing |
| ReviewsReceived (No Reviews) | No explicit empty state | ❌ Missing |

---

## 16. Database/Model Audit

### Models Summary

| Model | Fields | Indexes | Relationships |
|-------|--------|---------|---------------|
| Users | name, username, email, password, authProvider, googleId, role, profileImage, bio, skills[], githubUrl, portfolioUrl, isVerified, savedProjects[], followers[], following[], notificationPreferences | username (unique), email (unique), googleId (unique, sparse) | Owner of Projects, author of Reviews, participant in Conversations |
| Projects | title, description, thumbnail, techStack[], githubUrl, liveUrl, owner, likes[] | None explicit | Belongs to Users, has many Reviews |
| Reviews | project, user, rating, review, isEdited, isRead | Compound unique: {project, user} | Belongs to Projects and Users |
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
| Reviews | `{ project: 1, createdAt: -1 }` | getReviews sorts by date |
| Projects | `{ owner: 1, createdAt: -1 }` | getMyProjects sorts by date |

### Data Integrity
- **No cascade deletes**: Deleting a project doesn't delete its reviews, notifications, or saved references
- **No soft delete**: Hard delete only — data permanently removed
- **Orphaned savedProjects**: If a project is deleted, user.savedProjects still references it
- **Orphaned notifications**: If a user is deleted, notifications referencing them remain

---

## 17. Security Audit

### Critical Issues

| # | Issue | Location | Severity | Description |
|---|-------|----------|----------|-------------|
| 1 | **No rate limiting** | `server.js` | 🔴 High | No rate limiting on any endpoint — vulnerable to brute force on login, OTP, forgot-password |
| 2 | **No CSRF protection** | `server.js` | 🔴 High | Cookie-based auth without CSRF tokens — vulnerable to cross-site request forgery |
| 3 | **OTP brute force** | `auth.controller.js:77-121` | 🔴 High | No attempt limiting on OTP verification — attacker can brute force 6-digit OTP |
| 4 | **No input sanitization** | All controllers | 🟡 Medium | No XSS protection on user-generated content (reviews, bios, project descriptions) |
| 5 | **N+1 query vulnerability** | `userController.js:176-223` | 🟡 Medium | `getAllUsers` runs O(n) queries for each user — potential DoS with many users |
| 6 | **Missing HTTP security headers** | `server.js` | 🟡 Medium | No helmet.js or equivalent — missing X-Frame-Options, CSP, etc. |
| 7 | **Console.log in production** | Multiple frontend services | 🟡 Medium | `console.log(error)` in catch blocks may leak sensitive info |
| 8 | **No request body size limit** | `server.js` | 🟡 Medium | `express.json()` without limit — vulnerable to large payload attacks |

### Moderate Issues

| # | Issue | Location | Severity | Description |
|---|-------|----------|----------|-------------|
| 9 | **JWT in cookie without rotation** | `generateToken.js` | 🟡 Medium | Same token for 7 days, no refresh mechanism |
| 10 | **Password not validated for length on signup** | `auth.controller.js:35` | 🟡 Medium | Bcrypt hashes whatever password is sent — no minimum length check |
| 11 | **No email validation format** | `auth.controller.js` | 🟡 Medium | Email format not validated before DB insert |
| 12 | **Username not sanitized** | `auth.controller.js` | 🟢 Low | No character restrictions on username beyond unique |
| 13 | **CORS allows localhost:3000** | `server.js:24-27` | 🟢 Low | Development URL in production CORS list |

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

| File | Line(s) | Description |
|------|---------|-------------|
| `projectController.js.js` (double .js) | Filename | Filename has double `.js` extension — potential import confusion |
| `reviewController.js:169-207` | `getReviewForEdit` | Controller function exists but is NEVER called from any route |
| `userController.js:124-174` | `getFollowers`, `getFollowing` | Routes exist (`GET /:username/followers`, `GET /:username/following`) but NO frontend component calls them |
| `userProject.routes.js` | Entire file | Mounted at `/api/user/projects` but appears to duplicate projectRoutes — needs investigation |
| `Dashboard.jsx:392-399` | Community Rank sidebar | Static placeholder content — not connected to any data |
| `ExploreProjects.jsx:83` | `isPinned` state | Used only for scroll-based pinned search bar — minor but worth noting |
| `MyProfile.jsx:121` | `user.GitBranchUrl` | Fallback for `githubUrl` references a field name that doesn't exist on the model |

### Duplicate Code

| Pattern | Locations | Description |
|---------|-----------|-------------|
| Project enrichment (likes/reviews/rating) | `projectController.js.js` lines 49-93, 142-190, 368-434, 95-140 | Same enrichment logic in `getMyProjects`, `getExploreProjects`, `getProjectByUsername`, `getProjectById` |
| Average rating calculation | `projectController.js.js` + `Project.jsx:266` | Backend computes in 4 places, frontend computes again |
| `toggleLikes` API | `toggleLikesApi.js` | `console.log(id)` left in production code |
| `toggleFollow` API | `followApi.js` | No error handling — just `console.log(error)` and returns undefined |
| `getStats` API | `statsApi.js` | No error handling — returns undefined on failure |
| `toggleSaveProject` API | `savedProjectsApi.js` | No error handling — returns undefined on failure |
| `supportRequestsApi` | `supportApis.js` | Needs verification for error handling |
| Image upload fetch | `MyProfile.jsx:208-219` | Direct `fetch` call instead of using a service function |
| Shimmer CSS | `ExploreProjects.jsx:265-275`, `Project.jsx:271-289` | Same CSS defined in two components |

### Unused Imports (Potential)
- `ExploreProjects.jsx`: `GitBranch` imported but only used for GitHub link icons
- Multiple components import `formatSkill` but it's a simple utility

---

## 19. Already Complete Features

These features are fully implemented, dynamically connected, and production-ready:

| # | Feature | Evidence |
|---|---------|----------|
| 1 | **Email/Password Registration with OTP** | Full flow: signup → OTP email → verify → login |
| 2 | **Google OAuth Login** | Auto-creates user, sets isVerified, generates JWT |
| 3 | **Forgot Password with OTP** | Full flow: email → OTP → reset password |
| 4 | **JWT Cookie Authentication** | HTTP-only, secure, SameSite, 7-day expiry |
| 5 | **Project CRUD** | Create, read (my/explore/by-id), update (ownership check), delete (ownership check) |
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
| 16 | **Explore Projects** | Search, category filter, stats cards |
| 17 | **Explore Users** | User listing with stats, follow/unfollow |
| 18 | **Dashboard** | Projects list, reviews received, stats summary |
| 19 | **Support Requests** | Form with validation, creates Support document |
| 20 | **Platform Stats** | Users, projects, reviews counts |
| 21 | **Saved Projects Page** | Dedicated page with remove functionality |

---

## 20. Partially Complete Features

| # | Feature | What's Done | What's Missing |
|---|---------|-------------|----------------|
| 1 | **Notification Preferences** | Settings UI saves `reviewAlerts` and `weeklyDigest` | `weeklyDigest` has no consumer; like/follow notifications ignore preferences |
| 2 | **Community Page** | Beautiful landing page with feature cards, support modal | No dynamic content (member count, recent activity, trending projects) |
| 3 | **ExploreProjects `isSaved` state** | Toggle works optimistically | Backend `getExploreProjects` doesn't return `isSaved` — incorrect state on reload |
| 4 | **Dashboard Community Rank** | Sidebar with placeholder text | No ranking/leaderboard API or algorithm |

---

## 21. Must Become Dynamic

| # | Current State | Required Change | Priority |
|---|---------------|----------------|----------|
| 1 | ExploreProjects badges are cyclic rotation | Base badges on actual data (likes count, recency, admin pick) | High |
| 2 | MyProjects score uses hardcoded formula | Store score in DB or make weights configurable | Medium |
| 3 | Trending threshold hardcoded as `likesCount > 5` | Use a dynamic threshold based on platform averages | Medium |
| 4 | Community page is entirely static | Fetch and display platform stats, recent projects, top contributors | Medium |
| 5 | Dashboard "Community Rank" is placeholder | Implement ranking algorithm or remove placeholder | Low |
| 6 | Category chips in ExploreProjects are hardcoded | Derive from actual techStack values across all projects | Low |
| 7 | Average rating computed in 5+ places | Centralize in backend response, single source of truth | High |

---

## 22. Priority List

### P0 — Critical (Fix Immediately)
1. Add rate limiting to auth endpoints (login, signup, OTP, forgot-password)
2. Add CSRF protection for cookie-based auth
3. Add OTP attempt limiting (max 5 attempts)
4. Fix `getExploreProjects` to return `isSaved` field
5. Fix `getAllUsers` N+1 query (use aggregation pipeline)

### P1 — High (Fix Before Launch)
1. Add request body size limit to `express.json()`
2. Add helmet.js for security headers
3. Remove `console.log` statements from production code
4. Fix `projectController.js.js` double extension filename
5. Centralize average rating calculation (backend only)
6. Make ExploreProjects badges data-driven
7. Add cascade delete or orphan cleanup for deleted projects
8. Add notification preference checks for like/follow notifications

### P2 — Medium (Fix Soon)
1. Add message pagination to chat
2. Add notification pagination
3. Add loading states to Settings, Notifications, ReviewsReceived, Chat, ExploreUsers
4. Add empty states to Notifications, Messages, ReviewsReceived
5. Add user-facing error states to Dashboard, CreateProjects
6. Implement `weeklyDigest` email sending or remove the preference
7. Add TTL index on OTP collection for auto-cleanup
8. Add database indexes for Messages, Notifications, Reviews

### P3 — Low (Nice to Have)
1. Add WebSocket for real-time chat
2. Add typing indicators
3. Add online/offline status
4. Add soft delete for projects
5. Add image/file sharing in chat
6. Add JWT token rotation/refresh
7. Implement Community page dynamic content
8. Implement ranking/leaderboard
9. Derive category chips from actual data

---

## 23. Implementation Phases

### Phase 1: Security Hardening (1-2 days)
- [ ] Install and configure `express-rate-limit`
- [ ] Add rate limiting to `/api/auth/*` routes
- [ ] Install and configure `helmet`
- [ ] Add `express.json({ limit: '10mb' })`
- [ ] Add CSRF middleware (e.g., `csrf-csrf` or double-submit cookie)
- [ ] Add OTP attempt tracking (max 5 per email)
- [ ] Remove all `console.log` from frontend service files

### Phase 2: Bug Fixes (1-2 days)
- [ ] Rename `projectController.js.js` to `projectController.js`
- [ ] Fix `getExploreProjects` to include `isSaved` field per user
- [ ] Fix `getAllUsers` to use aggregation instead of N+1
- [ ] Fix `getFollowers`/`getFollowing` routes to use `optionalAuth` or `authMiddleware`
- [ ] Fix orphaned `savedProjects` when project is deleted
- [ ] Remove unused `getReviewForEdit` controller or wire it up

### Phase 3: UX Improvements (2-3 days)
- [ ] Add loading skeletons to Settings, Notifications, Chat, ExploreUsers
- [ ] Add empty states to Notifications, Messages, ReviewsReceived
- [ ] Add error boundaries to Dashboard, CreateProjects
- [ ] Make ExploreProjects badges data-driven
- [ ] Centralize average rating in backend responses
- [ ] Add database indexes for Messages, Notifications, Reviews, OTP

### Phase 4: Feature Completion (3-5 days)
- [ ] Implement `weeklyDigest` email or remove preference
- [ ] Add notification preference checks for like/follow
- [ ] Add message pagination (infinite scroll)
- [ ] Add notification pagination
- [ ] Implement cascade delete or orphan cleanup
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
- [ ] Security headers enabled
- [ ] Database indexes created
- [ ] Error handling consistent across all controllers
- [ ] No `console.log` in production controllers

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
- [ ] Indexes created for Messages, Notifications, Reviews, OTP
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

---

## 25. Summary Statistics

| Metric | Count |
|--------|-------|
| Frontend Pages | 15 |
| Backend Route Groups | 10 |
| Backend Controllers | 8 |
| MongoDB Models | 8 |
| Frontend API Services | 14 |
| Frontend Components | 20+ |
| API Endpoints | ~45 |
| Security Issues Found | 8 |
| Dead Code Locations | 6 |
| Duplicate Code Patterns | 8 |
| Missing Loading States | 6 |
| Missing Empty States | 3 |
| Missing Error States | 2 |
| Features Complete | 21 |
| Features Partial | 4 |
| Features Static | 3 |

---

*End of Audit Report*
