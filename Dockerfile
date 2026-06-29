# ── Stage 1: Build ──
FROM node:26-slim AS build

# Install pnpm 11
RUN npm install -g pnpm@11.9.0

WORKDIR /app

# Copy lockfile and package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copy source and build the SSR app
COPY . .
RUN pnpm run build

# ── Stage 2: Runtime ──
FROM node:26-slim

WORKDIR /app

# Copy the build output
COPY --from=build /app/dist/orita /app/dist/app

EXPOSE 4000
ENV NODE_ENV=production

# Start the SSR server
CMD ["node", "dist/app/server/server.mjs"]
