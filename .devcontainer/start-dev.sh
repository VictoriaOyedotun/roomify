#!/usr/bin/env bash
# Start backend and frontend for Roomify (run from repo root in Codespaces).
set -e
cd "$(dirname "$0")/.."

# Start backend in background
cd backend && mvn spring-boot:run -q &
BACKEND_PID=$!
cd ..

# Wait for backend to be up
echo "Waiting for backend on :8080..."
for i in {1..60}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/listings 2>/dev/null | grep -qE '^[0-9]+$'; then
    break
  fi
  sleep 1
done

# Start frontend in foreground (so the dev container stays running and you see logs)
cd frontend && npm run dev

# When frontend exits, stop backend
kill $BACKEND_PID 2>/dev/null || true
