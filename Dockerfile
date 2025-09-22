# Multi-stage build for complete RFP Management System
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    nginx \
    supervisor \
    curl

# Create app directory
WORKDIR /app

# ================================
# Backend Stage
# ================================
FROM base AS backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Build backend
RUN npm run build

# Generate Prisma client after build
RUN npx prisma generate

# ================================
# Frontend Stage
# ================================
FROM base AS frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# ================================
# Final Stage
# ================================
FROM base AS final

# Install PostgreSQL
RUN apk add --no-cache postgresql postgresql-contrib

# Create postgres directories
RUN mkdir -p /var/lib/postgresql/data
RUN chown -R postgres:postgres /var/lib/postgresql

# Copy backend build
COPY --from=backend /app/dist ./backend/dist
COPY --from=backend /app/node_modules ./backend/node_modules
COPY --from=backend /app/package*.json ./backend/
COPY --from=backend /app/prisma ./backend/prisma

# Copy frontend build
COPY --from=frontend /app/dist ./frontend/dist

# Copy nginx configuration
COPY nginx/nginx-single.conf /etc/nginx/nginx.conf

# Copy startup script
COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://rfp_user:rfp_password@localhost:5432/rfp_management?schema=public
ENV JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
ENV JWT_EXPIRES_IN=7d
ENV PORT=3001
ENV CORS_ORIGIN=http://localhost:3000
ENV VITE_API_URL=http://localhost:3001/api

# Expose ports
EXPOSE 80 3001 5432

# Start all services
CMD ["/start.sh"]
