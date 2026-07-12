<div align="center">

# 🚀 DevReview

### A Modern Developer Community Platform to Showcase Projects, Receive Reviews, and Connect with Developers Worldwide

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](#-tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)
[![Made with ❤](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red?style=for-the-badge)](#-author)

**[🌐 Live Demo](https://dev-reiview.vercel.app/) · [📂 Repository](https://github.com/Hamidrza0008/DevReiview) · [🐛 Report Bug](https://github.com/Hamidrza0008/DevReiview/issues)**

</div>

---

## 📖 Table of Contents

- [About DevReview](#-about-devreview)
- [Why DevReview?](#-why-devreview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Core Flows](#-core-flows)
- [Database Models](#-database-models)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Security](#-security)
- [Performance Optimizations](#-performance-optimizations)
- [Challenges & Learning Outcomes](#-challenges--learning-outcomes)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Author](#-author)
- [License](#-license)

---

## 📌 About DevReview

DevReview is a modern full-stack web application built for developers who want to **showcase their projects, receive valuable feedback, and explore great work created by other developers.**

Instead of keeping projects hidden inside GitHub repositories, DevReview provides a clean, interactive platform where developers can present their work professionally, get discovered, and grow through community feedback.

The project was built with scalability, security, and user experience in mind, following modern full-stack development practices.

---

## 🎯 Why DevReview?

GitHub is excellent for source code management, but it isn't designed to showcase projects visually or encourage community interaction. DevReview bridges that gap:

| | |
|---|---|
| 🚀 | Showcase projects professionally |
| ⭐ | Receive genuine reviews from other developers |
| ❤️ | Like inspiring projects |
| 🔖 | Save projects for future reference |
| 👨‍💻 | Build a public developer profile |
| 🌍 | Explore projects from the developer community |

---

## ✨ Key Features

<table>
<tr>
<td valign="top" width="50%">

**🔐 Authentication**
- Secure registration with email OTP verification
- Login, forgot password & reset password
- JWT auth with HTTP-Only cookies
- Protected routes

**👤 User Profile**
- Public profile pages
- Editable profile info & picture (Cloudinary)
- Personal dashboard

</td>
<td valign="top" width="50%">

**📁 Project Management**
- Create, update, delete projects
- Detailed project view
- Explore community projects

**⭐ Reviews & Engagement**
- Add / edit / delete reviews
- Like & save projects
- Search & filter projects

</td>
</tr>
</table>

---

## 🛠 Tech Stack

**Frontend** — Next.js (App Router) · React.js · Tailwind CSS · Framer Motion · Lucide React

**Backend** — Node.js · Express.js · MongoDB Atlas + Mongoose · JWT · bcrypt · Multer · Cloudinary · Resend

**Deployment** — Vercel (frontend) · Render (backend) · MongoDB Atlas · Cloudinary · Resend

---

## 📂 Project Structure

```text
DevReview/
├── frontend/
│   ├── app/                # Pages & routing (auth, dashboard, explore, profile, project, saved)
│   ├── Components/         # Navbar, Sidebar, Cards, Forms, Modals, Buttons, UI
│   ├── context/             # AuthContext.js — global auth state
│   ├── services/            # authApi.js, projectApi.js, reviewApi.js, uploadApi.js
│   ├── hooks/
│   ├── public/
│   └── utils/
│
├── backend/
│   ├── config/               # DB & Cloudinary configuration
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth & upload middleware
│   ├── models/                # MongoDB models
│   ├── routes/                # REST API endpoints
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## 🏗️ Architecture

DevReview uses a fully decoupled client-server architecture: the frontend handles UI, auth state, and data fetching, while the backend (following the **MVC pattern**) handles authentication, business logic, database operations, and file uploads.

| Layer | Responsibility |
|---|---|
| `app` | Pages & routing |
| `Components` | Reusable UI |
| `context` | Global auth state |
| `services` | API communication |
| `controllers` | Business logic |
| `middleware` | Auth & upload handling |
| `models` | MongoDB schemas |
| `routes` | REST endpoints |

---

## 🔄 Core Flows

<details>
<summary><b>🔐 Signup Flow</b></summary>

```
Fill Signup Form → Submit → Server Validates Data → OTP Generated
→ OTP Sent via Resend → User Enters OTP → OTP Verified → Account Created
```
</details>

<details>
<summary><b>🔑 Login Flow</b></summary>

```
Enter Email & Password → Credentials Verified → JWT Generated
→ HTTP-Only Cookie Created → Authenticated Session → Redirect to Dashboard
```
</details>

<details>
<summary><b>🛡️ Protected Route Flow</b></summary>

```
Request Protected Route → Auth Middleware → JWT Verification
                                              ├── Valid   → Continue
                                              └── Invalid → Unauthorized
```
</details>

<details>
<summary><b>☁️ Image Upload Flow</b></summary>

```
User Selects Image → Multer Middleware → Cloudinary Upload
→ Image URL Generated → MongoDB Stores URL → Frontend Displays Image
```
</details>

<details>
<summary><b>📬 Password Reset Flow</b></summary>

```
Enter Email → Reset Email Sent (Resend) → User Opens Link
→ Create New Password → Password Updated
```
</details>

<details>
<summary><b>📡 Request Lifecycle</b></summary>

```
Client Request → Express Router → Auth Middleware → Controller
→ Business Logic → MongoDB Query → JSON Response → Frontend UI Update
```
</details>

---

## 🗄️ Database Models

| Model | Responsibilities |
|---|---|
| **User** | Auth, profile info & picture, saved projects, account management |
| **Project** | Details, description, tech stack, live demo & repo links, image, likes, reviews, creator |
| **Review** | Content, reviewer info, project reference, timestamps |
| **OTP** | Code, email, expiry, verification status |

---

## 🌐 API Documentation

The backend exposes **30+ REST endpoints** covering authentication, projects, reviews, users, uploads, and stats. All responses are JSON with standard HTTP status codes.

**Base URL:** `http://localhost:5000/api` (dev) · `https://YOUR-RENDER-BACKEND.onrender.com/api` (prod)

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/auth/signup` | Register a new account | ❌ |
| POST | `/auth/verify-otp` | Verify email OTP | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/forgot-password` | Send password reset email | ❌ |
| POST | `/auth/reset-password` | Reset account password | ❌ |
| GET | `/auth/me` | Get logged-in user | ✅ |
| PATCH | `/auth/me` | Update profile info | ✅ |
| POST | `/auth/logout` | Logout user | ✅ |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/users` | Get all users | ✅ |
| GET | `/users/:username` | Get public developer profile | ❌ |

### Projects

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/projects` | Create project | ✅ |
| GET | `/projects/my` | Get my projects | ✅ |
| GET | `/projects/explore` | Explore projects | ✅ |
| GET | `/projects/:id` | Get project details | ✅ |
| GET | `/projects/:id/edit` | Get project for editing | ✅ |
| PUT | `/projects/:id/edit` | Update project | ✅ |
| DELETE | `/projects/:id` | Delete project | ✅ |
| POST | `/projects/:id/like` | Like / unlike project | ✅ |
| POST | `/projects/:projectId/save` | Save / unsave project | ✅ |
| GET | `/projects/saved/me` | Get saved projects | ✅ |
| GET | `/user/projects/:username` | Get projects by username | ❌ |

### Reviews

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/projects/:id/review` | Add review | ✅ |
| GET | `/projects/:id/review` | Get reviews | ✅ |
| PUT | `/projects/:id/review` | Edit review | ✅ |
| DELETE | `/projects/:id/review` | Delete review | ✅ |
| GET | `/projects/my-reviews` | Get current user's reviews | ✅ |

### Upload & Stats

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/upload` | Upload image to Cloudinary | ✅ |
| GET | `/stats` | Get platform statistics | ❌ |

### Response Format

<table>
<tr>
<td>

**Success**
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```
</td>
<td>

**Error**
```json
{
  "success": false,
  "message": "Something went wrong."
}
```
</td>
</tr>
</table>

---

## ⚙️ Getting Started

### 1. Clone & Enter the Project
```bash
git clone https://github.com/Hamidrza0008/DevReiview.git
cd DevReiview
```

### 2. Install Dependencies
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. Configure Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**`backend/.env`**
```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
```

### 4. Run the Project
```bash
# In backend/
npm run dev

# In frontend/ (separate terminal)
npm run dev
```

Visit **http://localhost:3000** in your browser. 🎉

### Deployment Workflow
```
Push to GitHub → Frontend → Vercel │ Backend → Render
→ MongoDB Atlas ⇄ Cloudinary ⇄ Resend → Production Ready
```

---

## 🔒 Security

- **Auth:** JWT stored in HTTP-Only cookies (protects against XSS) + route-level middleware
- **Passwords:** Hashed with bcrypt, never stored in plain text
- **OTP Verification:** Blocks fake accounts, spam signups, and invalid emails
- **API Validation:** Every protected request is verified before processing
- **File Uploads:** Images go straight to Cloudinary — only the URL is stored in MongoDB, keeping the backend lightweight
- **CORS:** Only trusted frontend origins can access the API

---

## ⚡ Performance Optimizations

| Layer | Optimizations |
|---|---|
| **Frontend** | Component-based architecture, optimized API calls, responsive layouts, lightweight animations, Next.js App Router routing |
| **Backend** | Modular MVC design, efficient queries, middleware-based auth, centralized controllers |
| **Database** | MongoDB Atlas — flexible schema, fast reads/writes, cloud-hosted reliability |

---

## 💪 Challenges & Learning Outcomes

Building DevReview involved solving real-world problems around **JWT + HTTP-Only cookie authentication**, a full **OTP email verification workflow** (Resend), **Multer + Cloudinary** image uploads, deploying frontend/backend separately with correct **CORS** configuration, and maintaining global auth state via **React Context**.

Key skills strengthened along the way:

- **Frontend:** Next.js App Router, React, Tailwind CSS, Framer Motion, component architecture
- **Backend:** Node.js, Express, REST API design, MVC architecture, middleware
- **Database:** MongoDB Atlas, Mongoose, schema design, CRUD operations
- **Security:** JWT, HTTP-Only cookies, password hashing, OTP verification
- **Deployment:** Vercel, Render, MongoDB Atlas, Cloudinary, Resend

---

## 🚀 Future Roadmap

- [ ] Community feed & developer activity feed
- [ ] Follow system & notifications
- [ ] Developer achievements & reputation system
- [ ] Project collections & richer profile analytics
- [ ] Real-time notifications & direct messaging
- [ ] AI-powered project recommendations
- [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

Please follow the existing project structure and coding standards.

---

## ❓ FAQ

**Why Next.js?** Server-side capabilities, optimized routing, and a great developer experience for scalable React apps.

**Why MongoDB?** Its flexible document model suits developer profiles, projects, and reviews while scaling easily.

**Why Cloudinary?** Simplifies image storage and optimization without managing local file storage.

**Why Resend?** A reliable, developer-friendly email service for OTP and password-reset flows.

**Is DevReview production-ready?** Yes — it's deployed and follows modern practices: secure auth, cloud storage, responsive UI, and scalable architecture.

---

## 📊 Project Stats

| Category | Details |
|---|---|
| Architecture | MERN Stack |
| REST APIs | 30+ |
| Models | 4 (User, Project, Review, OTP) |
| Major Modules | Auth, Projects, Reviews, User Profiles |

---

## 👨‍💻 Author

**Hamid Rza** — Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Hamidrza0008-181717?style=flat&logo=github)](https://github.com/Hamidrza0008)

---

## 📄 License

Licensed under the **MIT License** — free to use, modify, and distribute in accordance with the license terms.

---

<div align="center">

### ⭐ If you find DevReview helpful, consider giving it a star on GitHub!

**Built with ❤️ by Hamid Rza**

</div>
