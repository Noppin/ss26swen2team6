# Git Commit Plan — Tour Planner

**Student 1 (you) = ~60% of commits**
**Student 2 (partner) = ~40% of commits**

---

## Phase 1 — Project Setup

**Commit 1 — Student 1**
```
chore: initialize solution with DAL, BL, API and Tests projects
```
Files:
- `backend/TourPlanner.sln`
- `backend/TourPlanner.API/TourPlanner.API.csproj`
- `backend/TourPlanner.BL/TourPlanner.BL.csproj`
- `backend/TourPlanner.DAL/TourPlanner.DAL.csproj`
- `backend/TourPlanner.Tests/TourPlanner.Tests.csproj`
- `.gitignore`

---

**Commit 2 — Student 1**
```
chore: add Docker Compose with postgres, backend and frontend services
```
Files:
- `docker-compose.yml`
- `backend/Dockerfile`

---

**Commit 3 — Student 2**
```
chore: scaffold React frontend with Vite, TypeScript and React Router
```
Files:
- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/tsconfig.json`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.node.json`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`

---

**Commit 4 — Student 2**
```
chore: add frontend Dockerfile and nginx config
```
Files:
- `frontend/Dockerfile`
- `frontend/nginx/nginx.conf`

---

## Phase 2 — DAL Layer

**Commit 5 — Student 1**
```
feat(dal): add User, Tour and TourLog entities with EF Core DbContext
```
Files:
- `backend/TourPlanner.DAL/Entities/User.cs`
- `backend/TourPlanner.DAL/Entities/Tour.cs`
- `backend/TourPlanner.DAL/Entities/TourLog.cs`
- `backend/TourPlanner.DAL/Context/TourPlannerDbContext.cs`

---

**Commit 6 — Student 1**
```
feat(dal): add TransportType enum
```
Files:
- `backend/TourPlanner.DAL/Entities/Enums/TransportType.cs`

---

**Commit 7 — Student 1**
```
feat(dal): implement generic IRepository interface and base Repository
```
Files:
- `backend/TourPlanner.DAL/Repositories/Interfaces/IRepository.cs`
- `backend/TourPlanner.DAL/Repositories/Repository.cs`

---

**Commit 8 — Student 2**
```
feat(dal): implement TourRepository with GetByUserIdAsync and GetWithLogsAsync
```
Files:
- `backend/TourPlanner.DAL/Repositories/Interfaces/ITourRepository.cs`
- `backend/TourPlanner.DAL/Repositories/TourRepository.cs`

---

**Commit 9 — Student 2**
```
feat(dal): implement TourLogRepository and UserRepository
```
Files:
- `backend/TourPlanner.DAL/Repositories/Interfaces/ITourLogRepository.cs`
- `backend/TourPlanner.DAL/Repositories/Interfaces/IUserRepository.cs`
- `backend/TourPlanner.DAL/Repositories/TourLogRepository.cs`
- `backend/TourPlanner.DAL/Repositories/UserRepository.cs`

---

**Commit 10 — Student 1**
```
feat(dal): add EF Core migrations and auto-migrate on startup
```
Files:
- `backend/TourPlanner.DAL/Migrations/20260411180856_InitialCreate.cs`
- `backend/TourPlanner.DAL/Migrations/20260411180856_InitialCreate.Designer.cs`
- `backend/TourPlanner.DAL/Migrations/TourPlannerDbContextModelSnapshot.cs`

---

## Phase 3 — BL Layer

**Commit 11 — Student 1**
```
feat(bl): add DTOs for tours, tour logs, auth and routes
```
Files:
- `backend/TourPlanner.BL/DTOs/AuthDtos.cs`
- `backend/TourPlanner.BL/DTOs/TourDtos.cs`
- `backend/TourPlanner.BL/DTOs/TourLogDtos.cs`
- `backend/TourPlanner.BL/DTOs/RouteDtos.cs`

---

**Commit 12 — Student 1**
```
feat(bl): implement AuthService with BCrypt hashing and JWT generation
```
Files:
- `backend/TourPlanner.BL/Services/Interfaces/IAuthService.cs`
- `backend/TourPlanner.BL/Services/AuthService.cs`

---

**Commit 13 — Student 1**
```
feat(bl): add OpenRouteServiceClient for geocoding and directions
```
Files:
- `backend/TourPlanner.BL/HttpClients/OrsOptions.cs`
- `backend/TourPlanner.BL/HttpClients/OrsGeocodingResponse.cs`
- `backend/TourPlanner.BL/HttpClients/OrsDirectionsResponse.cs`
- `backend/TourPlanner.BL/HttpClients/OpenRouteServiceClient.cs`

---

**Commit 14 — Student 1**
```
feat(bl): implement TourService with CRUD and ORS route fetching
```
Files:
- `backend/TourPlanner.BL/Services/Interfaces/ITourService.cs`
- `backend/TourPlanner.BL/Services/TourService.cs`

---

**Commit 15 — Student 2**
```
feat(bl): implement TourLogService with difficulty and rating validation
```
Files:
- `backend/TourPlanner.BL/Services/Interfaces/ITourLogService.cs`
- `backend/TourPlanner.BL/Services/TourLogService.cs`

---

**Commit 16 — Student 2**
```
feat(bl): implement RouteService
```
Files:
- `backend/TourPlanner.BL/Services/Interfaces/IRouteService.cs`
- `backend/TourPlanner.BL/Services/RouteService.cs`

---

## Phase 4 — API Layer

**Commit 17 — Student 1**
```
feat(api): add AuthController with register and login endpoints
```
Files:
- `backend/TourPlanner.API/Controllers/AuthController.cs`

---

**Commit 18 — Student 1**
```
feat(api): add ToursController with CRUD endpoints
```
Files:
- `backend/TourPlanner.API/Controllers/ToursController.cs`

---

**Commit 19 — Student 2**
```
feat(api): add TourLogsController
```
Files:
- `backend/TourPlanner.API/Controllers/TourLogsController.cs`

---

**Commit 20 — Student 2**
```
feat(api): add RouteController for ORS proxy endpoint
```
Files:
- `backend/TourPlanner.API/Controllers/RouteController.cs`

---

**Commit 21 — Student 1**
```
feat(api): configure JWT authentication, CORS and DI in Program.cs
```
Files:
- `backend/TourPlanner.API/Program.cs`

---

**Commit 22 — Student 1**
```
feat(api): integrate log4net with rolling file appender
```
Files:
- `backend/TourPlanner.API/log4net.config`

---

**Commit 23 — Student 1**
```
chore(api): add appsettings.Example.json and gitignore real config
```
Files:
- `backend/TourPlanner.API/appsettings.Example.json`
- `.gitignore` (update)

---

## Phase 5 — Frontend

**Commit 24 — Student 2**
```
feat(frontend): add TypeScript types for auth, tours and tour logs
```
Files:
- `frontend/src/types/auth.types.ts`
- `frontend/src/types/tour.types.ts`
- `frontend/src/types/tourLog.types.ts`

---

**Commit 25 — Student 2**
```
feat(frontend): add Zustand auth store with JWT persistence
```
Files:
- `frontend/src/store/authStore.ts`

---

**Commit 26 — Student 2**
```
feat(frontend): add Axios client with Bearer token interceptor and 401 handler
```
Files:
- `frontend/src/api/axiosClient.ts`
- `frontend/src/api/auth.api.ts`
- `frontend/src/api/tours.api.ts`
- `frontend/src/api/tourLogs.api.ts`
- `frontend/src/api/route.api.ts`

---

**Commit 27 — Student 1**
```
feat(frontend): add LoginForm and RegisterForm components
```
Files:
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/pages/RegisterPage.tsx`

---

**Commit 28 — Student 1**
```
feat(frontend): add ProtectedRoute, Navbar and LoadingSpinner components
```
Files:
- `frontend/src/components/common/ProtectedRoute.tsx`
- `frontend/src/components/common/Navbar.tsx`
- `frontend/src/components/common/LoadingSpinner.tsx`
- `frontend/src/pages/NotFoundPage.tsx`

---

**Commit 29 — Student 1**
```
feat(frontend): add ToursPage with tour list and create form
```
Files:
- `frontend/src/components/tours/TourCard.tsx`
- `frontend/src/components/tours/TourList.tsx`
- `frontend/src/components/tours/TourForm.tsx`
- `frontend/src/pages/ToursPage.tsx`

---

**Commit 30 — Student 2**
```
feat(frontend): add TourDetailPage with tour info and logs section
```
Files:
- `frontend/src/pages/TourDetailPage.tsx`
- `frontend/src/components/tourLogs/TourLogCard.tsx`
- `frontend/src/components/tourLogs/TourLogList.tsx`
- `frontend/src/components/tourLogs/TourLogForm.tsx`

---

**Commit 31 — Student 1**
```
feat(frontend): integrate react-leaflet RouteMap component
```
Files:
- `frontend/src/components/map/RouteMap.tsx`

---

**Commit 32 — Student 1**
```
feat(frontend): wire up App routing and page structure
```
Files:
- `frontend/src/App.tsx` (update)
- `frontend/src/main.tsx` (update)

---

## Phase 6 — Bug Fixes

**Commit 33 — Student 1**
```
fix(bl): fix ORS API key Authorization header format
```
Files:
- `backend/TourPlanner.BL/HttpClients/OpenRouteServiceClient.cs` (update)

---

**Commit 34 — Student 1**
```
fix(api): add JsonStringEnumConverter to support string enum deserialization
```
Files:
- `backend/TourPlanner.API/Program.cs` (update)

---

**Commit 35 — Student 2**
```
fix(frontend): add vite-env.d.ts to resolve TypeScript build errors
```
Files:
- `frontend/src/vite-env.d.ts`

---

**Commit 36 — Student 1**
```
fix(bl): reduce HttpClient timeout to 15s for ORS requests
```
Files:
- `backend/TourPlanner.BL/HttpClients/OpenRouteServiceClient.cs` (update)

---

**Commit 37 — Student 2**
```
fix(docker): change npm ci to npm install in frontend Dockerfile
```
Files:
- `frontend/Dockerfile` (update)

---

## Phase 7 — Unit Tests

**Commit 38 — Student 1**
```
test: add AuthService unit tests covering register, login and validation
```
Files:
- `backend/TourPlanner.Tests/Services/AuthServiceTests.cs`

---

**Commit 39 — Student 1**
```
test: add TourService unit tests covering CRUD and ownership checks
```
Files:
- `backend/TourPlanner.Tests/Services/TourServiceTests.cs`

---

**Commit 40 — Student 2**
```
test: add TourLogService unit tests covering validation and access control
```
Files:
- `backend/TourPlanner.Tests/Services/TourLogServiceTests.cs`

---

## Phase 8 — Final Submission (later)

**Commit 41 — Student 2**
```
feat(dal): add SearchAsync to TourRepository for full-text search
```
Files:
- `backend/TourPlanner.DAL/Repositories/Interfaces/ITourRepository.cs` (update)
- `backend/TourPlanner.DAL/Repositories/TourRepository.cs` (update)

---

**Commit 42 — Student 2**
```
feat(bl): implement SearchToursAsync in TourService
```
Files:
- `backend/TourPlanner.BL/Services/Interfaces/ITourService.cs` (update)
- `backend/TourPlanner.BL/Services/TourService.cs` (update)

---

**Commit 43 — Student 2**
```
feat(api): add GET /api/tours/search endpoint
```
Files:
- `backend/TourPlanner.API/Controllers/ToursController.cs` (update)

---

**Commit 44 — Student 2**
```
feat(frontend): add TourSearch component with full-text search
```
Files:
- `frontend/src/components/tours/TourSearch.tsx`
- `frontend/src/api/tours.api.ts` (update)
- `frontend/src/pages/ToursPage.tsx` (update)

---

**Commit 45 — Student 1**
```
feat(bl): implement child-friendliness computed attribute formula
```
Files:
- `backend/TourPlanner.BL/Services/TourService.cs` (update)

---

**Commit 46 — Student 2**
```
test: add TourRepository and TourLogRepository integration tests
```
Files:
- `backend/TourPlanner.Tests/Repositories/TourRepositoryTests.cs`
- `backend/TourPlanner.Tests/Repositories/TourLogRepositoryTests.cs`

---

**Commit 47 — Student 1**
```
test: add RouteService unit tests
```
Files:
- `backend/TourPlanner.Tests/Services/RouteServiceTests.cs`

---

**Commit 48 — Student 1**
```
feat: add JSON import and export for tour data
```
Files:
- `backend/TourPlanner.API/Controllers/ToursController.cs` (update)
- `frontend/src/pages/ToursPage.tsx` (update)

---

**Commit 49 — Student 1**
```
feat: add unique feature
```
Files:
- *(whatever files your unique feature touches)*

---

**Commit 50 — Student 2**
```
docs: add protocol PDF for final submission
```
Files:
- `docs/protocol-intermediate.html`
- `docs/protocol-final.pdf`
- `README.md`

---

## Summary

| | Student 1 | Student 2 |
|---|---|---|
| **Commits** | 30 (60%) | 20 (40%) |
| **Main areas** | Setup, DAL base, BL core, API, Frontend auth/tours, Bug fixes, Tests | Frontend scaffold, DAL repos, BL logs/route, API logs/route, Frontend detail/logs, Final features |
