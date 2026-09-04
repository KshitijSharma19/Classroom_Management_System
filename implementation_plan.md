# Classroom Management System - React & Python Migration

## Goal
To migrate the current vanilla HTML/JS frontend into a component-based React application for improved maintainability and scalability, and to implement a robust Python backend with a SQLite database to handle all data persistence and business logic.

## User Review Required
> [!IMPORTANT]
> The current system uses client-side mock data and local storage (`store.js`). This migration will replace that entirely with server-side database interactions. 

> [!WARNING]
> This requires significant restructuring. We will need to initialize a completely new React project and a new Python project structure within the current workspace to keep things organized.

## Open Questions
> [!NOTE]
> 1. **React Framework:** We are using **Vite + React**.
> 2. **Backend Framework:** We are using **FastAPI**.
> 3. **Styling:** We are using **TailwindCSS v4**.
> 4. **Neon DB Connection:** Please provide the connection string for your Neon DB instance (e.g., `postgresql://user:password@host/dbname?sslmode=require`). I will need this to connect the backend to Neon DB!

## Proposed Changes

### Frontend (React + Vite)
- Initialize a new React project in a `frontend/` directory.
- Set up TailwindCSS in the React project.
- **Component Architecture**:
  - `src/components/`: Reusable UI elements (Buttons, Cards, Modals, Layout, Sidebar).
  - `src/pages/`: Page-level components (`Login`, `StudentDashboard`, `TeacherDashboard`, `AdminDashboard`).
  - `src/context/`: For Authentication Context and Theme Context (Dark mode).
  - `src/api/`: API integration services to communicate with the Python backend.
- Migrate HTML structures to JSX components.
- Convert Vanilla JS logic (`student.js`, `admin.js`, etc.) to React state and hooks (e.g., `useState`, `useEffect` for data fetching).

### Backend (Python + FastAPI)
- Initialize a new Python project in a `backend/` directory.
- Set up a virtual environment and install dependencies (`FastAPI`, `Uvicorn`, `SQLAlchemy`).
- Database: **Neon DB (PostgreSQL)** via **SQLAlchemy** (ORM).
- **Backend Architecture**:
  - `models.py`: Database tables (Users, Assignments, Attendance, Grades, etc.).
  - `schemas.py`: Pydantic models for request/response data validation.
  - `routers/`: API endpoints separated by feature (e.g., `/auth`, `/student`, `/teacher`).
  - `database.py`: Database connection setup.
  - `main.py`: Entry point for the application.

### Data Migration
- Convert the mock data structures in `store.js` into SQLAlchemy database models.
- Create an initial `seed.py` script to populate the SQLite database with the default mock users and baseline data so you can test it immediately.

## Verification Plan

### Automated Tests
- We can add basic endpoint testing using `pytest` for the backend.
- Verify the frontend builds successfully (`npm run build`).

### Manual Verification
- Test login flows for all three roles (Student, Teacher, Admin).
- Verify that data changes (e.g., adding a new assignment or marking attendance) persist across browser refreshes via the database.
- Ensure the UI remains beautiful, dynamic, and responsive, maintaining the premium design you already have.
