-- Database initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (already created by POSTGRES_DB)
-- CREATE DATABASE rfp_management;

-- Create user if it doesn't exist (already created by POSTGRES_USER)
-- CREATE USER rfp_user WITH PASSWORD 'rfp_password';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE rfp_management TO rfp_user;

-- Enable extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- This script will be executed after Prisma migrations


