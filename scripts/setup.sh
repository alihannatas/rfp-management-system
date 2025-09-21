#!/bin/bash

# RFP Management System Setup Script

echo "🚀 Setting up RFP Management System with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p nginx/ssl

# Generate SSL certificates for development
echo "🔐 Generating SSL certificates..."
if [ ! -f nginx/ssl/cert.pem ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=TR/ST=Istanbul/L=Istanbul/O=RFP Management/CN=localhost"
    echo "✅ SSL certificates generated"
else
    echo "✅ SSL certificates already exist"
fi

# Copy environment files
echo "📋 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp docker.env backend/.env
    echo "✅ Backend .env file created"
fi

if [ ! -f frontend/.env ]; then
    echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env
    echo "✅ Frontend .env file created"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
docker-compose exec backend npx prisma generate

echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Database: localhost:5432"
echo ""
echo "📊 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Access database: docker-compose exec postgres psql -U rfp_user -d rfp_management"


