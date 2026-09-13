<div align="center">

# 🚀 DevReview

### Showcase your projects. Get real feedback. Level up as a developer.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2F6F4E?style=for-the-badge)](#-tech-stack)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](#-tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

**[🌐 Live Demo](https://dev-re-view.vercel.app/) · [📂 GitHub Repo](https://github.com/Hamidrza0008/DevReiview) · [🐛 Report Bug](https://github.com/Hamidrza0008/DevReiview/issues)**

</div>

---

## 📌 Overview

**DevReview** is a full-stack developer community platform where builders showcase their projects, receive honest peer reviews, chat 1-on-1, and build their public engineering portfolio — ensuring great code never stays buried in a forgotten repository.

Built with a focus on clean UX, robust security, fast API response times, and full responsiveness across devices.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🔐 **Authentication & Security** | Email + OTP verification, Google OAuth 2.0, JWT in HTTP-only cookies, Rate Limiting & Helmet headers |
| 📁 **Project Showcase** | Create, edit, and feature projects with tech stacks, live demo URLs, screenshots, and repository links |
| ⭐ **Reviews & Ratings** | Peer reviews with star ratings, constructive feedback, and review management |
| 💬 **Direct Messaging** | 1-on-1 developer conversations with message history and unread indicators |
| 🔔 **Notification Center** | In-app notifications for reviews, messages, follows, and interactions |
| 🏆 **Leaderboard** | Community rankings for top developers and highest-rated projects |
| 👤 **Developer Profiles** | Public portfolio pages featuring tech skills, bio, social links, and project lists |
| 🧑‍🤝‍🧑 **Follow Network** | Follow your favorite developers and track community activity |
| ❤️ **Likes & Bookmarks** | Save inspiring projects to your personal collection |
| 🧭 **Discovery & Search** | Filter projects and devs by tech tags, popularity, ratings, or recency |
| 📊 **Creator Dashboard** | Real-time analytics on views, reviews given/received, likes, and followers |
| 🌓 **Modern UI/UX** | Dark & Light theme toggle, smooth Framer Motion micro-animations, mobile-first design |

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server**: Express 5
- **Database**: MongoDB Atlas via Mongoose 9
- **Security**: Helmet, Express-Rate-Limit, bcrypt, HTTP-only Cookies
- **File Uploads**: Multer + Cloudinary Storage

### Third-Party Services
- **Cloudinary**: Optimized media asset storage & CDN delivery
- **Resend & Nodemailer**: Transactional emails & OTP verification
- **Google Cloud OAuth**: Single Sign-On (SSO) authentication

---

## 🗂 Project Structure

```text
devreview/
├── frontend/                  # Next.js 16 Client Application
│   ├── app/                   # App Router pages & layouts
│   │   ├── (public)/          # Landing page & auth routes (login, register, OTP)
│   │   └── (devreviewapp)/    # Dashboard, projects, profile, messages, leaderboard, notifications
│   ├── Components/            # Modular & reusable UI components
│   ├── context/               # AuthContext, ThemeContext, ToastContext
│   └── services/              # Client-side API service layers
│
└── backend/                   # Express 5 REST API
    ├── config/                # Database & Cloudinary configurations
    ├── controllers/           # Business logic & request handlers
    ├── middleware/            # JWT authentication, rate limiting, and upload handlers
    ├── models/                # Mongoose schemas (User, Project, Review, Chat, Notification, etc.)
    ├── routes/                # REST endpoints
    └── utils/                 # Email templates, OTP helpers, and token handlers
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Hamidrza0008/DevReiview.git
cd DevReiview
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Service (Resend or Nodemailer)
RESEND_API_KEY=your_resend_api_key
EMAIL=your_sender_email@example.com
APP_PASSWORD=your_email_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run the frontend development server:
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📡 API Endpoints Overview

| Module | Base Path | Key Capabilities |
|---|---|---|
| **Auth** | `/api/auth` | Register, Login, Google Sign-In, OTP Verify, Forgot/Reset Password, Logout |
| **Users** | `/api/users` | User profile, bio & skills update, follow/unfollow, bookmarks |
| **Projects** | `/api/projects` | CRUD projects, upvote, search, filter by tag/sort |
| **Reviews** | `/api/reviews` | Post review, update/delete review, project review metrics |
| **Chat** | `/api/chat` | Conversations list, direct messages, unread message badges |
| **Notifications** | `/api/notifications` | In-app alerts feed, mark as read |
| **Leaderboard** | `/api/leaderboard` | Top rated developers & trending projects |
| **Stats** | `/api/stats` | Platform counters & user dashboard analytics |
| **Upload** | `/api/upload` | Media upload via Cloudinary |

---

## 🔒 Security Practices

- **HTTP-Only Cookies**: JWT tokens are protected against XSS attacks.
- **Strict Helmet Headers & CORS**: Pre-configured headers and locked-down origin access.
- **Rate Limiting**: Protects authentication and critical endpoints against brute-force attacks.
- **Bcrypt Hashing**: Secure salted password encryption.
- **OTP Verification**: Verifies valid email ownership before account activation.

---

## 👨‍💻 Author

**Hamid Rza**
- GitHub: [@Hamidrza0008](https://github.com/Hamidrza0008)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
