# Dev image: Node 20 for Vite + React
FROM node:20-alpine

WORKDIR /app

# Install deps (cached unless package files change)
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite dev server; API_PROXY_TARGET set in compose for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
