# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# ARG for environment
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Debug: show NODE_ENV
RUN echo "========================"
RUN echo "NODE_ENV is: $NODE_ENV"
RUN echo "========================"

# Debug: list env files before copy
RUN echo "Listing env files before copy:"
RUN ls -l .env.*

# Copy appropriate env file
RUN if [ "$NODE_ENV" = "production" ]; then \
      echo "Using production env"; \
      cp .env.production .env.local; \
    else \
      echo "Using development env"; \
      cp .env.development .env.local; \
    fi

# Debug: check if .env.local exists
RUN echo "Checking .env.local after copy:"
RUN ls -l .env.local
RUN echo "Contents of .env.local:"
RUN cat .env.local || echo "File is empty or not found"

# Run build
RUN echo "Starting Next.js build..."
RUN npm run build
RUN echo "Build finished!"

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
