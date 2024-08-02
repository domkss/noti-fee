# Use node:22-alpine as the base image
FROM node:22.4.1-alpine AS base

# Install dependencies only when needed
FROM base AS deps

ARG PROJECT_ID
ARG INFISICAL_TOKEN

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

RUN apk add --no-cache bash curl && curl -1sLf \
    'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash && \
    apk add infisical



ENV INFISICAL_TOKEN=$INFISICAL_TOKEN


# Build the application

RUN infisical run --env=prod --projectId ${PROJECT_ID} --command "npx prisma generate && npx next build"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install additional dependencies
RUN apk add --no-cache bash curl && curl -1sLf \
    'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash && \
    apk add infisical && \
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


# Install only production dependencies
RUN npm install --only=production

ENV INFISICAL_TOKEN=$INFISICAL_TOKEN

# Use the nextjs user to run the application
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD infisical run --env=prod --projectId ${PROJECT_ID} --command "npx prisma migrate deploy && npx next start"