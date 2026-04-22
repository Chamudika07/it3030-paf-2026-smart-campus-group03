# Smart Campus Operations Hub

Smart Campus Operations Hub is a campus maintenance and operations system built with a Spring Boot backend and a React frontend. It currently covers resource management, maintenance ticket handling, ticket comments, file attachments, and technician workflow updates.

This guide is written for running the project locally without Docker.

## Tech Stack

- Backend: Java 21, Spring Boot 3.3, Maven
- Frontend: React 18, Vite, TypeScript
- Database: PostgreSQL
- Authentication foundation: Spring Security with OAuth 2.0 client preparation

## Project Modules

- `backend/`: REST API, business logic, persistence, file uploads
- `frontend/`: React dashboard UI for resources, tickets, bookings, and notifications
- `docs/`: supporting architecture notes

## Local Setup Without Docker

### 1. Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+ and npm
- PostgreSQL 14+ running locally

Check the installed versions:

```bash
java -version
mvn -version
node -v
npm -v
psql --version
```

### 2. Create the PostgreSQL database

Make sure PostgreSQL is running on your machine, then create the database:

```bash
psql -U postgres -h localhost -c "CREATE DATABASE smart_campus_ops_hub;"
```

If your PostgreSQL username or password is different, use your own local values in the environment file.

### 3. Configure environment values

The backend loads values from `backend/.env`. The frontend can use `frontend/.env` if needed.

Typical backend values:

```env
SERVER_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_campus_ops_hub
DB_USERNAME=postgres
DB_PASSWORD=postgres
GOOGLE_CLIENT_ID=placeholder-client-id
GOOGLE_CLIENT_SECRET=placeholder-client-secret
FRONTEND_URL=http://localhost:5173
TICKET_ATTACHMENTS_DIR=uploads/tickets
```

Typical frontend value:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend base URL:

```text
http://localhost:8080/api
```

Health check:

```bash
curl http://localhost:8080/api/health
```

### 5. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Current API Summary

These are the main APIs available in the current project.

### Health

- `GET /api/health`
  Returns a simple response to confirm the backend is running.

### Resources

- `GET /api/resources`
  Returns all campus resources.
- `GET /api/resources/{id}`
  Returns one resource by id.
- `POST /api/resources`
  Creates a new resource.
- `PUT /api/resources/{id}`
  Updates an existing resource.
- `DELETE /api/resources/{id}`
  Deletes a resource.

### Tickets

- `GET /api/tickets`
  Returns the ticket list for the dashboard.
- `GET /api/tickets/{id}`
  Returns full ticket details, attachments, comments, current assignee, and workflow flags.
- `POST /api/tickets`
  Creates a new maintenance ticket with optional image attachments.
- `PATCH /api/tickets/{id}/assign`
  Assigns or updates the technician for a ticket.
- `PATCH /api/tickets/{id}/status`
  Moves the ticket through the workflow such as open, in progress, resolved, closed, or rejected.

### Ticket Comments

- `POST /api/tickets/{ticketId}/comments`
  Adds a new comment to a ticket.
- `PUT /api/comments/{commentId}`
  Updates an existing comment.
- `DELETE /api/comments/{commentId}`
  Deletes a comment.

## UI Standards Used In This Project

The frontend now follows a more consistent UI method so future pages can match the same visual language.

### Color Pattern

- Primary brand color: deep teal for actions and highlights
- Secondary support color: navy-blue for structure, side navigation, and headings
- Soft neutrals: light blue-gray surfaces for cards, inputs, and page background
- Status colors:
  High priority uses warm orange
  In-progress uses lavender
  Resolved uses green
  Rejected uses red

### Component Standards

- Buttons use rounded pill shapes, strong contrast, and a clear primary/secondary hierarchy
- Inputs use a soft surface wrapper, large radius, and visible focus state
- Cards use a glass-style white surface with subtle borders and shadow depth
- Badges use a consistent pill pattern for priority and status communication
- Layout spacing uses even gaps so forms and dashboards feel balanced

### Technician Actions Design Rule

The `Technician Actions` section is organized into two task-focused cards:

- `Assignment Details`
  For technician owner information
- `Workflow Update`
  For status changes, resolution notes, and rejection reasons

This structure keeps inputs easier to scan and reduces confusion when the user is updating a live ticket.

## Backend Test Note

The backend test setup is configured to avoid Mockito inline agent issues in restricted environments. This helps `mvn test` run locally without extra JVM flags.

## Useful Commands

Backend test:

```bash
cd backend
mvn test
```

Frontend production build:

```bash
cd frontend
npm run build
```

## Important Notes

- Do not commit `.env`, `node_modules`, `target`, or real credentials
- Uploaded ticket files are stored under `backend/uploads/tickets`
- The backend default database connection expects a local PostgreSQL instance

## Suggested Team Ownership

- Member 1: resources and facilities management
- Member 2: bookings and booking workflow
- Member 3: tickets, attachments, and comments
- Member 4: auth, notifications, and security
