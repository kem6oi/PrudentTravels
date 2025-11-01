-- PrudentTravels Database Schema
-- PostgreSQL Database Creation and Setup

-- Create database (run as superuser)
-- CREATE DATABASE prudent_travels;
-- \c prudent_travels;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'traveler', 'support');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM ('booking', 'payment', 'refund', 'technical', 'general', 'complaint');
CREATE TYPE destination_difficulty AS ENUM ('Easy', 'Moderate', 'Challenging', 'Difficult');

-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role DEFAULT 'traveler',
    avatar VARCHAR(255),
    bio TEXT,
    address JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{"newsletter": true, "notifications": true, "currency": "USD", "language": "en"}',
    "emailVerified" BOOLEAN DEFAULT FALSE,
    "emailVerificationToken" VARCHAR(255),
    "passwordResetToken" VARCHAR(255),
    "passwordResetExpires" TIMESTAMP,
    "lastLogin" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destinations table
CREATE TABLE IF NOT EXISTS "Destinations" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    "shortDescription" VARCHAR(500) NOT NULL,
    "mainImage" VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    coordinates JSONB DEFAULT '{"latitude": null, "longitude": null}',
    price DECIMAL(10, 2) NOT NULL,
    "originalPrice" DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    duration JSONB DEFAULT '{"days": 1, "nights": 0}',
    category TEXT[],
    highlights TEXT[],
    included TEXT[],
    "notIncluded" TEXT[],
    itinerary JSONB DEFAULT '[]',
    "maxGroupSize" INTEGER DEFAULT 10,
    "minGroupSize" INTEGER DEFAULT 1,
    difficulty destination_difficulty DEFAULT 'Easy',
    "ageRange" JSONB DEFAULT '{"min": 0, "max": 99}',
    languages TEXT[] DEFAULT ARRAY['English'],
    rating DECIMAL(2, 1) DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "bookingCount" INTEGER DEFAULT 0,
    tags TEXT[],
    "seoTitle" VARCHAR(255),
    "seoDescription" TEXT,
    "seoKeywords" TEXT[],
    "isActive" BOOLEAN DEFAULT TRUE,
    "isFeatured" BOOLEAN DEFAULT FALSE,
    "viewCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_users_role ON "Users"(role);
CREATE INDEX idx_destinations_country ON "Destinations"(country);
CREATE INDEX idx_destinations_city ON "Destinations"(city);
CREATE INDEX idx_destinations_price ON "Destinations"(price);
CREATE INDEX idx_destinations_slug ON "Destinations"(slug);
CREATE INDEX idx_destinations_active ON "Destinations"("isActive");
CREATE INDEX idx_destinations_featured ON "Destinations"("isFeatured");

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON "Destinations"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();