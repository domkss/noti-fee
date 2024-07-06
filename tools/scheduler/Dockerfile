# Use the official Node.js image as the base image
FROM node:22-alpine AS base

# Create and change to the app directory
WORKDIR /app

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
ARG ENVKEY
ENV ENVKEY $ENVKEY


# Command to run the application
CMD node dist/scheduler.js
