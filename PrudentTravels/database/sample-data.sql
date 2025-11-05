-- PrudentTravels Sample Data
-- This file contains sample data for testing and development
--
-- IMPORTANT: This script is designed to be run on a fresh database or after
-- clearing existing data. Some tables (like DestinationImages) will create
-- duplicates if run multiple times. Other tables use ON CONFLICT to handle
-- duplicates for core entities (Users, Destinations, Bookings, etc.)

-- ============================================
-- 1. USERS
-- ============================================
-- Note: Password is 'password123' hashed with bcrypt (10 rounds)
-- Hash: $2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO

-- Admin User
INSERT INTO "Users" (id, "firstName", "lastName", email, password, phone, role, avatar, bio, "emailVerified", "isActive", "isSuspended", "lastLogin", "createdAt", "updatedAt") VALUES
('a1a1a1a1-a1a1-41a1-a1a1-a1a1a1a1a1a1', 'Admin', 'User', 'admin@prudenttravels.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1234567890', 'admin', 'https://i.pravatar.cc/300?img=1', 'System administrator with full access to all features', true, true, false, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '6 months', NOW())
ON CONFLICT (email) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    avatar = EXCLUDED.avatar,
    bio = EXCLUDED.bio,
    "updatedAt" = NOW();

-- Support Staff
INSERT INTO "Users" (id, "firstName", "lastName", email, password, phone, role, avatar, bio, "emailVerified", "isActive", "isSuspended", "lastLogin", "createdAt", "updatedAt") VALUES
('b2b2b2b2-b2b2-42b2-b2b2-b2b2b2b2b2b2', 'Sarah', 'Johnson', 'sarah.support@prudenttravels.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1234567891', 'support', 'https://i.pravatar.cc/300?img=5', 'Customer support specialist helping travelers worldwide', true, true, false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 months', NOW()),
('b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'Michael', 'Chen', 'michael.support@prudenttravels.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1234567892', 'support', 'https://i.pravatar.cc/300?img=12', 'Dedicated to providing excellent customer service', true, true, false, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '4 months', NOW())
ON CONFLICT (email) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    avatar = EXCLUDED.avatar,
    bio = EXCLUDED.bio,
    "updatedAt" = NOW();

-- Active Travelers
INSERT INTO "Users" (id, "firstName", "lastName", email, password, phone, role, avatar, bio, address, preferences, "emailVerified", "isActive", "isSuspended", "lastLogin", "createdAt", "updatedAt") VALUES
('c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'John', 'Smith', 'john.smith@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555123456', 'traveler', 'https://i.pravatar.cc/300?img=15', 'Adventure seeker and photography enthusiast', '{"street": "123 Main St", "city": "New York", "state": "NY", "country": "USA", "zipCode": "10001"}', '{"newsletter": true, "notifications": true, "currency": "USD", "language": "en"}', true, true, false, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 year', NOW()),
('c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2', 'Emily', 'Davis', 'emily.davis@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555234567', 'traveler', 'https://i.pravatar.cc/300?img=20', 'Love exploring new cultures and cuisines', '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "country": "USA", "zipCode": "90001"}', '{"newsletter": true, "notifications": true, "currency": "USD", "language": "en"}', true, true, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 months', NOW()),
('c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c3c3', 'David', 'Martinez', 'david.martinez@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555345678', 'traveler', 'https://i.pravatar.cc/300?img=33', 'Nature lover and hiking enthusiast', '{"street": "789 Pine Rd", "city": "Denver", "state": "CO", "country": "USA", "zipCode": "80201"}', '{"newsletter": false, "notifications": true, "currency": "USD", "language": "en"}', true, true, false, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '6 months', NOW()),
('c4c4c4c4-c4c4-44c4-84c4-c4c4c4c4c4c4', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555456789', 'traveler', 'https://i.pravatar.cc/300?img=45', 'Travel blogger sharing experiences from around the world', '{"street": "321 Elm St", "city": "Miami", "state": "FL", "country": "USA", "zipCode": "33101"}', '{"newsletter": true, "notifications": true, "currency": "USD", "language": "en"}', true, true, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 months', NOW()),
('c5c5c5c5-c5c5-45c5-85c5-c5c5c5c5c5c5', 'Robert', 'Wilson', 'robert.wilson@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555567890', 'traveler', 'https://i.pravatar.cc/300?img=52', 'Retired teacher exploring the world', '{"street": "654 Maple Dr", "city": "Seattle", "state": "WA", "country": "USA", "zipCode": "98101"}', '{"newsletter": true, "notifications": false, "currency": "USD", "language": "en"}', true, true, false, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '2 years', NOW())
ON CONFLICT (email) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    avatar = EXCLUDED.avatar,
    bio = EXCLUDED.bio,
    address = EXCLUDED.address,
    preferences = EXCLUDED.preferences,
    "updatedAt" = NOW();

-- Suspended User
INSERT INTO "Users" (id, "firstName", "lastName", email, password, phone, role, avatar, bio, "emailVerified", "isActive", "isSuspended", "suspendedAt", "suspensionReason", "lastLogin", "createdAt", "updatedAt") VALUES
('d1d1d1d1-d1d1-41d1-81d1-d1d1d1d1d1d1', 'Suspended', 'User', 'suspended.user@email.com', '$2a$10$XQKmBvCQPGxJkE.jP5nVbOqC5p6FQ9UqPqH7yqJ3p1rKKKqVqPJWO', '+1555678901', 'traveler', 'https://i.pravatar.cc/300?img=60', 'Account suspended for policy violations', true, false, true, NOW() - INTERVAL '7 days', 'Multiple failed payment attempts and suspicious activity detected. Please contact support for more information.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '4 months', NOW())
ON CONFLICT (email) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    phone = EXCLUDED.phone,
    "isActive" = EXCLUDED."isActive",
    "isSuspended" = EXCLUDED."isSuspended",
    "suspendedAt" = EXCLUDED."suspendedAt",
    "suspensionReason" = EXCLUDED."suspensionReason",
    "updatedAt" = NOW();

-- ============================================
-- 2. DESTINATIONS
-- ============================================

INSERT INTO "Destinations" (id, name, slug, description, "shortDescription", "mainImage", country, city, address, coordinates, price, "originalPrice", currency, duration, category, highlights, included, "notIncluded", itinerary, "maxGroupSize", "minGroupSize", difficulty, "ageRange", languages, rating, "reviewCount", "bookingCount", tags, "seoTitle", "seoDescription", "seoKeywords", "isActive", "isFeatured", "viewCount", "createdAt", "updatedAt") VALUES
-- Paris Adventure
('d1d1d1d1-1111-4111-8111-111111111111', 'Romantic Paris Experience', 'romantic-paris-experience', 'Discover the magic of Paris with this comprehensive 5-day tour. Visit iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Enjoy authentic French cuisine at local bistros, stroll along the Seine River, and experience the charming Montmartre district. This romantic getaway includes guided tours, skip-the-line access to major attractions, and plenty of free time to explore on your own.', 'Experience the City of Light with guided tours to iconic landmarks, authentic French cuisine, and romantic Seine River walks.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'France', 'Paris', '15 Avenue de la Bourdonnais, 75007 Paris', '{"latitude": 48.8584, "longitude": 2.2945}', 1299.00, 1599.00, 'USD', '{"days": 5, "nights": 4}', ARRAY['City', 'Culture', 'Romance'], ARRAY['Skip-the-line Eiffel Tower access', 'Louvre Museum guided tour', 'Seine River cruise', 'Montmartre walking tour', 'French cooking class'], ARRAY['4-star hotel accommodation', 'Daily breakfast', 'Airport transfers', 'Professional English-speaking guide', 'All entrance fees'], ARRAY['International flights', 'Lunch and dinner (except cooking class)', 'Travel insurance', 'Personal expenses'], '[{"day": 1, "title": "Arrival & Eiffel Tower", "description": "Arrive in Paris, hotel check-in, evening Eiffel Tower visit with skip-the-line access"}, {"day": 2, "title": "Louvre & Latin Quarter", "description": "Guided tour of the Louvre Museum, afternoon in Latin Quarter, evening Seine River cruise"}, {"day": 3, "title": "Versailles Day Trip", "description": "Full-day excursion to Palace of Versailles with gardens"}, {"day": 4, "title": "Montmartre & Cooking Class", "description": "Morning walking tour of Montmartre, afternoon French cooking class"}, {"day": 5, "title": "Departure", "description": "Free morning for shopping, airport transfer"}]', 15, 2, 'Easy', '{"min": 16, "max": 80}', ARRAY['English', 'French'], 4.8, 127, 342, ARRAY['romantic', 'culture', 'history', 'food', 'photography'], 'Romantic Paris Tour - 5 Days City of Light Experience', 'Book your romantic Paris getaway with guided tours, skip-the-line access, and authentic French experiences. Perfect for couples and culture lovers.', ARRAY['Paris tour', 'Eiffel Tower', 'Louvre Museum', 'romantic getaway', 'France travel'], true, true, 5847, NOW() - INTERVAL '8 months', NOW()),

-- Tokyo Experience
('d2d2d2d2-2222-4222-8222-222222222222', 'Tokyo Cultural Immersion', 'tokyo-cultural-immersion', 'Immerse yourself in the fascinating blend of ancient traditions and modern innovation in Tokyo. This 6-day tour takes you through historic temples, bustling markets, serene gardens, and cutting-edge technology districts. Experience authentic tea ceremonies, visit Mount Fuji, explore the famous Tsukiji Fish Market, and discover the vibrant neighborhoods of Shibuya, Harajuku, and Akihabara. Perfect for first-time visitors to Japan.', 'Explore Tokyo''s unique blend of tradition and modernity with temple visits, tea ceremonies, Mount Fuji excursion, and vibrant city districts.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'Japan', 'Tokyo', 'Shibuya City, Tokyo 150-0002', '{"latitude": 35.6762, "longitude": 139.6503}', 1899.00, 2299.00, 'USD', '{"days": 6, "nights": 5}', ARRAY['City', 'Culture', 'Adventure'], ARRAY['Traditional tea ceremony', 'Mount Fuji day trip', 'Tsukiji Fish Market tour', 'Senso-ji Temple visit', 'Tokyo Skytree observation deck'], ARRAY['5-star hotel accommodation', 'Daily breakfast', 'Airport transfers', 'JR Pass for local trains', 'English-speaking guide', 'All entrance fees'], ARRAY['International flights', 'Lunch and dinner', 'Travel insurance', 'Optional activities', 'Personal expenses'], '[{"day": 1, "title": "Arrival & Shibuya", "description": "Hotel check-in, explore Shibuya crossing and Harajuku district"}, {"day": 2, "title": "Historic Tokyo", "description": "Visit Senso-ji Temple, Imperial Palace, traditional tea ceremony"}, {"day": 3, "title": "Mount Fuji Excursion", "description": "Full-day trip to Mount Fuji, visit Hakone hot springs"}, {"day": 4, "title": "Market & Gardens", "description": "Early morning Tsukiji Fish Market tour, afternoon at Meiji Shrine and Yoyogi Park"}, {"day": 5, "title": "Modern Tokyo", "description": "Akihabara electronics district, Tokyo Skytree, evening in Roppongi"}, {"day": 6, "title": "Departure", "description": "Free morning for shopping, airport transfer"}]', 12, 2, 'Easy', '{"min": 18, "max": 75}', ARRAY['English', 'Japanese'], 4.9, 198, 421, ARRAY['japan', 'tokyo', 'culture', 'temples', 'mount-fuji', 'technology'], 'Tokyo Cultural Tour - 6 Days Japan Experience', 'Discover Tokyo''s perfect blend of tradition and innovation. Visit temples, experience tea ceremonies, and explore vibrant districts.', ARRAY['Tokyo tour', 'Japan travel', 'Mount Fuji', 'tea ceremony', 'cultural experience'], true, true, 7234, NOW() - INTERVAL '7 months', NOW()),

-- Swiss Alps Adventure
('d3d3d3d3-3333-4333-8333-333333333333', 'Swiss Alps Adventure Trek', 'swiss-alps-adventure-trek', 'Challenge yourself with this breathtaking 7-day hiking adventure through the Swiss Alps. Trek through pristine alpine meadows, past crystal-clear mountain lakes, and enjoy panoramic views of iconic peaks including the Matterhorn, Eiger, and Jungfrau. Stay in traditional mountain huts and charming alpine villages. This moderate to challenging trek is perfect for active travelers who love nature and stunning mountain scenery.', 'Trek through pristine Swiss Alps with stunning mountain views, traditional huts, and iconic peaks including the Matterhorn.', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7', 'Switzerland', 'Zermatt', 'Bahnhofplatz 14, 3920 Zermatt', '{"latitude": 46.0207, "longitude": 7.7491}', 2499.00, 2999.00, 'USD', '{"days": 7, "nights": 6}', ARRAY['Adventure', 'Nature', 'Hiking'], ARRAY['Professional mountain guide', 'Matterhorn base camp trek', 'Gornergrat railway ride', 'Alpine lake swimming', 'Traditional Swiss dinner'], ARRAY['Mountain hut & hotel accommodation', 'All breakfasts and dinners', 'Cable car tickets', 'Trekking permits', 'Professional guide', 'Emergency evacuation insurance'], ARRAY['International flights', 'Lunches', 'Personal trekking equipment rental', 'Travel insurance', 'Tips for guides'], '[{"day": 1, "title": "Arrival in Zermatt", "description": "Meet the group, equipment check, easy acclimatization walk"}, {"day": 2, "title": "Zermatt to Täsch Hut", "description": "6-hour trek through alpine meadows to mountain hut"}, {"day": 3, "title": "Hörnli Ridge Base", "description": "Trek to Matterhorn base camp, stunning mountain views"}, {"day": 4, "title": "Gornergrat & Riffelberg", "description": "Panoramic train ride, trek through glacier views"}, {"day": 5, "title": "Five Lakes Trail", "description": "Famous trail past five mountain lakes"}, {"day": 6, "title": "Swiss Village Tour", "description": "Visit traditional villages, Swiss culture experience"}, {"day": 7, "title": "Departure", "description": "Final mountain views, return to valley"}]', 10, 4, 'Challenging', '{"min": 16, "max": 60}', ARRAY['English', 'German'], 4.7, 89, 156, ARRAY['hiking', 'mountains', 'adventure', 'nature', 'switzerland', 'alpine'], 'Swiss Alps Trek - 7 Day Mountain Adventure', 'Experience the beauty of Swiss Alps with guided treks, mountain huts, and iconic peak views. Perfect for active adventurers.', ARRAY['Swiss Alps', 'hiking tour', 'Matterhorn', 'mountain trekking', 'Switzerland adventure'], true, true, 4521, NOW() - INTERVAL '6 months', NOW()),

-- Bali Wellness Retreat
('d4d4d4d4-4444-4444-8444-444444444444', 'Bali Wellness & Yoga Retreat', 'bali-wellness-yoga-retreat', 'Rejuvenate your mind, body, and soul with this transformative 8-day wellness retreat in Bali. Practice daily yoga overlooking rice terraces, enjoy traditional Balinese spa treatments, learn meditation techniques, and savor healthy organic cuisine. Visit ancient temples, participate in purification ceremonies, and discover the spiritual side of Bali. Perfect for those seeking relaxation, healing, and personal growth in a tropical paradise.', 'Rejuvenate in paradise with daily yoga, spa treatments, meditation, temple visits, and organic cuisine in beautiful Bali.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'Indonesia', 'Ubud', 'Jalan Raya Sanggingan, Ubud, Gianyar', '{"latitude": -8.5069, "longitude": 115.2625}', 1699.00, 2199.00, 'USD', '{"days": 8, "nights": 7}', ARRAY['Wellness', 'Yoga', 'Relaxation'], ARRAY['Daily yoga sessions', 'Traditional Balinese massage', 'Meditation workshops', 'Temple purification ceremony', 'Rice terrace trek'], ARRAY['Luxury resort accommodation', 'All organic meals', 'Daily yoga & meditation', 'Spa treatments (3 sessions)', 'Airport transfers', 'Temple entrance fees'], ARRAY['International flights', 'Additional spa treatments', 'Travel insurance', 'Optional excursions', 'Personal expenses'], '[{"day": 1, "title": "Arrival & Welcome", "description": "Resort check-in, welcome ceremony, evening gentle yoga"}, {"day": 2, "title": "Yoga & Temples", "description": "Morning yoga, visit Tirta Empul water temple, purification ritual"}, {"day": 3, "title": "Wellness Focus", "description": "Sunrise yoga, spa treatment, meditation workshop"}, {"day": 4, "title": "Rice Terrace Trek", "description": "Guided walk through Tegalalang rice terraces, local village visit"}, {"day": 5, "title": "Creative Day", "description": "Yoga, Balinese cooking class, traditional art workshop"}, {"day": 6, "title": "Beach Excursion", "description": "Day trip to Seminyak beach, sunset yoga by the ocean"}, {"day": 7, "title": "Integration", "description": "Final spa treatment, closing ceremony, farewell dinner"}, {"day": 8, "title": "Departure", "description": "Morning meditation, airport transfer"}]', 16, 1, 'Easy', '{"min": 21, "max": 70}', ARRAY['English', 'Indonesian'], 4.9, 143, 287, ARRAY['wellness', 'yoga', 'meditation', 'bali', 'retreat', 'spa', 'relaxation'], 'Bali Yoga Retreat - 8 Day Wellness & Spa Experience', 'Transform your wellbeing in Bali with daily yoga, spa treatments, meditation, and organic cuisine. Perfect for relaxation seekers.', ARRAY['Bali retreat', 'yoga vacation', 'wellness tour', 'spa retreat', 'meditation'], true, true, 6892, NOW() - INTERVAL '5 months', NOW()),

-- Safari Adventure
('d5d5d5d5-5555-4555-8555-555555555555', 'Tanzania Safari Adventure', 'tanzania-safari-adventure', 'Embark on the wildlife adventure of a lifetime with this 9-day Tanzania safari. Witness the Great Migration in Serengeti, explore the stunning Ngorongoro Crater, and encounter the Big Five in their natural habitat. Stay in luxury tented camps, enjoy game drives led by expert guides, and experience the raw beauty of African wilderness. Visit Maasai villages and learn about traditional culture. An unforgettable journey for wildlife enthusiasts.', 'Witness the Great Migration and Big Five on luxury safari through Serengeti and Ngorongoro Crater with expert guides.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801', 'Tanzania', 'Arusha', 'Serengeti Road, Arusha', '{"latitude": -3.3869, "longitude": 36.6830}', 3499.00, 4299.00, 'USD', '{"days": 9, "nights": 8}', ARRAY['Adventure', 'Wildlife', 'Nature'], ARRAY['Big Five game drives', 'Great Migration viewing', 'Ngorongoro Crater tour', 'Maasai village visit', 'Hot air balloon safari (optional)'], ARRAY['Luxury tented camp accommodation', 'All meals included', 'All game drives & park fees', '4x4 safari vehicle', 'Professional guide', 'Airport transfers'], ARRAY['International flights', 'Visa fees', 'Travel insurance', 'Hot air balloon safari ($550)', 'Tips for guides and staff', 'Personal expenses'], '[{"day": 1, "title": "Arrival in Arusha", "description": "Airport pickup, hotel check-in, safari briefing"}, {"day": 2, "title": "Tarangire National Park", "description": "Full day game drive, elephant herds, baobab trees"}, {"day": 3, "title": "Serengeti Arrival", "description": "Drive to Serengeti, afternoon game drive"}, {"day": 4, "title": "Central Serengeti", "description": "Full day exploring central plains, big cat territory"}, {"day": 5, "title": "Great Migration Area", "description": "Witness the Great Migration, river crossings (seasonal)"}, {"day": 6, "title": "Ngorongoro Crater", "description": "Full day in the crater, dense wildlife viewing"}, {"day": 7, "title": "Crater Highlands", "description": "Explore crater highlands, Maasai village visit"}, {"day": 8, "title": "Lake Manyara", "description": "Tree-climbing lions, flamingos, diverse ecosystems"}, {"day": 9, "title": "Departure", "description": "Morning at leisure, transfer to Kilimanjaro Airport"}]', 8, 2, 'Moderate', '{"min": 12, "max": 70}', ARRAY['English', 'Swahili'], 5.0, 164, 298, ARRAY['safari', 'wildlife', 'africa', 'serengeti', 'big-five', 'migration', 'adventure'], 'Tanzania Safari - 9 Day Wildlife Adventure Tour', 'Experience the ultimate African safari in Tanzania. Witness the Great Migration, see the Big Five, and stay in luxury camps.', ARRAY['Tanzania safari', 'Serengeti tour', 'wildlife safari', 'African adventure', 'Ngorongoro Crater'], true, true, 8956, NOW() - INTERVAL '4 months', NOW()),

-- Iceland Adventure
('d6d6d6d6-6666-4666-8666-666666666666', 'Iceland Northern Lights Experience', 'iceland-northern-lights-experience', 'Discover the land of fire and ice on this spectacular 7-day Iceland adventure. Chase the magical Northern Lights, relax in geothermal hot springs, explore ice caves, and witness powerful waterfalls. Visit the famous Blue Lagoon, walk on black sand beaches, see massive glaciers, and explore the Golden Circle. Experience Iceland''s unique landscape of volcanoes, geysers, and dramatic coastlines in the heart of winter.', 'Chase Northern Lights, explore ice caves, relax in hot springs, and discover Iceland''s dramatic landscapes and waterfalls.', 'https://images.unsplash.com/photo-1504829857797-ddff29c27927', 'Iceland', 'Reykjavik', 'Hallgrímskirkja, 101 Reykjavík', '{"latitude": 64.1466, "longitude": -21.9426}', 2799.00, 3399.00, 'USD', '{"days": 7, "nights": 6}', ARRAY['Adventure', 'Nature', 'Photography'], ARRAY['Northern Lights hunting (3 nights)', 'Ice cave exploration', 'Blue Lagoon entry', 'Golden Circle tour', 'Glacier hiking'], ARRAY['4-star hotel accommodation', 'Daily breakfast', '4x4 vehicle with driver-guide', 'All entrance fees & permits', 'Airport transfers', 'Winter gear provided'], ARRAY['International flights', 'Lunch and dinner', 'Travel insurance', 'Optional helicopter tour', 'Personal expenses'], '[{"day": 1, "title": "Arrival & Reykjavik", "description": "Airport pickup, city orientation, evening Northern Lights hunt"}, {"day": 2, "title": "Golden Circle", "description": "Þingvellir National Park, Geysir, Gullfoss waterfall"}, {"day": 3, "title": "South Coast", "description": "Seljalandsfoss, Skógafoss, black sand beach, Northern Lights"}, {"day": 4, "title": "Ice Cave Adventure", "description": "Glacier hiking, natural ice cave exploration"}, {"day": 5, "title": "Jökulsárlón", "description": "Glacier lagoon, diamond beach, seal watching"}, {"day": 6, "title": "Blue Lagoon", "description": "Relaxation in geothermal spa, evening city exploration"}, {"day": 7, "title": "Departure", "description": "Free morning, transfer to Keflavik Airport"}]', 12, 2, 'Moderate', '{"min": 18, "max": 65}', ARRAY['English', 'Icelandic'], 4.8, 156, 334, ARRAY['northern-lights', 'iceland', 'glacier', 'ice-cave', 'adventure', 'photography'], 'Iceland Northern Lights - 7 Day Winter Adventure', 'Hunt for Northern Lights and explore Iceland''s stunning winter landscapes. Ice caves, hot springs, and dramatic scenery await.', ARRAY['Northern Lights tour', 'Iceland adventure', 'Blue Lagoon', 'ice cave', 'glacier hiking'], true, true, 7654, NOW() - INTERVAL '3 months', NOW())
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    "shortDescription" = EXCLUDED."shortDescription",
    "mainImage" = EXCLUDED."mainImage",
    country = EXCLUDED.country,
    city = EXCLUDED.city,
    address = EXCLUDED.address,
    coordinates = EXCLUDED.coordinates,
    price = EXCLUDED.price,
    "originalPrice" = EXCLUDED."originalPrice",
    duration = EXCLUDED.duration,
    category = EXCLUDED.category,
    highlights = EXCLUDED.highlights,
    included = EXCLUDED.included,
    "notIncluded" = EXCLUDED."notIncluded",
    itinerary = EXCLUDED.itinerary,
    "maxGroupSize" = EXCLUDED."maxGroupSize",
    "minGroupSize" = EXCLUDED."minGroupSize",
    difficulty = EXCLUDED.difficulty,
    "ageRange" = EXCLUDED."ageRange",
    languages = EXCLUDED.languages,
    tags = EXCLUDED.tags,
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "seoKeywords" = EXCLUDED."seoKeywords",
    "updatedAt" = NOW();

-- ============================================
-- 3. DESTINATION IMAGES
-- ============================================

INSERT INTO "DestinationImages" ("destinationId", url, caption, "isMain", "order", "createdAt", "updatedAt") VALUES
-- Paris images
('d1d1d1d1-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'Eiffel Tower at sunset', true, 0, NOW(), NOW()),
('d1d1d1d1-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', 'Louvre Museum', false, 1, NOW(), NOW()),
('d1d1d1d1-1111-4111-8111-111111111111', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f', 'Seine River cruise', false, 2, NOW(), NOW()),
-- Tokyo images
('d2d2d2d2-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'Tokyo cityscape at night', true, 0, NOW(), NOW()),
('d2d2d2d2-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1528164344705-47542687000d', 'Traditional temple', false, 1, NOW(), NOW()),
('d2d2d2d2-2222-4222-8222-222222222222', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989', 'Mount Fuji view', false, 2, NOW(), NOW()),
-- Swiss Alps images
('d3d3d3d3-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7', 'Matterhorn peak', true, 0, NOW(), NOW()),
('d3d3d3d3-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'Alpine meadow trail', false, 1, NOW(), NOW()),
('d3d3d3d3-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1531973576160-7125cd663d86', 'Mountain lake', false, 2, NOW(), NOW());

-- ============================================
-- 4. PROMO CODES
-- ============================================

INSERT INTO "PromoCodes" (id, code, description, "discountType", "discountValue", "minimumPurchase", "maximumDiscount", "validFrom", "validUntil", "usageLimit", "usageCount", "usageLimitPerUser", "isActive", terms, "createdAt", "updatedAt") VALUES
('f1f1f1f1-f1f1-41f1-81f1-f1f1f1f1f1f1', 'WELCOME20', 'Welcome discount for new customers', 'percentage', 20.00, 500.00, 200.00, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', 100, 23, 1, true, 'Valid for first-time bookings only. Minimum purchase $500.', NOW() - INTERVAL '1 month', NOW()),
('f2f2f2f2-f2f2-42f2-82f2-f2f2f2f2f2f2', 'SUMMER2025', 'Summer special discount', 'percentage', 15.00, 1000.00, 300.00, NOW() - INTERVAL '15 days', NOW() + INTERVAL '3 months', 200, 45, 1, true, 'Valid for summer destinations. Minimum purchase $1000.', NOW() - INTERVAL '15 days', NOW()),
('f3f3f3f3-f3f3-43f3-83f3-f3f3f3f3f3f3', 'EARLYBIRD', 'Early bird booking discount', 'fixed', 100.00, 1500.00, NULL, NOW(), NOW() + INTERVAL '6 months', NULL, 12, 1, true, 'Book 60 days in advance. Minimum purchase $1500.', NOW(), NOW()),
('f4f4f4f4-f4f4-44f4-84f4-f4f4f4f4f4f4', 'FLASH50', 'Flash sale discount', 'fixed', 50.00, 800.00, NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day', 50, 50, 1, false, 'Limited time flash sale. Expired.', NOW() - INTERVAL '30 days', NOW())
ON CONFLICT (code) DO UPDATE SET
    description = EXCLUDED.description,
    "discountType" = EXCLUDED."discountType",
    "discountValue" = EXCLUDED."discountValue",
    "minimumPurchase" = EXCLUDED."minimumPurchase",
    "maximumDiscount" = EXCLUDED."maximumDiscount",
    "updatedAt" = NOW();

-- ============================================
-- 5. BOOKINGS
-- ============================================

INSERT INTO "Bookings" (id, "bookingNumber", "userId", "destinationId", "checkInDate", "checkOutDate", adults, children, infants, "totalGuests", "basePrice", taxes, discount, "totalAmount", currency, status, "paymentStatus", "paymentMethod", "promoCode", "specialRequests", "guestDetails", "createdAt", "updatedAt") VALUES
-- Confirmed bookings
('b1b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b1', 'PT202410001', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'd1d1d1d1-1111-4111-8111-111111111111', '2025-12-15', '2025-12-19', 2, 0, 0, 2, 2598.00, 259.80, 519.60, 2338.20, 'USD', 'confirmed', 'success', 'credit_card', 'WELCOME20', 'Room with Eiffel Tower view please', '{"leadGuest": {"name": "John Smith", "email": "john.smith@email.com", "phone": "+1555123456"}}', NOW() - INTERVAL '45 days', NOW()),
('b2b2b2b2-b2b2-42b2-b2b2-b2b2b2b2b2b2', 'PT202410002', 'c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2', 'd4d4d4d4-4444-4444-8444-444444444444', '2025-11-20', '2025-11-27', 1, 0, 0, 1, 1699.00, 169.90, 0.00, 1868.90, 'USD', 'confirmed', 'success', 'paypal', NULL, 'Vegetarian meals please', '{"leadGuest": {"name": "Emily Davis", "email": "emily.davis@email.com", "phone": "+1555234567"}}', NOW() - INTERVAL '30 days', NOW()),
('b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'PT202410003', 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c3c3', 'd3d3d3d3-3333-4333-8333-333333333333', '2026-01-10', '2026-01-16', 2, 0, 0, 2, 4998.00, 499.80, 0.00, 5497.80, 'USD', 'confirmed', 'success', 'credit_card', NULL, 'First time trekking, need equipment advice', '{"leadGuest": {"name": "David Martinez", "email": "david.martinez@email.com", "phone": "+1555345678"}}', NOW() - INTERVAL '20 days', NOW()),

-- Pending booking
('b4b4b4b4-b4b4-44b4-b4b4-b4b4b4b4b4b4', 'PT202410004', 'c4c4c4c4-c4c4-44c4-84c4-c4c4c4c4c4c4', 'd2d2d2d2-2222-4222-8222-222222222222', '2026-02-15', '2026-02-20', 2, 1, 0, 3, 5697.00, 569.70, 0.00, 6266.70, 'USD', 'pending', 'pending', NULL, NULL, 'Child is 10 years old', '{"leadGuest": {"name": "Lisa Anderson", "email": "lisa.anderson@email.com", "phone": "+1555456789"}}', NOW() - INTERVAL '2 days', NOW()),

-- Completed booking
('b5b5b5b5-b5b5-45b5-b5b5-b5b5b5b5b5b5', 'PT202409001', 'c5c5c5c5-c5c5-45c5-85c5-c5c5c5c5c5c5', 'd5d5d5d5-5555-4555-8555-555555555555', '2025-09-15', '2025-09-23', 2, 0, 0, 2, 6998.00, 699.80, 0.00, 7697.80, 'USD', 'completed', 'success', 'credit_card', NULL, NULL, '{"leadGuest": {"name": "Robert Wilson", "email": "robert.wilson@email.com", "phone": "+1555567890"}}', NOW() - INTERVAL '90 days', NOW()),

-- Cancelled booking
('b6b6b6b6-b6b6-46b6-b6b6-b6b6b6b6b6b6', 'PT202410005', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'd6d6d6d6-6666-4666-8666-666666666666', '2026-03-01', '2026-03-07', 2, 0, 0, 2, 5598.00, 559.80, 0.00, 6157.80, 'USD', 'cancelled', 'refunded', 'credit_card', NULL, NULL, '{"leadGuest": {"name": "John Smith", "email": "john.smith@email.com", "phone": "+1555123456"}}', NOW() - INTERVAL '15 days', NOW())
ON CONFLICT ("bookingNumber") DO UPDATE SET
    status = EXCLUDED.status,
    "paymentStatus" = EXCLUDED."paymentStatus",
    "updatedAt" = NOW();

-- ============================================
-- 6. PAYMENTS
-- ============================================

INSERT INTO "Payments" (id, "bookingId", "userId", "transactionId", amount, currency, status, method, provider, "providerTransactionId", "providerResponse", "createdAt", "updatedAt") VALUES
-- Successful payments
('faa1faa1-faa1-4aa1-8aa1-faa1faa1faa1', 'b1b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b1', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'TXN20241001001', 2338.20, 'USD', 'success', 'credit_card', 'stripe', 'ch_3PqRsT4u5v6w7x8y9z', '{"status": "succeeded", "brand": "visa", "last4": "4242"}', NOW() - INTERVAL '45 days', NOW()),
('faa2faa2-faa2-4aa2-8aa2-faa2faa2faa2', 'b2b2b2b2-b2b2-42b2-b2b2-b2b2b2b2b2b2', 'c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2', 'TXN20241001002', 1868.90, 'USD', 'success', 'paypal', 'paypal', 'PAYID-M123ABC456DEF789', '{"status": "COMPLETED", "email": "emily.davis@email.com"}', NOW() - INTERVAL '30 days', NOW()),
('faa3faa3-faa3-4aa3-8aa3-faa3faa3faa3', 'b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c3c3', 'TXN20241001003', 5497.80, 'USD', 'success', 'credit_card', 'stripe', 'ch_3PqRsT4u5v6w7x8y9a', '{"status": "succeeded", "brand": "mastercard", "last4": "5555"}', NOW() - INTERVAL '20 days', NOW()),
('faa5faa5-faa5-4aa5-8aa5-faa5faa5faa5', 'b5b5b5b5-b5b5-45b5-b5b5-b5b5b5b5b5b5', 'c5c5c5c5-c5c5-45c5-85c5-c5c5c5c5c5c5', 'TXN20240901001', 7697.80, 'USD', 'success', 'credit_card', 'stripe', 'ch_3PqRsT4u5v6w7x8y9b', '{"status": "succeeded", "brand": "amex", "last4": "1111"}', NOW() - INTERVAL '90 days', NOW()),

-- Refunded payment
('faa6faa6-faa6-4aa6-8aa6-faa6faa6faa6', 'b6b6b6b6-b6b6-46b6-b6b6-b6b6b6b6b6b6', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'TXN20241001004', 6157.80, 'USD', 'refunded', 'credit_card', 'stripe', 'ch_3PqRsT4u5v6w7x8y9c', '{"status": "refunded", "brand": "visa", "last4": "4242"}', NOW() - INTERVAL '15 days', NOW())
ON CONFLICT ("transactionId") DO UPDATE SET
    status = EXCLUDED.status,
    "updatedAt" = NOW();

-- ============================================
-- 7. REVIEWS
-- ============================================

INSERT INTO "Reviews" (id, "userId", "destinationId", "bookingId", rating, title, comment, pros, cons, "helpfulCount", "isVerified", "isPublished", "createdAt", "updatedAt") VALUES
('e1e1e1e1-e1e1-41e1-81e1-e1e1e1e1e1e1', 'c5c5c5c5-c5c5-45c5-85c5-c5c5c5c5c5c5', 'd5d5d5d5-5555-4555-8555-555555555555', 'b5b5b5b5-b5b5-45b5-b5b5-b5b5b5b5b5b5', 5, 'Incredible Safari Experience!', 'This Tanzania safari exceeded all our expectations! Seeing the Great Migration was absolutely breathtaking. The luxury tented camps were comfortable and the food was excellent. Our guide was knowledgeable and helped us spot so much wildlife including all of the Big Five. The Ngorongoro Crater was stunning with incredible density of animals. Highly recommend this tour for anyone who loves wildlife and nature.', ARRAY['Amazing wildlife viewing', 'Excellent guide', 'Comfortable accommodation', 'Well organized'], ARRAY['Long driving days', 'Expensive optional activities'], 24, true, true, NOW() - INTERVAL '60 days', NOW()),
('e2e2e2e2-e2e2-42e2-82e2-e2e2e2e2e2e2', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'd1d1d1d1-1111-4111-8111-111111111111', NULL, 4, 'Magical Paris Adventure', 'Paris was everything we dreamed of and more! The skip-the-line access saved us hours of waiting. The Louvre tour was fascinating and the Seine River cruise at sunset was incredibly romantic. The French cooking class was a highlight. Our only complaint was that some days felt rushed and we would have liked more free time to explore on our own. Overall, a wonderful experience!', ARRAY['Skip-the-line access', 'Great guide', 'Romantic atmosphere', 'Cooking class was fun'], ARRAY['Some days felt rushed', 'Expensive dinners not included'], 18, false, true, NOW() - INTERVAL '35 days', NOW()),
('e3e3e3e3-e3e3-43e3-83e3-e3e3e3e3e3e3', 'c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2', 'd4d4d4d4-4444-4444-8444-444444444444', NULL, 5, 'Life-Changing Wellness Retreat', 'The Bali wellness retreat was exactly what I needed. The daily yoga sessions overlooking rice terraces were absolutely peaceful. The spa treatments were heavenly and the organic food was delicious and healthy. The meditation workshops gave me tools I still use daily. The staff was incredibly caring and attentive. The temple visit and purification ceremony was a deeply spiritual experience. I left feeling completely rejuvenated.', ARRAY['Beautiful location', 'Excellent yoga instructors', 'Amazing spa treatments', 'Healthy delicious food', 'Very peaceful'], ARRAY['Could use more free time'], 31, false, true, NOW() - INTERVAL '25 days', NOW()),
('e4e4e4e4-e4e4-44e4-84e4-e4e4e4e4e4e4', 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c3c3', 'd3d3d3d3-3333-4333-8333-333333333333', NULL, 5, 'Epic Mountain Adventure', 'The Swiss Alps trek was challenging but absolutely worth it! The views were stunning at every turn. Seeing the Matterhorn up close was a dream come true. The mountain huts were cozy and the Swiss meals were hearty and delicious. Our guide was experienced and made us feel safe throughout. The Five Lakes Trail was spectacular. This trip pushed me physically but the sense of accomplishment was incredible. Highly recommend for anyone who loves hiking!', ARRAY['Stunning scenery', 'Professional guide', 'Great group', 'Mountain huts experience', 'Well paced'], ARRAY['Physically demanding', 'Weather dependent'], 15, false, true, NOW() - INTERVAL '10 days', NOW()),
('e5e5e5e5-e5e5-45e5-85e5-e5e5e5e5e5e5', 'c4c4c4c4-c4c4-44c4-84c4-c4c4c4c4c4c4', 'd2d2d2d2-2222-4222-8222-222222222222', NULL, 5, 'Tokyo Was Amazing!', 'What an incredible introduction to Japan! The blend of ancient traditions and modern technology was fascinating. The tea ceremony was so peaceful and our guide explained the cultural significance beautifully. Mount Fuji was breathtaking. The Tsukiji Fish Market tour was amazing - fresh sushi for breakfast! Shibuya and Harajuku were so fun and vibrant. Our guide was patient with all our questions and took great photos. Tokyo Skytree views were spectacular. Already planning to return!', ARRAY['Perfect mix of traditional and modern', 'Knowledgeable guide', 'Mount Fuji trip', 'Great food experiences', 'Easy transportation with JR Pass'], ARRAY['Could spend longer in some areas'], 42, false, true, NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (id) DO UPDATE SET
    rating = EXCLUDED.rating,
    title = EXCLUDED.title,
    comment = EXCLUDED.comment,
    pros = EXCLUDED.pros,
    cons = EXCLUDED.cons,
    "updatedAt" = NOW();

-- ============================================
-- 8. SUPPORT TICKETS
-- ============================================

INSERT INTO "SupportTickets" (id, "ticketNumber", "userId", "assignedTo", "bookingId", subject, description, category, status, priority, "resolvedAt", rating, feedback, "createdAt", "updatedAt") VALUES
-- Resolved ticket
('71717171-7171-4171-8171-717171717171', 'TKT202410001', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'b2b2b2b2-b2b2-42b2-b2b2-b2b2b2b2b2b2', 'b1b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b1', 'Question about hotel room preference', 'I requested a room with an Eiffel Tower view but haven''t received confirmation. Can you verify this has been noted?', 'booking', 'resolved', 'medium', NOW() - INTERVAL '40 days', 5, 'Sarah was very helpful and confirmed my room preference quickly. Great service!', NOW() - INTERVAL '42 days', NOW()),

-- In progress ticket
('72727272-7272-4272-8272-727272727272', 'TKT202410002', 'c4c4c4c4-c4c4-44c4-84c4-c4c4c4c4c4c4', 'b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'b4b4b4b4-b4b4-44b4-b4b4-b4b4b4b4b4b4', 'Payment processing issue', 'I tried to complete my payment but the transaction failed. My bank shows a pending charge but the booking still says pending. Please help.', 'payment', 'in_progress', 'high', NULL, NULL, NULL, NOW() - INTERVAL '1 day', NOW()),

-- Open ticket
('73737373-7373-4373-8373-737373737373', 'TKT202410003', 'c2c2c2c2-c2c2-42c2-82c2-c2c2c2c2c2c2', NULL, NULL, 'Newsletter subscription issue', 'I''ve tried to unsubscribe from the newsletter multiple times but still receiving emails. Please remove me from the list.', 'technical', 'open', 'low', NULL, NULL, NULL, NOW() - INTERVAL '3 days', NOW()),

-- Resolved refund ticket
('74747474-7474-4474-8474-747474747474', 'TKT202410004', 'c1c1c1c1-c1c1-41c1-81c1-c1c1c1c1c1c1', 'b2b2b2b2-b2b2-42b2-b2b2-b2b2b2b2b2b2', 'b6b6b6b6-b6b6-46b6-b6b6-b6b6b6b6b6b6', 'Cancellation and refund request', 'Due to a family emergency, I need to cancel my Iceland booking (PT202410005). Please process a full refund. I understand there may be cancellation fees.', 'refund', 'resolved', 'high', NOW() - INTERVAL '12 days', 5, 'Sarah handled my emergency cancellation with compassion and efficiency. Received full refund within 5 business days. Thank you!', NOW() - INTERVAL '14 days', NOW()),

-- Resolved general inquiry
('75757575-7575-4575-8575-757575757575', 'TKT202410005', 'c3c3c3c3-c3c3-43c3-83c3-c3c3c3c3c3c3', 'b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'b3b3b3b3-b3b3-43b3-b3b3-b3b3b3b3b3b3', 'Equipment rental for Swiss Alps trek', 'This is my first trekking experience. What equipment is provided and what do I need to rent? Also, what''s the weather like in January?', 'general', 'resolved', 'medium', NOW() - INTERVAL '18 days', 4, 'Michael provided detailed information about equipment and weather. Very helpful!', NOW() - INTERVAL '21 days', NOW())
ON CONFLICT ("ticketNumber") DO UPDATE SET
    status = EXCLUDED.status,
    "assignedTo" = EXCLUDED."assignedTo",
    "resolvedAt" = EXCLUDED."resolvedAt",
    rating = EXCLUDED.rating,
    feedback = EXCLUDED.feedback,
    "updatedAt" = NOW();

-- ============================================
-- Update destination statistics
-- ============================================

UPDATE "Destinations" SET
    rating = 4.8,
    "reviewCount" = 2,
    "bookingCount" = 2
WHERE id = 'd1d1d1d1-1111-4111-8111-111111111111';

UPDATE "Destinations" SET
    rating = 5.0,
    "reviewCount" = 1,
    "bookingCount" = 1
WHERE id = 'd2d2d2d2-2222-4222-8222-222222222222';

UPDATE "Destinations" SET
    rating = 5.0,
    "reviewCount" = 1,
    "bookingCount" = 1
WHERE id = 'd3d3d3d3-3333-4333-8333-333333333333';

UPDATE "Destinations" SET
    rating = 5.0,
    "reviewCount" = 1,
    "bookingCount" = 1
WHERE id = 'd4d4d4d4-4444-4444-8444-444444444444';

UPDATE "Destinations" SET
    rating = 5.0,
    "reviewCount" = 1,
    "bookingCount" = 1
WHERE id = 'd5d5d5d5-5555-4555-8555-555555555555';

UPDATE "Destinations" SET
    rating = 0,
    "reviewCount" = 0,
    "bookingCount" = 1
WHERE id = 'd6d6d6d6-6666-4666-8666-666666666666';
