# Step 1: Build Stage
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy the rest of your Next.js app
COPY ./ ./
RUN npm run db:generate

# Build the app
RUN npm run build

# Step 2: Production Stage
FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

# Copy the built app from the builder
COPY --from=builder /app ./
RUN npm run db:generate

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]