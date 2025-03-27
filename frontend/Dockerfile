# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm install --production --legacy-peer-deps

# Expose port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
