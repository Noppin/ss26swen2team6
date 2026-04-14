# Tour Planner

A web-based application for planning and logging bike, hike, running, and vacation tours.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Zustand + React Router + Leaflet
- **Backend:** C# ASP.NET Core 9 with layer-based architecture
- **Database:** PostgreSQL via Entity Framework Core 9
- **Logging:** log4net
- **Tests:** NUnit (22+ unit tests)
- **Maps/Routing:** OpenRouteService.org + Leaflet
- **Containerization:** Docker Compose

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [OpenRouteService API Key](https://openrouteservice.org/dev/#/signup) (free)

## Quick Start with Docker

```bash
docker-compose up --build
```

- Frontend: <http://localhost>
- Backend API: <http://localhost:5000>
- Swagger: <http://localhost:5000/swagger>

## Local Development

```bash
# Start only PostgreSQL
docker-compose up postgres -d

# Backend (in backend/ folder)
dotnet run --project TourPlanner.API

# Frontend (in frontend/ folder, new terminal)
npm install && npm run dev
```

Frontend: <http://localhost:5173>

## Running Tests

```bash
cd backend && dotnet test
```

## Architecture

```text
TourPlanner.API  (Controllers)
    TourPlanner.BL   (Services, DTOs, ORS HTTP client)
    TourPlanner.DAL  (Repositories, EF DbContext, Entities)
    TourPlanner.Tests (NUnit 22+ tests)
```

**Design Pattern:** Repository Pattern — generic `IRepository<T>` abstraction.

## Configuration

Copy `backend/TourPlanner.API/appsettings.Example.json` to `appsettings.json` and set:

- `ConnectionStrings:Default`
- `JwtSettings:SecretKey` (min 32 chars)
- `OpenRouteService:ApiKey` (get free key at [openrouteservice.org](https://openrouteservice.org))
