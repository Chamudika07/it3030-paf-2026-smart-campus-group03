# 🚀 Quick Start - Commands Only

## TL;DR - 3 Simple Steps

```powershell
# Step 1: Start Database
docker compose up -d

# Step 2: Start Backend (Terminal 1)
cd backend
mvn spring-boot:run

# Step 3: Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev

# Open: http://localhost:5173
```

---

## 📌 Running Backend & Frontend SEPARATELY

### Backend Only
```powershell
docker compose up -d
cd backend
mvn spring-boot:run
# Runs on: http://localhost:8080/api/
```

### Frontend Only
```powershell
cd frontend
npm install
npm run dev
# Runs on: http://localhost:5173
```

---

## 🛠️ Build Commands

### Backend
```powershell
cd backend

# Compile
mvn clean compile

# Build JAR
mvn clean package

# Run tests
mvn clean test

# Run app
mvn spring-boot:run
```

### Frontend
```powershell
cd frontend

# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## 🐳 Database Commands

```powershell
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f postgres

# Connect to database
docker exec -it smart-campus-postgres psql -U postgres -d smart_campus_ops_hub

# Restart
docker compose restart
```

---

## 🔍 Verify Everything Works

```powershell
# Backend health
curl http://localhost:8080/api/health

# Frontend
# Open http://localhost:5173 in browser

# Database
docker ps | findstr postgres
```

---

## ❌ Kill Processes on Ports

```powershell
# Kill process on port 8080 (Backend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 5432 (Database)
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

---

## 💻 Terminal Setup (Recommended)

```powershell
# Terminal 1
cd c:\path\to\project
docker compose up

# Terminal 2 (New)
cd c:\path\to\project\backend
mvn spring-boot:run

# Terminal 3 (New)
cd c:\path\to\project\frontend
npm run dev
```

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

---

## 📊 Default Credentials

- **DB User**: postgres
- **DB Password**: postgres
- **Database**: smart_campus_ops_hub
