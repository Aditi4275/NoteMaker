# 📝 NoteMark: Personal Notes & Bookmarks Manager

> **"Where ideas meet organization."**

A beautifully crafted Personal Knowledge Manager designed to harmonize your digital life. Built with a focus on clean architecture, modern UI, and robust functionality.


## 🚀 Usage & Setup

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

### 2. Frontend Setup
The beautiful interface.

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### 3. Docker Setup (Recommended)
Run the entire application with a single command.

```bash
# Build and start services
docker compose up --build

# Run in background
docker compose up -d
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🎯 Skills This Tests

This project serves as a comprehensive demonstration of full-stack engineering proficiency:

*   **REST API Design**: Implements a structured, resource-oriented API (`/auth`, `/notes`, `/bookmarks`) following best practices.
*   **Data Validation & Error Handling**: Uses `express-validator` for strict input sanitization and a centralized error handling middleware for consistent API responses.
*   **React (Next.js) Routing & State**: Leverages Next.js App Router for client-side navigation and React Context API for managing global authentication state.
*   **Tailwind CSS for UI**: Features a responsive, glassmorphism-inspired design built with utility-first CSS for rapid development and consistency.
*   **Clean Code & Structure**: organized backend (controllers, services, validators) and frontend (components, context, lib) to ensure maintainability.
*   **Real-World Data Modeling**: Simulates a production database schema with distinct relationships between users, notes, and bookmarks.

---

## 📡 API Documentation

### Authentication (`/api/auth`)
- `POST /register`: Register a new user with email/password validation.
- `POST /login`: Authenticate and receive a JWT Bearer token.
- `GET /me`: Retrieve the currently authenticated user's profile.

### Notes (`/api/notes`)
- `GET /`: List all notes for the authenticated user. Supports filtering: `?q=searchTerm&tags=tag1,tag2`
- `POST /`: Create a new note (requires `title` and `content`).
- `PUT /:id`: Update a note by ID.
- `DELETE /:id`: Remove a note.

### Bookmarks (`/api/bookmarks`)
- `POST /`: Save a new bookmark. **Feature**: Automatically scrapes the target URL to populate the bookmark title.
- `GET /`: Retrieve all bookmarks. Supports filtering: `?q=searchTerm&tags=tag1,tag2`
- `PUT /:id`: Update bookmark details.
- `DELETE /:id`: Delete a bookmark.

---

## 🛠️ Architecture & Clean Code

The project follows a modular architecture to separate concerns and improve testability.

### Backend Structure
- **`controllers/`**: Handles request logic and sends responses. Keeping routes clean.
- **`validators/`**: Contains validation chains (e.g., `check('email').isEmail()`) to ensure data integrity before it reaches controllers.
- **`routes/`**: Defines API entry points and mounts middleware.
- **`middleware/`**: Shared logic for Authentication (`auth.js`) and Error Handling (`errorHandler.js`).

### Frontend Structure
- **`app/`**: Next.js App Router pages (`page.js`, `layout.js`).
- **`context/`**: `AuthContext` provides a global state for user sessions, accessible throughout the component tree.
- **`components/`**: Reusable UI elements (Forms, Cards, Navbar).
- **`lib/`**: Utility functions and API clients (Axios instance with interceptors).

---

## ✨ Key Features

### 🔐 Secure Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism.
- **Protection**: Middleware ensures private routes are inaccessible without a valid token.
- **Interceptors**: Axios interceptors automatically inject the token headers into outgoing requests.

### 🎨 Modern UI with Tailwind CSS
- **Responsive Design**: Looks great on mobile and desktop.
- **Visuals**: Uses gradients, glassmorphism, and smooth transitions for a premium feel.
- **Feedback**: Instant visual feedback for actions (loading states, toast notifications).




