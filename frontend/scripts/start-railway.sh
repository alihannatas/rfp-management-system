#!/bin/sh

# Start backend server
echo "Starting backend server..."
cd /app/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start nginx
echo "Starting nginx..."
nginx -g "daemon off;"
