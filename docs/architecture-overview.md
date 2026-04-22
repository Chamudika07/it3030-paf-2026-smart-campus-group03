# Smart Campus Operations Hub Architecture

## Modules

- `backend`: Spring Boot REST API, security, validation, persistence, business logic
- `frontend`: React + Vite client app, routing, layouts, API integration, protected-route preparation
- `docs`: project decisions, diagrams, onboarding notes

## Initial bounded areas

- Resource Management
- Booking Management
- Ticketing and Comments
- Authentication and Notifications

## Design principles

- Keep backend and frontend fully separated
- Use DTOs between controllers and entities
- Keep services thin but meaningful
- Return consistent error responses
- Make local setup easy for students
- Build for extension, not overengineering

