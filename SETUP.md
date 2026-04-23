# Setup & Development Guide - Smart Campus Operations Hub

## 🎯 Project Overview

**Smart Campus Operations Hub** is a full-stack application for managing campus operations with:
- **Backend**: Java 21 + Spring Boot 3.3.5 (REST API)
- **Frontend**: React 18 + TypeScript + Vite (SPA)
- **Database**: PostgreSQL 16

---

## 📋 Prerequisites

Before you start, ensure you have:

| Component | Version | How to Check |
|-----------|---------|--------------|
| Java | 21+ | `java -version` |
| Node.js | 18+ | `node --version` |
| npm | 10+ | `npm --version` |
| Docker | Latest | `docker --version` |
| Docker Compose | Latest | `docker compose --version` |

### Install Missing Dependencies

**Windows - Using Chocolatey:**
```powershell
choco install openjdk21 nodejs docker-desktop
```

**Windows - Manual:**
1. [Java 21 JDK](https://www.oracle.com/java/technologies/downloads/#java21)
2. [Node.js LTS](https://nodejs.org/)
3. [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Database
```powershell
docker compose up -d
```

Verify it's running:
```powershell
docker ps | findstr postgres
```

### 2. Start Backend (Terminal 1)
```powershell
cd backend
mvn spring-boot:run
```

Wait for: `"Started SmartCampusOperationsHubApplication"`

Health check:
```powershell
curl http://localhost:8080/api/health
```

### 3. Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
npm run dev
```

### 4. Open Application
Visit: **http://localhost:5173**

---

## 📝 Running Backend & Frontend Separately

### Run Backend Only

```powershell
# Terminal 1: Start Database
docker compose up -d

# Terminal 2: Start Backend API
cd backend
mvn spring-boot:run
```

**Backend runs on**: `http://localhost:8080`
**API endpoints**: `http://localhost:8080/api/*`

### Run Frontend Only

```powershell
# Terminal: Start Frontend
cd frontend
npm install
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

### Run Both Together

```powershell
# Terminal 1: Database
docker compose up

# Terminal 2: Backend
cd backend
mvn spring-boot:run

# Terminal 3: Frontend
cd frontend
npm run dev
```

---

## 🔨 Build Commands

### Backend Build & Test
```powershell
cd backend

# Compile only
mvn clean compile

# Run tests
mvn clean test

# Package as JAR
mvn clean package

# Run spring-boot
mvn spring-boot:run
```

### Frontend Build & Development
```powershell
cd frontend

# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🗄️ Database Configuration

### Default Credentials
- **Database**: `smart_campus_ops_hub`
- **User**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`
- **Host**: `localhost`

### View Docker Database
```powershell
# Connect to running container
docker exec -it smart-campus-postgres psql -U postgres -d smart_campus_ops_hub

# Common psql commands:
\dt                    # List tables
SELECT * FROM table_name;  # Query table
\q                     # Quit
```

### Database Initialization
- Tables are auto-created via Hibernate DDL (`ddl-auto: update`)
- Initial schema migration runs on first backend start

---

## ✅ Verification Checklist

### Backend Ready?
```powershell
curl http://localhost:8080/api/health
# Expected: Status 200 OK
```

### Frontend Ready?
- Visit `http://localhost:5173` in browser
- No console errors (press F12)

### Database Ready?
```powershell
docker exec -it smart-campus-postgres psql -U postgres -d smart_campus_ops_hub -c "SELECT version();"
```

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Issue: Port 8080 already in use
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Issue: Wrong Java version
java -version  # Must be 21+

# Issue: Database connection refused
docker ps  # Check if postgres container is running
docker logs smart-campus-postgres  # View logs
```

### Frontend won't start
```powershell
# Issue: Port 5173 already in use
netstat -ano | findstr :5173

# Issue: npm modules missing
cd frontend
rm -r node_modules package-lock.json
npm install

# Issue: TypeScript errors
npm run build  # Check for real errors
```

### Database connection issues
```powershell
# Restart database
docker compose restart

# View database logs
docker logs smart-campus-postgres

# Check connection
docker exec -it smart-campus-postgres psql -U postgres -c "SELECT 1;"
```

---

## 🔧 Environment Configuration

### Backend .env
Located at `backend/.env`:
```env
APP_NAME=smart-campus-operations-hub
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_campus_ops_hub
DB_USERNAME=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:5173
```

### Frontend .env
Located at `frontend/.env`:
```env
VITE_API_URL=http://localhost:8080
```

---

## 📊 API Documentation

### Available Endpoints
- `GET /api/health` - Health check
- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get ticket details
- `GET /api/resources` - List resources
- `POST /api/bookings` - Create booking

See backend documentation for full API spec.

---

## 🔒 Security Features

- Spring Security + JWT authentication (OAuth 2.0 ready)
- CORS configured for `http://localhost:5173`
- Password encoding with BCrypt
- File upload restrictions (5MB max)

---

## 📦 Dependency Info

### Backend
- Spring Boot 3.3.5 (Java 21)
- Spring Data JPA, Spring Security
- PostgreSQL Driver
- Lombok (code generation)
- MapStruct (DTO mapping)

### Frontend
- React 18.3
- TypeScript 5.8
- Vite 5.4
- Axios (HTTP client)
- React Router v6

---

## ✨ Recent Fixes Applied

✅ Fixed unused import in `TicketMapper.java`
✅ Fixed YAML property formatting for `format_sql`
✅ Updated TypeScript `moduleResolution` to "Bundler"
✅ Verified both backend and frontend compile without errors

---

## 📚 Project Structure
```
it3030-paf-2026-smart-campus-group03/
├── backend/                      # Spring Boot API
│   ├── src/main/java/           # Java source code
│   ├── src/main/resources/      # Configuration files
│   ├── pom.xml                  # Maven configuration
│   └── .env                     # Environment variables
├── frontend/                     # React Application
│   ├── src/                     # React components & pages
│   ├── package.json             # npm configuration
│   └── vite.config.ts           # Vite configuration
├── docs/                        # Documentation
├── docker-compose.yml           # Database setup
└── SETUP.md                     # This file
```

---

## 🚢 Deployment

### Production Build Backend
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Production Build Frontend
```powershell
cd frontend
npm run build
# Serves files from dist/ folder
```

---

## 💡 Tips & Best Practices

1. **Always start database first** before backend
2. **Keep terminals organized** - use 3 separate terminals for DB, Backend, Frontend
3. **Check logs** when something breaks - they tell you what's wrong
4. **Development mode** (`npm run dev`) provides hot reload
5. **Clean build** when dependencies change: `mvn clean install`

---

## 📞 Common Commands Reference

| Task | Command |
|------|---------|
| Start DB | `docker compose up -d` |
| Stop DB | `docker compose down` |
| Backend Dev | `cd backend && mvn spring-boot:run` |
| Frontend Dev | `cd frontend && npm run dev` |
| Build Backend | `cd backend && mvn clean package` |
| Build Frontend | `cd frontend && npm run build` |
| Test Backend | `cd backend && mvn test` |

---

**Last Updated**: April 19, 2026  
**Status**: ✅ All systems tested and working
