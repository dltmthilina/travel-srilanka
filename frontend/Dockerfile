# Stage 1: Build the frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Clear npm cache before installing dependencies
RUN npm cache clean --force

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

