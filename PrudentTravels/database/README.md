# Database Sample Data

This directory contains sample data scripts for development and testing.

## Files

- `sample-data.sql` - Sample data for all tables
- `clean-sample-data.sql` - Script to clear all sample data

## Usage

### Fresh Import (Recommended)

For a clean import on your database:

```bash
# 1. Clean existing sample data (if any)
psql postgresql://USER:PASSWORD@HOST/DATABASE < clean-sample-data.sql

# 2. Import fresh sample data
psql postgresql://USER:PASSWORD@HOST/DATABASE < sample-data.sql
```

### Using with Render PostgreSQL

If you're using Render's hosted PostgreSQL:

```bash
# Clean and import in one command
psql postgresql://prudenttravels_user:QkJaVP2VAHKLBf5ZnTTwTD9JRmKAQsLy@dpg-d43kr8qdbo4c73anoir0-a.oregon-postgres.render.com/prudenttravels < clean-sample-data.sql && \
psql postgresql://prudenttravels_user:QkJaVP2VAHKLBf5ZnTTwTD9JRmKAQsLy@dpg-d43kr8qdbo4c73anoir0-a.oregon-postgres.render.com/prudenttravels < sample-data.sql
```

## Sample Data Includes

### Users (9 total)
- 1 Admin: `admin@prudenttravels.com`
- 2 Support Staff: `sarah.support@prudenttravels.com`, `michael.support@prudenttravels.com`
- 5 Active Travelers
- 1 Suspended User

**Password for all users:** `password123`

### Destinations (6 total)
- Romantic Paris Experience
- Tokyo Cultural Immersion
- Swiss Alps Adventure Trek
- Bali Wellness & Yoga Retreat
- Tanzania Safari Adventure
- Iceland Northern Lights Experience

### Other Data
- Destination Images
- Promo Codes (4 active)
- Bookings (6 with various statuses)
- Payments (5 transactions)
- Reviews (5 verified reviews)
- Support Tickets (6 with different statuses)

## UUID Format

All UUIDs in the sample data follow the UUID v4 specification (RFC 4122):
- Version field (position 13) = `4`
- Variant field (position 17) = `8`, `9`, `a`, or `b`

This ensures compatibility with express-validator and other strict UUID validators.

## Troubleshooting

### Foreign Key Errors

If you see foreign key constraint violations, it means you're trying to import data on top of existing (possibly outdated) data. Solution:

1. Run `clean-sample-data.sql` first
2. Then run `sample-data.sql`

### ON CONFLICT Errors

If you see "no unique or exclusion constraint matching ON CONFLICT", make sure you're using the latest version of `sample-data.sql` from the repository.

### Login Issues

After importing, you can log in as:
- Admin: `admin@prudenttravels.com` / `password123`
- Support: `sarah.support@prudenttravels.com` / `password123`
- Traveler: `john.smith@email.com` / `password123`

## Important Notes

⚠️ **Never run these scripts on production databases!** These are for development and testing only.

⚠️ The `clean-sample-data.sql` script will **permanently delete all data** from the specified tables.
