# ProjectFlow

ProjectFlow is a full-stack project management application built for the Codveda Web Development Internship 2026. It helps teams manage projects, tasks, priorities, deadlines, and progress in a single SaaS-style workspace inspired by modern tools like Linear and Vercel.

## Overview

ProjectFlow provides a professional dashboard and workspace for:
- managing projects
- creating and tracking tasks
- assigning tasks to projects
- monitoring progress and statuses
- handling CRUD operations with MongoDB persistence
- viewing real-time metrics from production-ready data

## Features

- Dashboard with live project and task metrics
- Project management dashboard
- Project creation, editing, and deletion
- Task creation, editing, deletion, and completion toggle
- Project-task relationship management
- MongoDB Atlas persistence
- Responsive SaaS-style dark UI
- Loading, empty, and error states
- REST API with validation and JSON responses
- CRUD flows designed for real-world project tracking

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- CORS
- dotenv

## Project Structure

```text
01-fullstack-project-manager/
├── client/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── server/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
└── package-lock.json
```

## Frontend

The frontend runs on:
- http://localhost:5173

To install and run the frontend:

```bash
cd client
npm install
npm run dev
```

## Backend

The backend runs on:
- http://localhost:5001

To install and run the backend:

```bash
cd server
npm install
npm run dev
```

## MongoDB Setup

The backend uses MongoDB Atlas through environment variables. The database URI is stored in the server environment file and is not exposed in the frontend or the repository.

Create a server .env file with:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5001
```

Important security notes:
- never commit the MongoDB connection string
- do not expose credentials in frontend files
- keep .env and node_modules ignored by Git

## REST API

Base URL:
- http://localhost:5001

### Projects
- GET /api/projects
- GET /api/projects/:id
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Tasks
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Task Completion
The task update endpoint supports toggling `completed` as part of the task payload.

## CRUD Functionality

### Project CRUD
- Create new projects with name, client, status, priority, due date, and progress
- Edit existing project records
- Delete projects and associated tasks
- View project card details and status information

### Task CRUD
- Create tasks linked to a project
- Edit task details and project assignment
- Delete tasks from the workspace
- Toggle task completion state

## Project / Task Relationship

Each task stores a reference to a project using MongoDB ObjectId relationships. Tasks are populated with the related project details when fetched, which makes project/task linking reliable and accurate.

## Local Setup

1. Install dependencies for the frontend and backend.
2. Configure the server .env file with your MongoDB Atlas URI and PORT=5001.
3. Start the backend.
4. Start the frontend.
5. Access the app at http://localhost:5173.

## Security Notes

- Backend credentials are kept in environment variables only.
- No production secrets are committed to source files.
- The app avoids exposing MongoDB connection strings or credentials in UI or documentation.

## Internship Information

This project is part of the Codveda Web Development Internship 2026 by Aryan Mandavgode.

## Author

Aryan Mandavgode
