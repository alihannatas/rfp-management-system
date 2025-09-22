#!/bin/sh

# Initialize PostgreSQL if not already done
if [ ! -f "/var/lib/postgresql/data/postgresql.conf" ]; then
    echo "Initializing PostgreSQL database..."
    su - postgres -c "initdb -D /var/lib/postgresql/data"
    
    # Start PostgreSQL temporarily to create user and database
    su - postgres -c "pg_ctl -D /var/lib/postgresql/data start"
    
    # Wait for PostgreSQL to start
    echo "Waiting for PostgreSQL to start..."
    sleep 5
    
    # Create database and user
    echo "Creating database and user..."
    su - postgres -c "psql -c \"CREATE USER rfp_user WITH PASSWORD 'rfp_password';\""
    su - postgres -c "psql -c \"CREATE DATABASE rfp_management OWNER rfp_user;\""
    su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE rfp_management TO rfp_user;\""
    
    # Stop PostgreSQL
    su - postgres -c "pg_ctl -D /var/lib/postgresql/data stop"
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
su - postgres -c "pg_ctl -D /var/lib/postgresql/data start"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U rfp_user -d rfp_management; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up and running!"

# Run database migrations
echo "Running database migrations..."
cd /app/backend
npx prisma migrate deploy

# Start backend in background
echo "Starting backend server..."
cd /app/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Function to handle shutdown
shutdown() {
    echo "Shutting down services..."
    kill $BACKEND_PID $NGINX_PID
    su - postgres -c "pg_ctl -D /var/lib/postgresql/data stop"
    exit 0
}

# Trap shutdown signals
trap shutdown SIGTERM SIGINT

# Keep container running
echo "All services started successfully!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:80"
echo "Database: localhost:5432"

# Wait for any process to exit
wait
