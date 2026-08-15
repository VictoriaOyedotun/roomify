# Roomify

[![CI](https://github.com/VictoriaOyedotun/roomify/actions/workflows/ci.yml/badge.svg)](https://github.com/VictoriaOyedotun/roomify/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-2457ff.svg)](LICENSE)

Roomify is a full-stack roommate marketplace that helps people find listings and evaluate compatibility based on how they prefer to live. It combines the practical parts of housing search—profiles, filters, listings, and messaging—with a transparent questionnaire-based matching flow.

## What it does

- Registers and authenticates users with stateless JWT sessions
- Supports public listing discovery with location, rent, type, and pagination filters
- Lets authenticated users create, update, and manage their own listings
- Collects living-preference answers for users and available rooms
- Calculates weighted compatibility scores and ranks recommendations
- Provides conversations and messages between users

## Architecture

```text
React + Vite client
  ├─ pages and reusable layout components
  ├─ AuthContext for session state
  └─ API client
         │ JSON over REST
Spring Boot API
  ├─ controllers: HTTP and validation boundary
  ├─ services: business rules and authorization
  ├─ security: JWT filter and password hashing
  ├─ repositories: Spring Data JPA
  └─ domain model
         │
H2 for local development / PostgreSQL for production
```

The frontend and backend are separate applications so each can be built and deployed independently. Docker Compose and the dev container provide a consistent two-service development environment.

## My responsibilities

- Designed and implemented the React and Spring Boot application structure
- Built authentication, profile management, listing CRUD, filtering, and ownership checks
- Modelled users, listings, conversations, messages, questions, answers, and compatibility scores
- Implemented the weighted questionnaire matching flow and recommendation ranking
- Added Docker and Codespaces development paths to reduce setup friction
- Extended the original product with messaging and listing-specific ideal-roommate profiles

## Matching approach

Roomify compares a user’s answers with the ideal profile attached to a room listing. Each question has a weight; matching answers contribute that weight to the final score.

```text
compatibility = matching answer weight / total question weight × 100
```

This approach is intentionally explainable. A more advanced model could support ranges, partial matches, importance selected by each user, or learned recommendations.

## Technical decisions and trade-offs

- **JWT authentication:** keeps the API stateless and simple to scale, but production logout and token revocation would need an additional strategy.
- **H2 locally, PostgreSQL in production:** makes onboarding fast while retaining a production-grade database path. Database-specific behaviour still needs integration testing against PostgreSQL.
- **Synchronous score recomputation:** keeps recommendation logic clear for the current dataset. Larger usage would benefit from incremental updates or background processing.
- **Exact weighted matching:** is predictable and easy to explain, but less nuanced than range-based or probabilistic matching.
- **Separate frontend and backend:** supports independent deployment, with the cost of maintaining API contracts and cross-origin configuration.

## Run locally

### Requirements

- Java 17 and Maven
- Node.js 18+ and npm

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080` and uses an in-memory H2 database by default.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the backend during development.

### Docker

```bash
docker compose up --build
```

This starts both applications with the frontend on port `5173` and backend on port `8080`.

## Configuration

Backend configuration lives in `backend/src/main/resources/application.yml`.

| Variable | Purpose |
| --- | --- |
| `SPRING_DATASOURCE_URL` | Production PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `JWT_SECRET` | Signing secret; use at least 256 bits in production |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `VITE_API_BASE_URL` | Frontend API base URL when not using the dev proxy |

## API overview

| Area | Representative endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Profile | `GET /api/users/me`, `PUT /api/users/me` |
| Listings | `GET /api/listings`, `POST /api/listings`, `PUT /api/listings/{id}` |
| Matching | `GET /api/matchmaking/questions`, `POST /api/matchmaking/answers`, `GET /api/matchmaking/recommendations` |
| Messaging | `/api/chat/**` |

## Tests and CI

```bash
cd backend
mvn test
```

The backend suite currently covers service-level creation and ownership rules. GitHub Actions runs the backend tests and a production frontend build on every push and pull request.

## Lessons learned

- Authorization belongs in the service layer as well as the route configuration; authenticated users should still be checked against resource ownership.
- Recommendation systems are easier to trust when the scoring rule is visible and testable.
- A good local setup is part of the product: Docker and Codespaces reduce the time between cloning and making a useful change.
- Separate API and UI projects make boundaries clearer, but require deliberate configuration and error handling at that boundary.

## License

Roomify is available under the [MIT License](LICENSE).
