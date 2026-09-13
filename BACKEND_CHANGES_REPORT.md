# Backend Changes Needed for Scalability

## Pagination Support Required

These endpoints currently return **all records** and need pagination added to support large datasets.

### 1. `GET /api/users/explore` — ExploreUsers
- **File**: `backend/controllers/userController.js` → `getAllUsers`
- **Current**: Returns all users at once
- **Needed**: Cursor-based or offset pagination
- **Frontend impact**: `frontend/services/usersApi.js` → `getAllUsers()` called in `ExploreUsers.jsx`
- **Recommendation**: Follow the same cursor pattern as `getExploreProjects` (accept `limit`, `before` params, return `nextCursor`)

### 2. `GET /api/projects/my` — MyProjects
- **File**: `backend/controllers/projectController.js`
- **Current**: Returns all of the user's projects
- **Needed**: Cursor-based pagination
- **Frontend impact**: `frontend/services/getMyProjectsApi.js` → `getMyProjects()` called in `MyProjects.jsx` and `MyProfile.jsx`
- **Recommendation**: Cursor-based with `limit` and `before` params

### 3. `GET /api/projects/saved` — SavedProjects
- **File**: `backend/controllers/savedProjectController.js`
- **Current**: Returns all saved projects
- **Needed**: Cursor-based pagination
- **Frontend impact**: `frontend/services/savedProjectsApi.js` → `getSavedProjects()` called in `SavedProjects.jsx` and `MyProfile.jsx`
- **Recommendation**: Cursor-based with `limit` and `before` params

### 4. `GET /api/conversations` — Conversations list
- **File**: `backend/controllers/chatController.js` → `getConversations`
- **Current**: Returns all conversations
- **Needed**: Cursor-based pagination
- **Frontend impact**: `frontend/services/conversationsApis.js` → `getConversationsApi()` called in `ConversationList.jsx`
- **Recommendation**: Cursor-based (already returns sorted by latest message, natural cursor)

### 5. `GET /api/projects/:id/reviews` — Project Reviews
- **File**: `backend/controllers/reviewController.js` → `getReviews`
- **Current**: Returns all reviews for a project
- **Needed**: Offset pagination (reviews are naturally sorted by date)
- **Frontend impact**: `frontend/services/reviewApi.js` → `getReviews()` called in `Project.jsx`
- **Recommendation**: Page-based with `page`, `limit` params (similar to leaderboard)

---

## Search Support Required

These endpoints would benefit from search query support to complement frontend filtering.

### 1. `GET /api/users/explore` — ExploreUsers
- **Current**: No search — frontend filters client-side
- **Needed**: `?search=` query param for server-side name/username search
- **Priority**: Medium (client-side filter works for small datasets)

### 2. `GET /api/conversations` — Conversations
- **Current**: No search — frontend filters client-side (just added)
- **Needed**: `?search=` query param for server-side participant name search
- **Priority**: Low (client-side filter works fine)

### 3. `GET /api/notifications` — Notifications
- **Current**: Cursor-based but no text search
- **Needed**: `?search=` for filtering by notification message content
- **Priority**: Low

---

## Recommended Implementation Pattern

For cursor-based pagination (follows existing `getExploreProjects` pattern):

```js
// Backend controller
exports.getAllUsers = async (req, res) => {
  const { limit = 20, before } = req.query;
  const query = {};
  if (before) {
    const beforeUser = await User.findById(before);
    if (beforeUser) query._id = { $lt: beforeUser._id };
  }
  const users = await User.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit) + 1);
  const hasMore = users.length > Number(limit);
  const data = hasMore ? users.slice(0, Number(limit)) : users;
  const nextCursor = hasMore ? data[data.length - 1]._id : null;
  res.json({ success: true, users: data, nextCursor });
};
```

For offset-based pagination (for reviews):

```js
// Backend controller
exports.getReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find({ project: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("reviewer", "name username profileImage"),
    Review.countDocuments({ project: req.params.id })
  ]);
  res.json({
    success: true,
    reviews,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) }
  });
};
```
