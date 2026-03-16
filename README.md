# ROOMIFY – Roommate Marketplace

Find roommates and listings. Browse, post, and get matchmaking recommendations based on living-habit compatibility.

## Stack

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Spring Security (JWT), H2 (dev) / PostgreSQL (prod)
- **Frontend:** React 18, React Router, Vite

## Quick start

### Option A: Run in the browser (no local install)

Use **GitHub Codespaces** so you don’t need Docker, Java, or Node on your machine—everything runs in the cloud and you work in the browser.

1. Push this repo to GitHub (if you haven’t already).
2. On the repo page, click **Code** → **Codespaces** → **Create codespace on main** (or use the **+** to create one).
3. When the codespace is ready, open **two terminals** in the browser:
   - **Terminal 1:** `cd backend && mvn spring-boot:run`
   - **Terminal 2:** `cd frontend && npm run dev`
4. When the frontend is up, click **Open in Browser** for port **5173** (or use the “Ports” panel to open the forwarded URL).

The dev container already has Node 20 and Java 17 + Maven; `postCreateCommand` runs `npm install` and Maven dependency fetch once when the codespace is created. Alternatively, from the repo root you can run `./.devcontainer/start-dev.sh` to start both backend and frontend in one go (backend in background, frontend in foreground).

### Option B: Docker (local)

1. From the project root:
   ```bash
   docker compose up --build
   ```
2. Open **http://localhost:5173** in your browser. The frontend proxies `/api` to the backend.
3. Backend runs on port 8080 (H2 in-memory DB). Code changes in `backend/` and `frontend/` are picked up via mounted volumes (backend may need a restart for Java changes; frontend hot-reloads).

To stop: `docker compose down`.

### Option C: Local install (no Docker)

### Backend

1. Install Java 17+ and Maven (or use the Maven wrapper if available).
2. From `roomify/backend`:
   - `mvn spring-boot:run`
3. API runs at `http://localhost:8080`. Default config uses an in-memory H2 database.

### Frontend

1. Install Node 18+ and npm.
2. From `roomify/frontend`:
   - `npm install`
   - `npm run dev`
3. App runs at `http://localhost:5173` and proxies `/api` to the backend.

### First run

- Register a user, then log in.
- Browse listings (public), post a listing, take the matchmaking quiz, and view recommendations.
- For “Room available” listings, edit the listing and use “Set ideal roommate profile” to run the same quiz for that listing and improve match scores.

## Configuration

- **Backend:** `backend/src/main/resources/application.yml`. For production, set `SPRING_DATASOURCE_*` and `JWT_SECRET` (min 256 bits for JJWT).
- **Frontend:** Set `VITE_API_BASE_URL` to the backend base URL when not using the Vite proxy (e.g. production build).

## API overview

- `POST /api/auth/register`, `POST /api/auth/login` – auth
- `GET/PUT /api/users/me` – profile
- `GET /api/listings` (optional: type, location, rentMin, rentMax, page, size), `GET /api/listings/:id` – browse
- `POST /api/listings`, `PUT /api/listings/:id`, `DELETE /api/listings/:id`, `GET /api/listings/my` – manage listings (auth)
- `GET /api/matchmaking/questions`, `POST /api/matchmaking/answers`, `GET /api/matchmaking/recommendations` – quiz and matches (auth)
