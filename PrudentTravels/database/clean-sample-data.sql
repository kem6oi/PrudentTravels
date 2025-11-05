-- Clean Sample Data Script
-- Run this before re-importing sample-data.sql to avoid conflicts
--
-- WARNING: This will delete ALL data from the specified tables!
-- Only run this in development environments!

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Clear all tables in reverse dependency order
TRUNCATE TABLE "SupportTickets" CASCADE;
TRUNCATE TABLE "Reviews" CASCADE;
TRUNCATE TABLE "Payments" CASCADE;
TRUNCATE TABLE "Bookings" CASCADE;
TRUNCATE TABLE "PromoCodes" CASCADE;
TRUNCATE TABLE "DestinationImages" CASCADE;
TRUNCATE TABLE "Destinations" CASCADE;
TRUNCATE TABLE "Users" CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Verify tables are empty
SELECT 'Users' as table_name, COUNT(*) as row_count FROM "Users"
UNION ALL
SELECT 'Destinations', COUNT(*) FROM "Destinations"
UNION ALL
SELECT 'DestinationImages', COUNT(*) FROM "DestinationImages"
UNION ALL
SELECT 'PromoCodes', COUNT(*) FROM "PromoCodes"
UNION ALL
SELECT 'Bookings', COUNT(*) FROM "Bookings"
UNION ALL
SELECT 'Payments', COUNT(*) FROM "Payments"
UNION ALL
SELECT 'Reviews', COUNT(*) FROM "Reviews"
UNION ALL
SELECT 'SupportTickets', COUNT(*) FROM "SupportTickets";
