# Postman Testing Guide

This project exposes a Spring Boot REST API on `http://localhost:8080`.

The backend routes in the current security configuration are public for testing, so you do not need an auth token for the endpoints listed below.

## 1. Start the project

From the project root:

```bash
docker compose up -d
cd backend
mvn spring-boot:run
```

Check the API is up:

```bash
curl http://localhost:8080/api/health
```

Expected response:

```json
{
  "status": "UP",
  "service": "smart-campus-operations-hub-backend"
}
```

## 2. Import the collection into Postman

Import this file in the VS Code Postman extension:

`docs/SmartCampus.postman_collection.json`

Set the collection variable:

- `baseUrl` = `http://localhost:8080`

## 3. Recommended test order

Run the requests in this order:

1. `Health > Health Check`
2. `Resources > Get All Resources`
3. `Resources > Create Resource`
4. `Bookings > Check Availability`
5. `Bookings > Create Booking`
6. `Tickets > Create Ticket (JSON only)`
7. `Tickets > Get All Tickets`
8. `Tickets > Add Comment`
9. `Tickets > Update Ticket Status`

## 4. Notes for specific APIs

### Resources

Seed data is inserted automatically on first startup if the `resources` table is empty.

Valid `category` values:

- `LECTURE_HALL`
- `LAB`
- `MEETING_ROOM`
- `EQUIPMENT`

### Bookings

Use future dates for `startDate` and `endDate`, otherwise validation will fail.

Valid `status` values:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

### Tickets

There are two common ways to test ticket creation:

1. Use the included `Create Ticket (JSON only)` request in the collection.
   This sends multipart form-data with only the `ticket` part.
2. Add one or more `attachments` form-data fields of type `File` in Postman if you want to test uploads.

Valid `category` values:

- `ELECTRICAL`
- `PLUMBING`
- `NETWORK`
- `EQUIPMENT`
- `CLEANING`
- `SAFETY`
- `FACILITY`
- `OTHER`

Valid `priority` values:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

Valid `status` values:

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`
- `REJECTED`

## 5. Common problems

### 401 Unauthorized

That would be unexpected for these routes with the current config. Recheck that you are calling `/api/...` paths on the backend port.

### 400 Bad Request

Usually caused by:

- enum value typo
- required field missing
- booking dates not in the future
- wrong body type for ticket creation

### Ticket create fails

`POST /api/tickets` must use `form-data`, not raw JSON.

The `ticket` field should be a text field containing JSON such as:

```json
{
  "title": "Projector not working",
  "category": "EQUIPMENT",
  "description": "Projector in Lecture Hall 1 does not power on.",
  "priority": "HIGH",
  "preferredContact": "student1@campus.edu",
  "locationText": "Lecture Hall 1",
  "resourceId": 1
}
```
