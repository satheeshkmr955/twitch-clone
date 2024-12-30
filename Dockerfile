# Step 1: Build Stage
FROM node:22-alpine AS builder

RUN apk update && apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm ci

# Copy the rest of your Next.js app
COPY ./ ./
RUN npm run codegen && npm run db:generate && npm run build

# Step 2: Production Stage
FROM node:22-alpine

WORKDIR /app

# Install runtime dependencies (openssl in this case)
RUN apk update && apk add --no-cache openssl

# Copy the built app from the builder
COPY --from=builder /app ./

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]