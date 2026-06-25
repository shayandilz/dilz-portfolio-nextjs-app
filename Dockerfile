FROM node:20-alpine AS base
# Install pnpm globally so it is available in all subsequent stages
RUN npm install -g pnpm

# Step 1: Install dependencies
FROM base AS deps
# Added build tools for native dependencies
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set ignore-scripts false && pnpm i --frozen-lockfile

# Step 2: Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept arguments from GitHub Actions
ARG NEXT_PUBLIC_WORDPRESS_SITE_URL
ARG NEXT_PUBLIC_FRONTEND_DOMAIN
ARG NEXT_PUBLIC_ITEM_PER_SITEMAP
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS

# Make them available to Next.js during compilation
ENV NEXT_PUBLIC_WORDPRESS_SITE_URL=$NEXT_PUBLIC_WORDPRESS_SITE_URL
ENV NEXT_PUBLIC_FRONTEND_DOMAIN=$NEXT_PUBLIC_FRONTEND_DOMAIN
ENV NEXT_PUBLIC_ITEM_PER_SITEMAP=$NEXT_PUBLIC_ITEM_PER_SITEMAP
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS=$NEXT_PUBLIC_GOOGLE_ANALYTICS

ENV NEXT_TELEMETRY_DISABLED=1
# Use pnpm to build
RUN pnpm run build

# Step 3: Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]