# Authentication System

## Overview

This is a full-stack authentication system built for the Codveda Web Development Internship. It provides secure user registration, login, JWT-protected access, MongoDB persistence, and a responsive ARYONIX-branded React dashboard.

## Features

- User registration
- Secure password hashing
- User login
- JWT authentication
- Protected API routes
- Protected user dashboard
- Logout
- MongoDB persistence
- Responsive React frontend
- ARYONIX branding

## Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token
- dotenv

## Project Structure

```text
02-authentication-system/
├── client/
│   ├── public/
│   │   └── aryonixlogo.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── config.js
│   ├── package.json
│   └── server.js
└── README.md
```

## Authentication Flow

1. A user submits registration details.
2. The backend validates the request and hashes the password with bcryptjs.
3. The hashed password and user details are stored in MongoDB.
4. The backend creates a JWT that expires after 7 days.
5. Login verifies the password and returns a new JWT.
6. Protected routes verify the JWT before retrieving the user's profile.
7. Logout removes the JWT from browser local storage.

## How to Run

### Backend

```bash
cd server
npm install
node server.js
```

The backend runs at `http://localhost:5002`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

The backend environment file must contain the required local configuration values. Do not commit or share those values.

## Security

- Passwords are hashed with bcryptjs before storage.
- JWTs protect authenticated API routes and expire after 7 days.
- Protected profile responses exclude the password field.
- Duplicate email registrations and invalid credentials are rejected.
- Environment variables hold database and JWT configuration.
- The server `.gitignore` excludes `.env` and `node_modules`.
- JWT secrets, database credentials, and passwords are not included in the React application.

## Author

Aryan Mandavgode

## Internship

Codveda Technologies - Web Development Internship 2026
