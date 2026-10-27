# ========================================================
# ContentFlow AI - React Frontend Multi-Stage Dockerfile
# ========================================================

# Stage 1: Build the production bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci || npm install

# Copy application source files
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Serve production bundle via high-performance Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
