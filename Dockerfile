# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pass environment from GitHub Actions
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Copy appropriate .env file
RUN if [ "$NODE_ENV" = "production" ]; then \
      cp .env.production .env.local && npm run build; \
    else \
      cp .env.development .env.local; \
    fi

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Only copy .next for production
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
COPY --from=builder /app/.next ./.next

EXPOSE 3000

# Start command based on environment
CMD if [ "$NODE_ENV" = "production" ]; then \
      npm start; \
    else \
      npm run dev -- --hostname 0.0.0.0; \
    fi
