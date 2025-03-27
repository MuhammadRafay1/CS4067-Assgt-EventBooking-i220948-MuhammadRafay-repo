# Use a minimal Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose the service port
EXPOSE 4002

# Define the startup command
CMD ["node", "server.js"]
