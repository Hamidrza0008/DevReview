<div align="center">

# 🚀 DevReview

### Showcase your projects. Get real feedback. Grow as a developer.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2F6F4E?style=for-the-badge)](#-tech-stack)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

**[🌐 Live App](https://dev-re-view.vercel.app/) · [📂 Repository](https://github.com/Hamidrza0008/DevReiview) · [🐛 Report Bug](https://github.com/Hamidrza0008/DevReiview/issues)**

</div>

---

## 📌 Overview

DevReview ek full-stack platform hai jahan developers apne projects upload karte hain, community se honest reviews paate hain, aur apna public profile banate hain — taaki achha kaam GitHub repo me chhupa na rahe.

MERN stack + Next.js ke saath bana, clean UX, security aur mobile-optimized interface par focus.

---

## ✨ Features

| | |
|---|---|
| 🔐 **Auth** | Email + OTP verification, Google Sign-In, JWT in HTTP-only cookies, forgot/reset password |
| 👤 **Profiles** | Public developer profiles, editable bio/skills/links, avatar upload |
| 🧑‍🤝‍🧑 **Follow System** | Follow/unfollow developers, live followers & following counts |
| 📁 **Projects** | Create, edit, delete, and showcase projects with tech stack, demo & repo links |
| ⭐ **Reviews** | Add, edit, delete reviews with star ratings |
| ❤️ **Likes & Bookmarks** | Like and save projects you love |
| 🧭 **Discovery** | Explore Projects & Developers feeds with search, filters & sorting |
| 📊 **Dashboard** | Personal stats — projects, likes, reviews given/received, followers/following |
| 📱 **Responsive** | Dark/light theme, mobile-optimized UI |

---

## 🛠 Tech Stack

**Frontend** — Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · Lucide Icons

**Backend** — Node.js · Express 5 · MongoDB Atlas + Mongoose · JWT · bcrypt · Multer

**Services** — Cloudinary (media) · Resend (transactional email) · Google OAuth (sign-in)

**Deployment** — Vercel (frontend) · Render (backend)

**API** — REST API with **30+ endpoints** covering auth, users, projects, reviews, likes, saves, stats & uploads

---

## 🗂 Project Structure

```text
DevReview/
├── frontend/          Next.js App Router UI
│   ├── app/            Routes: auth, dashboard, projects, users, profile, settings
│   ├── Components/     Page-level & shared UI components
│   ├── context/        AuthContext, ThemeContext, ToastContext
│   └── services/       Fetch wrappers per API resource
│
└── backend/           Express REST API (MVC)
    ├── config/          DB & Cloudinary setup
    ├── controllers/     Business logic
    ├── middleware/       Auth (required + optional) & upload
    ├── models/           User, Project, Review, OTP
    └── routes/           REST endpoints
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/Hamidrza0008/DevReiview.git
cd DevReiview

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
# each in its own terminal
cd backend && npm run dev
cd frontend && npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🔒 Security

- JWT in **HTTP-only cookies** — client-side JS ke liye inaccessible (XSS-resistant)
- Passwords **bcrypt** se hashed
- Email **OTP verification** blocks fake/spam signups
- Uploads directly to **Cloudinary** — DB me sirf URL
- **CORS** locked to known frontend origins

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
