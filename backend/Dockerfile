# Use Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependency files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

RUN npm run build

# Expose the application port (informational)
EXPOSE 3000

# Command to run the server
CMD ["node", "dist/server.js"]
