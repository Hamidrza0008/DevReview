<div align="center">

# 🚀 DevReview

### Showcase your projects. Get real feedback. Grow as a developer.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2F6F4E?style=for-the-badge)](#-tech-stack)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

**[🌐 Live App](https://dev-re-view.vercel.app/) · [📂 Repository](https://github.com/Hamidrza0008/DevReiview) · [🐛 Report Bug](https://github.com/Hamidrza0008/DevReiview/issues)**

</div>

---

## 📌 About

DevReview is a full-stack platform where developers upload their projects, get honest reviews from the community, and build a public profile — instead of letting good work sit unnoticed in a GitHub repo.

Built with the MERN stack + Next.js, with a strong focus on clean UX, security, and a fast, mobile-optimized interface.

---

## ✨ Features

| | |
|---|---|
| 🔐 **Auth** | Email + OTP verification, Google Sign-In, JWT in HTTP-only cookies, forgot/reset password |
| 👤 **Profiles** | Public developer profiles, editable bio/skills/links, avatar upload via Cloudinary |
| 🧑‍🤝‍🧑 **Follow System** | Follow/unfollow developers, live followers & following counts on profile, dashboard & explore cards |
| 📁 **Projects** | Create, edit, delete, and showcase projects with tech stack, live demo & repo links |
| ⭐ **Reviews** | Add, edit, delete reviews on projects; like and bookmark projects you love |
| 🧭 **Discovery** | Explore Projects and Explore Developers feeds with search, filters & sorting |
| 📊 **Dashboard** | Personal stats — projects, likes, reviews given/received, followers/following |
| 📱 **Mobile-Optimized** | Responsive UI with reduced animation/blur load and `next/image` optimization for low-end devices |

---

## 🛠 Tech Stack

**Frontend** — Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · Lucide Icons

**Backend** — Node.js · Express · MongoDB Atlas + Mongoose · JWT · bcrypt · Multer

**Services** — Cloudinary (media) · Resend (transactional email) · Google OAuth (sign-in)

**Deployment** — Vercel (frontend) · Render (backend) · MongoDB Atlas

---

## 📂 Project Structure

```text
DevReview/
├── frontend/          Next.js App Router UI
│   ├── app/            Routes: auth, dashboard, projects, users, profile, settings
│   ├── Components/     Page-level & shared UI components
│   ├── context/        AuthContext — global session state
│   └── services/       Typed fetch wrappers per API resource
│
└── backend/           Express REST API (MVC)
    ├── config/          DB & Cloudinary setup
    ├── controllers/     Business logic
    ├── middleware/       Auth (required + optional) & upload
    ├── models/           User, Project, Review, OTP
    └── routes/           REST endpoints
```

---

## ⚙️ Getting Started

```bash
git clone https://github.com/Hamidrza0008/DevReiview.git
cd DevReiview

# install both apps
cd frontend && npm install
cd ../backend && npm install
```

**`backend/.env`**
```env
PORT=5000
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
```

**`frontend/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

```bash
# run each in its own terminal
cd backend && npm run dev
cd frontend && npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🌐 API Reference

Base URL: `/api` · All protected routes require the `token` HTTP-only cookie.

<details>
<summary><b>Show all endpoints</b></summary>

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register + send OTP |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/login` | Email/password login |
| POST | `/auth/google` | Google Sign-In |
| POST | `/auth/forgot-password` / `reset-password` | Password recovery |
| GET / PATCH | `/auth/me` | Get / update current user |
| POST | `/auth/logout` | Logout |

**Users & Follow**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List developers (excludes self) |
| GET | `/users/:username` | Public profile + follow status |
| POST | `/users/:username/follow` | Follow / unfollow |
| GET | `/users/:username/followers` \| `/following` | List followers / following |

**Projects & Reviews**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects` | Create project |
| GET | `/projects/my` \| `/explore` | My projects / explore feed |
| GET / PUT / DELETE | `/projects/:id` | Read / update / delete |
| POST | `/projects/:id/like` \| `/save` | Like or bookmark |
| GET | `/projects/saved/me` | Saved projects |
| POST / GET / PUT / DELETE | `/projects/:id/review` | Manage reviews |

**Misc**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload` | Upload image to Cloudinary |
| GET | `/stats` | Platform-wide stats |

</details>

---

## 🔒 Security

- JWT stored in **HTTP-only cookies** — inaccessible to client-side JS (XSS-resistant)
- Passwords hashed with **bcrypt**, never stored in plain text
- Email **OTP verification** blocks fake/spam signups
- Uploads go straight to **Cloudinary** — only the URL touches the database
- **CORS** locked to known frontend origins only

---

## 🗺️ Roadmap

- [ ] Community discussions & activity feed
- [ ] Real-time notifications & direct messaging
- [ ] Developer achievements & reputation system
- [ ] AI-powered project recommendations
- [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

1. Fork the repo & create a feature branch
2. Make your changes, following the existing structure/conventions
3. Open a Pull Request

---

<div align="center">

## 👨‍💻 Author

**Hamid Rza**

[![GitHub](https://img.shields.io/badge/GitHub-Hamidrza0008-181717?style=flat&logo=github)](https://github.com/Hamidrza0008)

Licensed under **MIT** — ⭐ star the repo if DevReview was useful to you!

</div>
