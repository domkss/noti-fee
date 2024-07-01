# Use node:22-alpine as the base image
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check the URL to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install additional dependencies
RUN apk --no-cache add curl bash && \
    VERSION=$(curl https://envkey-releases.s3.amazonaws.com/latest/envkeysource-version.txt) && \
    curl -s https://envkey-releases.s3.amazonaws.com/envkeysource/release_artifacts/$VERSION/install.sh | bash && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

# Copy built files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/resources ./resources
COPY .env ./

# Install only production dependencies
RUN npm install --only=production

# Run Prisma migrations
RUN envkey-source -w --rolling -- npx prisma migrate deploy

# Set environment variables from .env file
ENV $(cat .env | grep -v ^# | xargs)

# Use the nextjs user to run the application
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD envkey-source -w --rolling -- npx next start
