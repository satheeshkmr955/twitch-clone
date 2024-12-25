# Step 1: Build Stage
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy the rest of your Next.js app
COPY ./ ./

# Build the app
RUN npm run build

# Step 2: Production Stage
FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

# Install production dependencies
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production

# Copy the built app from the builder
COPY --from=builder /app ./
COPY --from=builder /app/build /app/build
COPY --from=builder /app/public /app/public
RUN npm run db:generate

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]