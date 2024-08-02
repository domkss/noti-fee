# Use the official Node.js image as the base image
FROM node:22.4.1-alpine AS base

# Create and change to the app directory
WORKDIR /app

RUN apk add --no-cache bash curl && curl -1sLf \
    'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
    && apk add infisical

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy Dependency files
COPY . .

# Compile TypeScript code
RUN npx tsc


ENV NODE_ENV production
# Init envkey variable
ARG PROJECT_ID
ENV PROJECT_ID=$PROJECT_ID
ARG INFISICAL_TOKEN
ENV INFISICAL_TOKEN=$INFISICAL_TOKEN


# Command to run the application
CMD infisical run --env=prod --projectId ${PROJECT_ID} -- node dist/scheduler.js
