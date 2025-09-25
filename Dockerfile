FROM node:20-alpine as base

# Enable corepack for pnpm
RUN corepack enable

FROM base as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Payload types and build
ENV NODE_OPTIONS=--no-deprecation
RUN pnpm generate:types
RUN pnpm build

FROM base as runner
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the SQLite database if it exists
COPY --from=builder --chown=nextjs:nodejs /app/website.db ./website.db 2>/dev/null || true

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
