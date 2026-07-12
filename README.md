# 🚀 DevReview

> **A Modern Developer Community Platform to Showcase Projects, Receive Reviews, and Connect with Developers Worldwide.**

<!-- Add Banner Image Here -->

<!-- Add Badges Here -->

---

## 📖 Table of Contents

- [About DevReview](#-about-devreview)
- [Why DevReview?](#-why-devreview)
- [Live Demo](#-live-demo)
- [Repository](#-repository)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Preview](#-project-preview)

---

# 📌 About DevReview

DevReview is a modern full-stack web application built specifically for developers who want to showcase their projects, receive valuable feedback, and explore amazing work created by other developers.

Instead of keeping projects hidden inside GitHub repositories, DevReview provides a clean and interactive platform where developers can present their work professionally.

Whether you're a beginner building your first project or an experienced developer creating production-ready applications, DevReview allows you to share your work, receive meaningful reviews, discover inspiring projects, and continuously improve your skills.

The project was developed with scalability, security, and user experience in mind while following modern full-stack development practices.

---

# 🎯 Why DevReview?

Most developers upload projects only to GitHub.

Although GitHub is excellent for source code management, it isn't designed to showcase projects in a visually engaging way or encourage community interaction.

DevReview bridges that gap by providing a dedicated platform where developers can:

- 🚀 Showcase their projects professionally
- ⭐ Receive genuine reviews from other developers
- ❤️ Like inspiring projects
- 🔖 Save projects for future reference
- 👨‍💻 Build a public developer profile
- 🌍 Explore projects from the developer community

The goal is to create a platform that encourages learning, collaboration, and constructive feedback.

---

# 🌐 Live Demo

### Frontend

🔗 https://dev-reiview.vercel.app/

### Backend

Hosted on **Render**

---

# 📂 Repository

GitHub Repository

🔗 https://github.com/Hamidrza0008/DevReiview

---

# ✨ Key Features

## 🔐 Authentication

- Secure User Registration
- Email OTP Verification
- Login System
- Forgot Password
- Reset Password
- JWT Authentication
- HTTP Only Cookie Authentication
- Protected Routes

---

## 👤 User Profile

- View Public Profile
- Update Profile Information
- Upload Profile Picture
- Cloudinary Image Upload
- Personal Dashboard

---

## 📁 Project Management

- Create New Project
- Update Existing Project
- Delete Project
- View Project Details
- Explore Community Projects

---

## ⭐ Reviews & Engagement

- Add Review
- Edit Review
- Delete Review
- Like Projects
- Save Projects
- View Community Feedback

---

## 🔎 Discover

- Search Projects
- Filter Projects
- Explore Developers

---

## ☁️ Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- MongoDB Atlas Database
- Cloudinary Media Storage
- Resend Email Service

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| Next.js (App Router) | Frontend Framework |
| React.js | UI Development |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Fetch API | API Communication |
| Lucide React | Icons |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Cookie Parser | Cookie Management |
| CORS | Secure Cross-Origin Requests |
| Multer | File Upload |
| Cloudinary | Image Storage |
| Resend | Email Service |

---

## 🚀 Deployment Stack

| Service | Usage |
|----------|-------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Database |
| Cloudinary | Image Storage |
| Resend | Email Delivery |

---

# 📸 Project Preview

> **Screenshots will be added here.**

<!-- Home Page Screenshot -->

<!-- Dashboard Screenshot -->

<!-- Explore Page Screenshot -->

<!-- Project Details Screenshot -->

<!-- Profile Screenshot -->

<!-- Saved Projects Screenshot -->

<!-- Review Section Screenshot -->

---

# 📈 Project Highlights

- ✅ Full Stack MERN Architecture
- ✅ Production Deployment
- ✅ Secure Authentication System
- ✅ OTP Verification
- ✅ RESTful API Architecture
- ✅ Cloud-Based Image Storage
- ✅ Responsive User Interface
- ✅ Search & Filter Functionality
- ✅ Project Review System
- ✅ Save & Like Features
- ✅ Public Developer Profiles
- ✅ 30+ REST API Endpoints
- ✅ Clean Folder Structure
- ✅ Scalable Project Architecture

---

> 💡 **DevReview is more than a portfolio project—it's a complete community-driven platform designed to help developers showcase their work, receive meaningful feedback, and connect with other developers through a modern, secure, and scalable web application.**
---

# 📂 Project Folder Structure

The project follows a clean and scalable architecture by separating the frontend and backend into independent applications. This approach makes the project easier to maintain, extend, and deploy.

```text
DevReview/
│
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── profile/
│   │   ├── project/
│   │   ├── saved/
│   │   └── layout.js
│   │
│   ├── Components/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Cards/
│   │   ├── Forms/
│   │   ├── Modals/
│   │   ├── Buttons/
│   │   └── UI/
│   │
│   ├── context/
│   │   └── AuthContext.js
│   │
│   ├── services/
│   │   ├── authApi.js
│   │   ├── projectApi.js
│   │   ├── reviewApi.js
│   │   └── uploadApi.js
│   │
│   ├── hooks/
│   ├── public/
│   └── utils/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🏗️ Project Architecture

DevReview follows a modern client-server architecture where the frontend and backend are completely independent.

The frontend is responsible for rendering the user interface and communicating with backend REST APIs, while the backend handles authentication, business logic, database operations, image uploads, and security.

This separation makes the application scalable, maintainable, and production-ready.

---

## Frontend Architecture

The frontend is built using **Next.js App Router** with reusable React components.

### Responsibilities

- Rendering UI
- Managing Authentication State
- Fetching Data
- Form Validation
- Protected Navigation
- Responsive Layout
- Animations
- User Interactions

### Main Directories

| Folder | Responsibility |
|---------|---------------|
| app | Application Pages & Routing |
| Components | Reusable UI Components |
| context | Global Authentication State |
| services | API Communication |
| hooks | Custom React Hooks |
| public | Static Assets |
| utils | Helper Functions |

---

## Backend Architecture

The backend follows the **MVC (Model View Controller)** architecture.

Each responsibility is separated into its own layer, making the codebase clean and easier to scale.

### Responsibilities

- Authentication
- Authorization
- Business Logic
- Database Operations
- Image Upload
- Email Verification
- API Validation
- Security

### Main Directories

| Folder | Responsibility |
|---------|---------------|
| config | Database & Cloudinary Configuration |
| controllers | Business Logic |
| middleware | Authentication & Upload Middleware |
| models | MongoDB Models |
| routes | REST API Endpoints |
| utils | Utility Functions |

---

# 🧩 MVC Design Pattern

The backend is structured around the MVC architecture.

## Models

Responsible for interacting with MongoDB.

Examples:

- User
- Project
- Review
- OTP

---

## Controllers

Handle the complete business logic.

Examples

- Authentication
- Project Management
- Reviews
- User Profile
- Statistics

---

## Routes

Routes receive HTTP requests and forward them to their respective controllers.

Examples

```text
/api/auth
/api/projects
/api/users
/api/upload
/api/stats
```

---

## Middleware

Middleware is executed before controllers.

Current middleware includes:

- JWT Authentication
- Cookie Verification
- File Upload
- Request Validation

---

# 🔐 Authentication Flow

DevReview implements a secure authentication system using **OTP Verification**, **JWT**, and **HTTP-Only Cookies**.

---

## Signup Flow

```text
User Registration

        │

        ▼

Fill Signup Form

        │

        ▼

Submit Details

        │

        ▼

Server Validates Data

        │

        ▼

OTP Generated

        │

        ▼

OTP Sent via Resend

        │

        ▼

User Enters OTP

        │

        ▼

OTP Verified

        │

        ▼

Account Created Successfully
```

---

## Login Flow

```text
User Login

      │

      ▼

Enter Email & Password

      │

      ▼

Credentials Verified

      │

      ▼

JWT Generated

      │

      ▼

HTTP Only Cookie Created

      │

      ▼

Authenticated User Session

      │

      ▼

Redirect to Dashboard
```

---

## Protected Route Flow

```text
User Requests Protected Route

            │

            ▼

Authentication Middleware

            │

            ▼

JWT Verification

            │

      ┌─────┴─────┐

      │           │

      ▼           ▼

Valid Token   Invalid Token

      │           │

      ▼           ▼

Continue     Unauthorized
```

---

# ☁️ Image Upload Workflow

Profile pictures and project images are stored using **Cloudinary**.

Upload Flow

```text
User Selects Image

        │

        ▼

Frontend Sends File

        │

        ▼

Multer Middleware

        │

        ▼

Cloudinary Upload

        │

        ▼

Image URL Generated

        │

        ▼

MongoDB Stores URL

        │

        ▼

Frontend Displays Image
```

---

# 📬 Password Reset Flow

Forgot password is implemented using **Resend Email API**.

```text
Forgot Password

      │

      ▼

Enter Email

      │

      ▼

Verification Email Sent

      │

      ▼

User Opens Link

      │

      ▼

Create New Password

      │

      ▼

Password Updated Successfully
```

---

# 🗄️ Database Models

The application uses MongoDB Atlas with Mongoose ODM.

---

## 👤 User Model

Stores developer information.

### Responsibilities

- Authentication
- Profile Information
- Profile Picture
- Saved Projects
- Account Management

---

## 📁 Project Model

Stores all uploaded developer projects.

### Responsibilities

- Project Details
- Description
- Technologies
- Live Demo
- GitHub Repository
- Project Image
- Likes
- Reviews
- Creator Information

---

## ⭐ Review Model

Each review belongs to a specific project.

### Responsibilities

- Review Content
- Reviewer Information
- Project Reference
- Created Date
- Updated Date

---

## 🔑 OTP Model

Used during account verification.

### Responsibilities

- OTP Code
- Email
- Expiration Time
- Verification Process

---

# 🔄 Request Lifecycle

Every request in DevReview follows a structured lifecycle.

```text
Client Request

      │

      ▼

Express Router

      │

      ▼

Authentication Middleware

      │

      ▼

Controller

      │

      ▼

Business Logic

      │

      ▼

MongoDB Query

      │

      ▼

Database Response

      │

      ▼

JSON Response

      │

      ▼

Frontend UI Update
```

---

# ⚙️ How Different Components Work Together

| Component | Responsibility |
|------------|---------------|
| Next.js | User Interface |
| React | Interactive Components |
| Context API | Authentication State |
| Fetch API | Backend Communication |
| Express | REST API Server |
| JWT | User Authentication |
| Cookies | Session Management |
| MongoDB Atlas | Database |
| Mongoose | Database Queries |
| Multer | File Processing |
| Cloudinary | Image Hosting |
| Resend | OTP & Password Reset Emails |
| Render | Backend Deployment |
| Vercel | Frontend Deployment |

---

# 🎯 Engineering Principles

While building DevReview, the project was designed around several software engineering principles:

- Clean and modular architecture
- Reusable components
- Separation of concerns
- Secure authentication flow
- RESTful API design
- Scalable folder structure
- Production-ready deployment
- Responsive user interface
- Cloud-based media storage
- Maintainable codebase

These principles make the project easier to extend with future features such as Community Feed, Follow System, Notifications, and other social capabilities without requiring major architectural changes.

---

---

# 🌐 REST API Documentation

DevReview follows a RESTful API architecture where each endpoint is responsible for a single resource or action. All APIs return structured JSON responses and follow standard HTTP status codes.

The backend currently exposes **30+ REST API endpoints**, covering authentication, project management, reviews, user profiles, statistics, file uploads, and saved projects.

---

# 📌 API Base URL

### Development

```text
http://localhost:5000/api
```

### Production

```text
https://YOUR-RENDER-BACKEND.onrender.com/api
```

---

# 🔐 Authentication APIs

| Method | Endpoint | Description | Protected |
|---------|----------|-------------|-----------|
| POST | /auth/signup | Register a new account | ❌ |
| POST | /auth/verify-otp | Verify email OTP | ❌ |
| POST | /auth/login | Login user | ❌ |
| POST | /auth/forgot-password | Send password reset email | ❌ |
| POST | /auth/reset-password | Reset account password | ❌ |
| GET | /auth/me | Get logged-in user | ✅ |
| PATCH | /auth/me | Update profile information | ✅ |
| POST | /auth/logout | Logout user | ✅ |

---

# 👤 User APIs

| Method | Endpoint | Description | Protected |
|---------|----------|-------------|-----------|
| GET | /users | Get all users | ✅ |
| GET | /users/:username | Get public developer profile | ❌ |

---

# 📁 Project APIs

| Method | Endpoint | Description | Protected |
|---------|----------|-------------|-----------|
| POST | /projects | Create Project | ✅ |
| GET | /projects/my | Get My Projects | ✅ |
| GET | /projects/explore | Explore Projects | ✅ |
| GET | /projects/:id | Get Project Details | ✅ |
| GET | /projects/:id/edit | Get Project for Editing | ✅ |
| PUT | /projects/:id/edit | Update Project | ✅ |
| DELETE | /projects/:id | Delete Project | ✅ |
| POST | /projects/:id/like | Like / Unlike Project | ✅ |
| POST | /projects/:projectId/save | Save / Unsave Project | ✅ |
| GET | /projects/saved/me | Get Saved Projects | ✅ |
| GET | /user/projects/:username | Get Projects by Username | ❌ |

---

# ⭐ Review APIs

| Method | Endpoint | Description | Protected |
|---------|----------|-------------|-----------|
| POST | /projects/:id/review | Add Review | ✅ |
| GET | /projects/:id/review | Get Reviews | ✅ |
| PUT | /projects/:id/review | Edit Review | ✅ |
| DELETE | /projects/:id/review | Delete Review | ✅ |
| GET | /projects/my-reviews | Get Current User Reviews | ✅ |

---

# 📤 Upload API

| Method | Endpoint | Description | Protected |
|---------|----------|-------------|-----------|
| POST | /upload | Upload Image to Cloudinary | ✅ |

---

# 📊 Statistics API

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /stats | Get Platform Statistics |

---

# 📦 API Response Format

Every API follows a consistent JSON response format.

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

---

# 🔒 Authentication Strategy

DevReview uses **JWT Authentication** stored inside **HTTP-Only Cookies** instead of Local Storage.

This approach provides better protection against common security vulnerabilities such as XSS attacks.

Authentication flow includes:

- JWT Token Generation
- HTTP Only Cookies
- Route Protection
- Middleware Verification
- Session Validation

---

# ⚙️ Local Installation

## 1. Clone Repository

```bash
git clone https://github.com/Hamidrza0008/DevReiview.git
```

---

## 2. Move into the Project

```bash
cd DevReiview
```

---

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Backend (.env)

```env
PORT=

MONGODB_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RESEND_API_KEY=
```

---

# ▶️ Running the Project

### Start Backend

```bash
npm run dev
```

---

### Start Frontend

```bash
npm run dev
```

---

Open your browser and visit

```text
http://localhost:3000
```

---

# ☁️ Deployment

DevReview is deployed using a modern cloud-based deployment architecture.

| Service | Purpose |
|----------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Database |
| Cloudinary | Image Storage |
| Resend | Email Delivery |

---

# 🚀 Deployment Workflow

```text
Developer

↓

Push Code to GitHub

↓

Frontend → Vercel

↓

Backend → Render

↓

MongoDB Atlas

↓

Cloudinary

↓

Resend

↓

Production Ready Application
```

---

# 📈 Scalability

The project has been designed keeping future scalability in mind.

Current architecture supports future implementation of:

- Community Feed
- Follow Developers
- Notifications
- Real-time Features
- Messaging
- AI Recommendations
- Infinite Scrolling
- Advanced Analytics

without requiring major architectural changes.

---
---

# 🔒 Security

Security was one of the primary considerations while building DevReview. Multiple industry-standard practices have been implemented to protect user accounts, sensitive information, and application data.

### Authentication Security

- JWT-based authentication
- HTTP-Only Cookies for secure session management
- Protected API routes
- Authentication middleware
- User session validation

---

### Password Security

- Passwords are never stored in plain text.
- Passwords are hashed using **bcrypt** before being stored in MongoDB.
- Secure password reset flow using email verification.

---

### OTP Verification

Every newly registered user must verify their email address before creating an account.

This helps prevent:

- Fake accounts
- Spam registrations
- Invalid email addresses

---

### API Security

The backend validates every protected request before processing it.

Security includes:

- JWT verification
- Protected middleware
- Request validation
- Unauthorized request blocking

---

### File Upload Security

Profile images are uploaded through Multer and stored securely in Cloudinary.

Instead of storing image files on the server:

- Images are uploaded to Cloudinary.
- Only the image URL is stored in MongoDB.
- This keeps the backend lightweight and scalable.

---

### CORS Configuration

The backend only allows trusted frontend origins to communicate with the server.

This prevents unauthorized domains from accessing protected APIs.

---

# ⚡ Performance Optimizations

The project includes several optimizations to ensure a smooth user experience.

### Frontend

- Component-based architecture
- Reusable UI components
- Optimized API requests
- Responsive layouts
- Lightweight animations
- Clean routing with Next.js App Router

---

### Backend

- Modular architecture
- RESTful API design
- Efficient database queries
- Middleware-based authentication
- Cloud image storage
- Centralized controllers

---

### Database

MongoDB Atlas is used as the primary database.

Benefits include:

- Flexible document structure
- Fast read/write operations
- Easy scalability
- Cloud-hosted reliability

---

# 💪 Challenges Faced During Development

Building DevReview involved solving several real-world development challenges.

## Authentication

Implementing secure authentication using JWT with HTTP-Only Cookies while maintaining persistent login sessions.

---

## OTP Verification

Creating a complete email verification workflow using the Resend API and handling OTP expiration and validation.

---

## Image Upload

Integrating Multer with Cloudinary for profile image uploads and ensuring secure file handling.

---

## Deployment

Deploying the frontend and backend on separate platforms while configuring environment variables, CORS, and API communication.

---

## Route Protection

Securing frontend pages and backend endpoints to ensure only authenticated users can access protected resources.

---

## State Management

Maintaining authentication state across the application using React Context API.

---

# 📚 Learning Outcomes

This project helped strengthen my understanding of modern full-stack development.

### Frontend

- Next.js App Router
- React.js
- Tailwind CSS
- Framer Motion
- Responsive UI Design
- Component Architecture

---

### Backend

- Node.js
- Express.js
- REST API Development
- MVC Architecture
- Middleware
- Authentication

---

### Database

- MongoDB Atlas
- Mongoose
- Schema Design
- Relationships
- CRUD Operations

---

### Security

- JWT Authentication
- HTTP-Only Cookies
- Password Hashing
- OTP Verification
- Protected Routes

---

### Deployment

- Vercel
- Render
- MongoDB Atlas
- Cloudinary
- Resend Email API

---

# 🚀 Future Roadmap

DevReview has been designed with scalability in mind.

The following features are planned for Version 2.

## Community Features

- Community Feed
- Follow Developers
- Notifications
- Developer Activity Feed

---

## Platform Improvements

- Developer Achievements
- Reputation System
- Project Collections
- Better Profile Analytics

---

## Future Enhancements

- Real-Time Notifications
- AI Project Recommendations
- Team Collaboration
- Direct Messaging
- Progressive Web App (PWA)

---

# 🤝 Contributing

Contributions are always welcome.

If you'd like to improve DevReview:

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

Please ensure your code follows the existing project structure and coding standards.

---

# ❓ Frequently Asked Questions

### Why was Next.js chosen?

Next.js provides server-side capabilities, optimized routing, and an excellent developer experience, making it ideal for scalable React applications.

---

### Why MongoDB?

MongoDB's flexible document model makes it well-suited for handling developer profiles, projects, and reviews while allowing easy scalability.

---

### Why Cloudinary?

Cloudinary simplifies image storage and optimization, eliminating the need to manage local file storage.

---

### Why Resend?

Resend provides a reliable and developer-friendly email service for OTP verification and password reset workflows.

---

### Is DevReview production-ready?

Yes. The application is deployed and follows modern development practices including authentication, cloud storage, responsive UI, and scalable architecture.

---

# 📊 Project Statistics

| Category | Details |
|-----------|---------|
| Architecture | MERN Stack |
| Frontend | Next.js + React |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Authentication | JWT + HTTP-Only Cookies |
| Image Storage | Cloudinary |
| Email Service | Resend |
| Deployment | Vercel + Render |
| REST APIs | 30+ |
| Models | 4 |
| Major Modules | Authentication, Projects, Reviews, User Profiles |

---

# 👨‍💻 Author

## Hamid Rza

Full Stack Developer

### Connect with Me

- GitHub: **https://github.com/Hamidrza0008**
- LinkedIn: *(Add your LinkedIn profile here)*
- Portfolio: *(Add your Portfolio link here)*

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project in accordance with the license terms.

---

# ⭐ Support the Project

If you found this project helpful or inspiring, consider giving it a ⭐ on GitHub.

Your support motivates future improvements and helps others discover the project.

---

# ❤️ Acknowledgements

Special thanks to the amazing open-source community and the creators of the technologies that made this project possible.

- Next.js
- React
- Express.js
- MongoDB
- Cloudinary
- Resend
- Tailwind CSS
- Framer Motion

---

<div align="center">

## 🚀 Built with passion, curiosity, and a love for modern web development.

### ⭐ If you like this project, don't forget to star the repository!

**Made with ❤️ by Hamid Rza**

</div>
