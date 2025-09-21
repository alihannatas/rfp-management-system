# RFP Management System - Docker Setup

This project can be easily set up using Docker Compose. All services (PostgreSQL, Backend API, Frontend) run with a single command.

## 🚀 Quick Start

### 1. Automatic Setup (Recommended)

```bash
# Run the setup script
./scripts/setup.sh
```

### 2. Manual Setup

```bash
# 1. Create SSL certificates
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=RFP Management/CN=localhost"

# 2. Copy environment files
cp docker.env backend/.env
echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env

# 3. Start services
docker-compose up --build -d

# 4. Run database migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
```

## 📋 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Backend API | 3001 | Node.js API |
| PostgreSQL | 5432 | Database |
| Nginx | 80/443 | Reverse proxy |

## 🛠️ Commands

### Basic Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Development Commands

```bash
# Run in development mode
docker-compose -f docker-compose.dev.yml up -d

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Database Commands

```bash
# Connect to database
docker-compose exec postgres psql -U rfp_user -d rfp_management

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

## 🔧 Configuration

### Environment Variables

Backend `backend/.env`:
```env
DATABASE_URL="postgresql://rfp_user:rfp_password@postgres:5432/rfp_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV="production"
```

Frontend `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### Database

- **Host**: localhost
- **Port**: 5432
- **Database**: rfp_management
- **Username**: rfp_user
- **Password**: rfp_password

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Prisma Studio**: `docker-compose exec backend npx prisma studio`

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Stop all services and clean up
docker-compose down -v
docker system prune -f

# Start again
docker-compose up --build -d
```

### Database Connection Error

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Check database status
docker-compose exec postgres pg_isready -U rfp_user -d rfp_management
```

### Port Conflict

If ports are in use, change port numbers in `docker-compose.yml`:

```yaml
ports:
  - "3001:3001"  # Backend
  - "3000:80"    # Frontend
  - "5432:5432"  # PostgreSQL
```

## 📁 File Structure

```
rfp-management-system/
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
├── docker.env                  # Environment variables template
├── .dockerignore              # Docker ignore file
├── scripts/
│   └── setup.sh               # Setup script
├── nginx/
│   └── nginx.conf             # Nginx configuration
├── backend/
│   ├── Dockerfile             # Backend production image
│   ├── Dockerfile.dev         # Backend development image
│   └── prisma/
│       └── init.sql           # Database initialization
└── frontend/
    ├── Dockerfile             # Frontend production image
    ├── Dockerfile.dev         # Frontend development image
    └── nginx.conf             # Frontend nginx config
```

## 🔒 Security

### Important Notes for Production

1. **JWT Secret**: Change `JWT_SECRET` in `docker.env` to a strong value
2. **Database Password**: Change `rfp_password` to a strong password
3. **SSL Certificates**: Use real SSL certificates for production
4. **Environment Variables**: Pass sensitive information as environment variables

### SSL Certificates

Self-signed certificates are automatically created for development. For production:

```bash
# Get SSL certificate with Let's Encrypt
certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx/ssl/ folder
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

## 📊 Monitoring

### Health Checks

```bash
# Check status of all services
docker-compose ps

# View health check results
docker-compose exec backend curl -f http://localhost:3001/health
```

### Logs

```bash
# Follow all logs
docker-compose logs -f

# Filter logs for specific service
docker-compose logs -f backend | grep ERROR
```

## 🚀 Deployment

### Production Deployment

1. Update environment variables with production values
2. Replace SSL certificates with real certificates
3. Deploy with Docker Compose:

```bash
docker-compose -f docker-compose.yml up -d
```

### Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Works with Nginx load balancer
```

With this Docker setup, you can easily run and manage the RFP Management System! 🎉