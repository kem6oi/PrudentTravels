-- PrudentTravels Additional Performance Indexes
-- This file contains additional indexes for optimal query performance

-- ============================================
-- COMPOSITE INDEXES for Common Query Patterns
-- ============================================

-- Users: Find active non-suspended users by role
CREATE INDEX IF NOT EXISTS idx_users_active_not_suspended 
    ON "Users"("isActive", "isSuspended", role) 
    WHERE "isActive" = true AND "isSuspended" = false;

-- Users: Email verification and account status
CREATE INDEX IF NOT EXISTS idx_users_email_verified_active 
    ON "Users"("emailVerified", "isActive");

-- Users: Last login for activity tracking
CREATE INDEX IF NOT EXISTS idx_users_last_login 
    ON "Users"("lastLogin" DESC NULLS LAST);

-- Destinations: Active featured destinations by country
CREATE INDEX IF NOT EXISTS idx_destinations_featured_active_country 
    ON "Destinations"("isFeatured", "isActive", country) 
    WHERE "isFeatured" = true AND "isActive" = true;

-- Destinations: Price range queries with active filter
CREATE INDEX IF NOT EXISTS idx_destinations_price_active 
    ON "Destinations"(price, "isActive") 
    WHERE "isActive" = true;

-- Destinations: Popular destinations (by rating and review count)
CREATE INDEX IF NOT EXISTS idx_destinations_rating_reviews 
    ON "Destinations"(rating DESC, "reviewCount" DESC) 
    WHERE "isActive" = true;

-- Destinations: Booking count for trending destinations
CREATE INDEX IF NOT EXISTS idx_destinations_booking_count 
    ON "Destinations"("bookingCount" DESC) 
    WHERE "isActive" = true;

-- Destinations: Category search (GIN index for array columns)
CREATE INDEX IF NOT EXISTS idx_destinations_category_gin 
    ON "Destinations" USING GIN(category);

CREATE INDEX IF NOT EXISTS idx_destinations_tags_gin 
    ON "Destinations" USING GIN(tags);

-- Destinations: Full-text search on name and description
CREATE INDEX IF NOT EXISTS idx_destinations_name_trgm 
    ON "Destinations" USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_destinations_description_trgm 
    ON "Destinations" USING gin(description gin_trgm_ops);

-- Bookings: User's booking history by status
CREATE INDEX IF NOT EXISTS idx_bookings_user_status 
    ON "Bookings"("userId", status, "createdAt" DESC);

-- Bookings: Destination bookings by date range
CREATE INDEX IF NOT EXISTS idx_bookings_destination_dates 
    ON "Bookings"("destinationId", "checkInDate", "checkOutDate");

-- Bookings: Upcoming bookings
CREATE INDEX IF NOT EXISTS idx_bookings_upcoming 
    ON "Bookings"("checkInDate") 
    WHERE status IN ('pending', 'confirmed');

-- Bookings: Payment status tracking
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status 
    ON "Bookings"("paymentStatus", status);

-- Bookings: Booking number lookup
CREATE INDEX IF NOT EXISTS idx_bookings_number_lower 
    ON "Bookings"(LOWER("bookingNumber"));

-- Payments: User payment history
CREATE INDEX IF NOT EXISTS idx_payments_user_status_date 
    ON "Payments"("userId", status, "createdAt" DESC);

-- Payments: Transaction lookup
CREATE INDEX IF NOT EXISTS idx_payments_transaction_lower 
    ON "Payments"(LOWER("transactionId"));

-- Payments: Provider transaction tracking
CREATE INDEX IF NOT EXISTS idx_payments_provider_transaction 
    ON "Payments"(provider, "providerTransactionId");

-- Payments: Refund tracking
CREATE INDEX IF NOT EXISTS idx_payments_refunded 
    ON "Payments"("refundedAt") 
    WHERE status = 'refunded';

-- Reviews: Destination reviews with published filter
CREATE INDEX IF NOT EXISTS idx_reviews_destination_published 
    ON "Reviews"("destinationId", "isPublished", "createdAt" DESC) 
    WHERE "isPublished" = true;

-- Reviews: User's reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_published 
    ON "Reviews"("userId", "isPublished", "createdAt" DESC);

-- Reviews: Verified reviews
CREATE INDEX IF NOT EXISTS idx_reviews_verified_rating 
    ON "Reviews"("isVerified", rating, "createdAt" DESC) 
    WHERE "isVerified" = true;

-- Reviews: Helpful reviews
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count 
    ON "Reviews"("helpfulCount" DESC) 
    WHERE "isPublished" = true;

-- Support Tickets: User's tickets
CREATE INDEX IF NOT EXISTS idx_tickets_user_status_date 
    ON "SupportTickets"("userId", status, "createdAt" DESC);

-- Support Tickets: Assigned tickets by status
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_status 
    ON "SupportTickets"("assignedTo", status, priority DESC, "createdAt" DESC) 
    WHERE "assignedTo" IS NOT NULL;

-- Support Tickets: Unassigned tickets
CREATE INDEX IF NOT EXISTS idx_tickets_unassigned 
    ON "SupportTickets"(status, priority DESC, "createdAt") 
    WHERE "assignedTo" IS NULL;

-- Support Tickets: Category and priority
CREATE INDEX IF NOT EXISTS idx_tickets_category_priority 
    ON "SupportTickets"(category, priority, status);

-- Support Tickets: Ticket number lookup
CREATE INDEX IF NOT EXISTS idx_tickets_number_lower 
    ON "SupportTickets"(LOWER("ticketNumber"));

-- Support Tickets: Booking related tickets
CREATE INDEX IF NOT EXISTS idx_tickets_booking 
    ON "SupportTickets"("bookingId", status) 
    WHERE "bookingId" IS NOT NULL;

-- Promo Codes: Active codes validation
CREATE INDEX IF NOT EXISTS idx_promo_codes_active_valid 
    ON "PromoCodes"(code, "isActive", "validFrom", "validUntil") 
    WHERE "isActive" = true;

-- Promo Codes: Code lookup (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_promo_codes_code_lower 
    ON "PromoCodes"(LOWER(code));

-- Promo Codes: Usage tracking
CREATE INDEX IF NOT EXISTS idx_promo_codes_usage 
    ON "PromoCodes"("usageCount", "usageLimit") 
    WHERE "isActive" = true;

-- Destination Images: Get images for destination ordered
CREATE INDEX IF NOT EXISTS idx_destination_images_dest_order 
    ON "DestinationImages"("destinationId", "order", "isMain");

-- ============================================
-- JSONB INDEXES for JSON Column Queries
-- ============================================

-- Destinations: Coordinates for geospatial queries
CREATE INDEX IF NOT EXISTS idx_destinations_coordinates 
    ON "Destinations" USING gin(coordinates);

-- Destinations: Duration for filtering
CREATE INDEX IF NOT EXISTS idx_destinations_duration 
    ON "Destinations" USING gin(duration);

-- Users: Address for location-based queries
CREATE INDEX IF NOT EXISTS idx_users_address 
    ON "Users" USING gin(address);

-- Users: Preferences
CREATE INDEX IF NOT EXISTS idx_users_preferences 
    ON "Users" USING gin(preferences);

-- ============================================
-- PARTIAL INDEXES for Specific Use Cases
-- ============================================

-- Find suspended users only (for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_users_suspended_only 
    ON "Users"("suspendedAt" DESC, role) 
    WHERE "isSuspended" = true;

-- Recent user registrations
CREATE INDEX IF NOT EXISTS idx_users_recent_registrations 
    ON "Users"("createdAt" DESC) 
    WHERE "emailVerified" = false;

-- Active pending bookings requiring attention
CREATE INDEX IF NOT EXISTS idx_bookings_pending_attention 
    ON "Bookings"("createdAt") 
    WHERE status = 'pending' AND "paymentStatus" = 'pending';

-- Failed payments for retry
CREATE INDEX IF NOT EXISTS idx_payments_failed 
    ON "Payments"("createdAt" DESC) 
    WHERE status = 'failed';

-- High priority open tickets
CREATE INDEX IF NOT EXISTS idx_tickets_high_priority_open 
    ON "SupportTickets"("createdAt") 
    WHERE priority IN ('high', 'urgent') AND status IN ('open', 'in_progress');

-- Reviews awaiting admin response
CREATE INDEX IF NOT EXISTS idx_reviews_needs_response 
    ON "Reviews"("createdAt") 
    WHERE "adminResponse" IS NULL AND "isPublished" = true;

-- ============================================
-- COVERING INDEXES (Include Columns)
-- ============================================

-- Bookings: List view optimization
CREATE INDEX IF NOT EXISTS idx_bookings_list_covering 
    ON "Bookings"("userId", "createdAt" DESC) 
    INCLUDE (status, "totalAmount", "bookingNumber");

-- Destinations: Search results optimization
CREATE INDEX IF NOT EXISTS idx_destinations_search_covering 
    ON "Destinations"("isActive", country, price) 
    INCLUDE (name, "shortDescription", "mainImage", rating, "reviewCount")
    WHERE "isActive" = true;

-- ============================================
-- TEXT SEARCH INDEXES
-- ============================================

-- Enable pg_trgm extension for fuzzy text search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Destinations: Search by city (fuzzy matching)
CREATE INDEX IF NOT EXISTS idx_destinations_city_trgm 
    ON "Destinations" USING gin(city gin_trgm_ops);

-- Support Tickets: Search by subject
CREATE INDEX IF NOT EXISTS idx_tickets_subject_trgm 
    ON "SupportTickets" USING gin(subject gin_trgm_ops);

-- Users: Search by name
CREATE INDEX IF NOT EXISTS idx_users_name_trgm 
    ON "Users" USING gin(("firstName" || ' ' || "lastName") gin_trgm_ops);

-- ============================================
-- BTREE INDEXES for Sorting & Range Queries
-- ============================================

-- Destinations: Price sorting
CREATE INDEX IF NOT EXISTS idx_destinations_price_sort 
    ON "Destinations"(price ASC, rating DESC) 
    WHERE "isActive" = true;

-- Bookings: Date-based reporting
CREATE INDEX IF NOT EXISTS idx_bookings_created_at_range 
    ON "Bookings"("createdAt") 
    WHERE status IN ('confirmed', 'completed');

-- Payments: Date-based financial reporting
CREATE INDEX IF NOT EXISTS idx_payments_created_date_amount 
    ON "Payments"("createdAt", amount) 
    WHERE status = 'success';

-- Reviews: Recent reviews
CREATE INDEX IF NOT EXISTS idx_reviews_recent 
    ON "Reviews"("createdAt" DESC, "destinationId") 
    WHERE "isPublished" = true;

-- ============================================
-- UNIQUE CONSTRAINT INDEXES (already created by constraints)
-- ============================================
-- The following are automatically created by UNIQUE constraints:
-- - Users.email
-- - Destinations.slug
-- - Bookings.bookingNumber
-- - Payments.transactionId
-- - SupportTickets.ticketNumber
-- - PromoCodes.code

-- ============================================
-- PERFORMANCE TUNING NOTES
-- ============================================

-- Analyze tables to update statistics after creating indexes
ANALYZE "Users";
ANALYZE "Destinations";
ANALYZE "Bookings";
ANALYZE "Payments";
ANALYZE "Reviews";
ANALYZE "SupportTickets";
ANALYZE "PromoCodes";
ANALYZE "DestinationImages";

-- To monitor index usage, run:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan;

-- To find unused indexes, run:
-- SELECT schemaname, tablename, indexname, idx_scan
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0 AND indexrelname NOT LIKE 'pg_toast%'
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- Recommended maintenance:
-- Run VACUUM ANALYZE periodically to keep statistics fresh
-- Run REINDEX when indexes become bloated
