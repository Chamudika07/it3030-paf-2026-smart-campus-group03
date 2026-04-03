# Smart Campus Operations Hub

Production-inspired starter project for a university group project with a Spring Boot backend and React frontend.

## Tech Stack

- Backend: Java 21, Spring Boot 3.3, Maven
- Frontend: React 18, Vite, TypeScript, npm
- Database: PostgreSQL 16
- Auth preparation: Spring Security + OAuth 2.0 client
- CI: GitHub Actions

## Project Structure

```text
smart-campus-operations-hub/
├── .github/
├── backend/
├── docs/
├── frontend/
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Quick Start

### 0. Use Java 21

This project is pinned to Java 21 for local development and CI.

Check your Java version:

```bash
java -version
```

If you use Homebrew on Mac:

```bash
brew install openjdk@21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

If you want that permanently in `~/.zshrc`:

```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 21)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd it3030-paf-2026-smart-campus-group03
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

If you are using a manually installed PostgreSQL instead of Docker, create the database first:

```bash
psql -U postgres -h localhost -c "CREATE DATABASE smart_campus_ops_hub;"
```

### 3. Configure environment files

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

Update the values as needed.

### 4. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend health check:

```bash
curl http://localhost:8080/api/health
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

### Backend

- `SERVER_PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL`

### Frontend

- `VITE_API_BASE_URL`

## Recommended Branch Strategy

- `main`: always stable
- `develop`: integration branch
- `feature/member-area-short-description`: feature work branches

Examples:

- `feature/resources-resource-crud`
- `feature/bookings-approval-flow`
- `feature/tickets-comment-module`
- `feature/auth-notification-foundation`

## Commit Style

Use short conventional-style messages:

- `feat: add resource management starter endpoints`
- `fix: handle resource validation errors`
- `docs: update backend setup guide`
- `chore: add ci workflow`

## Never Commit

- `.env`
- `node_modules/`
- `target/`
- IDE folders
- database dumps
- real OAuth credentials

## Team Ownership Suggestion

- Member 1: resources and facilities catalogue
- Member 2: bookings and booking rules
- Member 3: tickets, attachments, comments
- Member 4: auth, roles, notifications, security

## CI

GitHub Actions will:

- build and test the backend with Maven
- build the frontend with npm

## First Commit Plan

1. Commit the project scaffold and docs
2. Commit backend sample resource flow
3. Commit frontend routing and dashboard shell
4. Commit CI and database docker setup
