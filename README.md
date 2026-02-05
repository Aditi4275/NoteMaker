# 🎹 NoteMark: Personal Notes & Bookmarks Manager

> **"Where ideas meet organization."**

A beautifully crafted Personal Knowledge Manager designed to harmonize your digital life. Built with a focus on clean architecture, modern UI, and robust functionality.

## 🎯 Skills This Tests

This project demonstrates proficiency in several key full-stack development areas:

*   **REST API Design**: Structured endpoints for resources (auth, notes, bookmarks) following RESTful principles.
*   **Data Validation & Error Handling**: Robust input validation using `express-validator` and a centralized error handling mechanism `express-async-handler`.
*   **React (Next.js) Routing & State**: Client-side routing with Next.js App Router and Context API for global auth state management.
*   **Tailwind CSS for UI**: Responsive, glassmorphism-inspired design using Tailwind CSS utility classes and custom animations.
*   **Clean Code & Structure**: Modular backend architecture (controllers, routes, services) ensuring maintainability and scalability.
*   **Real-World Data Modeling**: Structured data schemas for users, notes, and bookmarks (simulated with in-memory store for demo purposes).

---

## 🚀 Project Setup

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### 1. Backend Setup
The engine behind NoteMark.

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```
*Note: This uses an in-memory data store. Data resets when the server restarts.*

### 2. Frontend Setup
The beautiful interface.

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

---

## 🧠 Core Logic & Features

### 🔐 Authentication (The Gatekeeper)
We prioritize simplicity without compromising security.
- **Double-Check Validation**: Before you even hit "Register", our `express-validator` middleware ensures your email is valid and your password is strong.
- **JWT Implementation**:
  - On login, the server issues a **JSON Web Token (JWT)**.
  - The frontend `AuthContext` securely manages this token.
  - **Auto-Interceptor**: An `axios` interceptor automatically attaches the `Bearer` token to every API request.
  - **Route Protection**: Middleware ensures only authenticated users can access private resources.

### 📝 Note Management (Your Canvas)
Notes are more than just text; they are structured knowledge.
- **CRUD Operations**: Full Create, Read, Update, Delete capabilities.
- **Dynamic Tagging**: Categorize thoughts on the fly.
- **Smart Filtering**: Real-time filtering by search text or specific tags.

### 🔖 Bookmark Logic (The Librarian)
No more saving "Untitled" links.
- **Auto-Magic Metadata**: When you add a link, the backend (powered by `cheerio`) scrapes the target page's `<title>` tag.
  - *Example*: Paste `https://github.com` -> Saves as "GitHub: Let's build from here".
- **Validation**: Ensures URLs are valid before saving.

---

## � Brief API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current user profile (Protected)

### Notes Endpoints
- `GET /api/notes` - Retrieve all notes for the logged-in user
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

### Bookmarks Endpoints
- `GET /api/bookmarks` - Retrieve all bookmarks
- `POST /api/bookmarks` - Create a bookmark (triggers metadata fetch)
- `PUT /api/bookmarks/:id` - Update a bookmark
- `DELETE /api/bookmarks/:id` - Delete a bookmark

### 🧪 Sample cURL Request

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

**Create Note (with token):**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{"title":"My First Note", "content":"This is a test note", "tags":["test"]}'
```

---

✨ *Built with passion.*
