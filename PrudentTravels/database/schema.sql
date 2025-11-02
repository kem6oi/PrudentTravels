-- PrudentTravels Database Schema
-- PostgreSQL Database Creation and Setup

-- Create database (run as superuser)
-- CREATE DATABASE prudent_travels;
-- \c prudent_travels;

-- Note: Using gen_random_uuid() which is built into PostgreSQL 13+
-- No extension needed

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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    "isSuspended" BOOLEAN DEFAULT FALSE,
    "suspendedAt" TIMESTAMP,
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destinations table
CREATE TABLE IF NOT EXISTS "Destinations" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Bookings table
CREATE TABLE IF NOT EXISTS "Bookings" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "bookingNumber" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "destinationId" UUID NOT NULL REFERENCES "Destinations"(id) ON DELETE CASCADE,
    "checkInDate" DATE NOT NULL,
    "checkOutDate" DATE NOT NULL,
    adults INTEGER NOT NULL CHECK (adults >= 1),
    children INTEGER DEFAULT 0 CHECK (children >= 0),
    infants INTEGER DEFAULT 0 CHECK (infants >= 0),
    "totalGuests" INTEGER NOT NULL,
    "basePrice" DECIMAL(10, 2) NOT NULL,
    taxes DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status booking_status DEFAULT 'pending',
    "paymentStatus" VARCHAR(50) DEFAULT 'pending',
    "paymentMethod" VARCHAR(50),
    "promoCode" VARCHAR(50),
    "specialRequests" TEXT,
    "guestDetails" JSONB DEFAULT '{}',
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP,
    "cancelledBy" UUID,
    "refundAmount" DECIMAL(10, 2),
    "refundedAt" TIMESTAMP,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS "Payments" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "bookingId" UUID NOT NULL REFERENCES "Bookings"(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "transactionId" VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    method VARCHAR(50) NOT NULL,
    provider VARCHAR(50) DEFAULT 'stripe',
    "providerTransactionId" VARCHAR(255),
    "providerResponse" JSONB DEFAULT '{}',
    "refundAmount" DECIMAL(10, 2),
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS "Reviews" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "destinationId" UUID NOT NULL REFERENCES "Destinations"(id) ON DELETE CASCADE,
    "bookingId" UUID REFERENCES "Bookings"(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    pros TEXT[],
    cons TEXT[],
    images TEXT[],
    "helpfulCount" INTEGER DEFAULT 0,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "adminResponse" TEXT,
    "adminResponseAt" TIMESTAMP,
    "isPublished" BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support Tickets table
CREATE TABLE IF NOT EXISTS "SupportTickets" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "ticketNumber" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    "assignedTo" UUID REFERENCES "Users"(id) ON DELETE SET NULL,
    "bookingId" UUID REFERENCES "Bookings"(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ticket_category DEFAULT 'general',
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    attachments TEXT[],
    "resolvedAt" TIMESTAMP,
    "closedAt" TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    "internalNotes" TEXT,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo Codes table
CREATE TABLE IF NOT EXISTS "PromoCodes" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    "discountType" VARCHAR(20) NOT NULL CHECK ("discountType" IN ('percentage', 'fixed')),
    "discountValue" DECIMAL(10, 2) NOT NULL CHECK ("discountValue" >= 0),
    "minimumPurchase" DECIMAL(10, 2) DEFAULT 0,
    "maximumDiscount" DECIMAL(10, 2),
    "validFrom" TIMESTAMP NOT NULL,
    "validUntil" TIMESTAMP NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER DEFAULT 0,
    "usageLimitPerUser" INTEGER DEFAULT 1,
    "applicableDestinations" UUID[],
    "applicableCategories" TEXT[],
    "excludedDestinations" UUID[],
    "isActive" BOOLEAN DEFAULT TRUE,
    terms TEXT,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destination Images table
CREATE TABLE IF NOT EXISTS "DestinationImages" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "destinationId" UUID NOT NULL REFERENCES "Destinations"(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    "isMain" BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_users_role ON "Users"(role);
CREATE INDEX idx_users_suspended ON "Users"("isSuspended");
CREATE INDEX idx_destinations_country ON "Destinations"(country);
CREATE INDEX idx_destinations_city ON "Destinations"(city);
CREATE INDEX idx_destinations_price ON "Destinations"(price);
CREATE INDEX idx_destinations_slug ON "Destinations"(slug);
CREATE INDEX idx_destinations_active ON "Destinations"("isActive");
CREATE INDEX idx_destinations_featured ON "Destinations"("isFeatured");
CREATE INDEX idx_bookings_user ON "Bookings"("userId");
CREATE INDEX idx_bookings_destination ON "Bookings"("destinationId");
CREATE INDEX idx_bookings_status ON "Bookings"(status);
CREATE INDEX idx_bookings_checkin ON "Bookings"("checkInDate");
CREATE INDEX idx_payments_booking ON "Payments"("bookingId");
CREATE INDEX idx_payments_user ON "Payments"("userId");
CREATE INDEX idx_payments_status ON "Payments"(status);
CREATE INDEX idx_reviews_destination ON "Reviews"("destinationId");
CREATE INDEX idx_reviews_user ON "Reviews"("userId");
CREATE INDEX idx_tickets_user ON "SupportTickets"("userId");
CREATE INDEX idx_tickets_assigned ON "SupportTickets"("assignedTo");
CREATE INDEX idx_tickets_status ON "SupportTickets"(status);
CREATE INDEX idx_promo_codes_code ON "PromoCodes"(code);
CREATE INDEX idx_destination_images_destination ON "DestinationImages"("destinationId");

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

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON "Bookings"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON "Payments"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON "Reviews"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON "SupportTickets"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON "PromoCodes"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destination_images_updated_at BEFORE UPDATE ON "DestinationImages"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();